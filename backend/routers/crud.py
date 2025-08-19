from fastapi import UploadFile, File
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO
from datetime import datetime
from bson import ObjectId, Binary
from motor.motor_asyncio import AsyncIOMotorClient
import environment
from models.crud_models import ResourceCreate, ResourceUpdate
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from typing import List


# --- Mongo Helpers ---
def clean_mongo_value(value):
    if isinstance(value, ObjectId):
        return str(value)
    elif isinstance(value, datetime):
        return value.isoformat()
    elif isinstance(value, dict):
        return {k: clean_mongo_value(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [clean_mongo_value(v) for v in value]
    else:
        return value


def serialize_doc(doc):
    doc = dict(doc)
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return {k: clean_mongo_value(v) for k, v in doc.items()}


# --- Auth Dependency ---
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

GOOGLE_CLIENT_ID = f"{environment.GOOGLE_CLIENT_ID}.apps.googleusercontent.com"


def get_current_user(authorization: str = Depends(lambda: None)):
    if environment.ENV == "dev":
        return {"user_id": "local-test-user", "email": "test@example.com"}

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), GOOGLE_CLIENT_ID
        )
        return {"user_id": idinfo["sub"], "email": idinfo["email"]}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")


# --- Motor Client Initialization ---
client = AsyncIOMotorClient(environment.MONGO_URI)
db = client[environment.DB_NAME]
fs = AsyncIOMotorGridFSBucket(db)
router = APIRouter()
collection = db[environment.PROJECT_NAME]  # Motor async collection

# Motor async collection

@router.get("/items")
async def list_items(
    page: int = 1, limit: int = 10, user=Depends(get_current_user)
):
    skip = (page - 1) * limit
    cursor = collection.find({"user_id": user["user_id"]}).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    total = await collection.count_documents({"user_id": user["user_id"]})
    return {
        "items": [serialize_doc(doc) for doc in docs],
        "total": total,
        "page": page,
        "limit": limit,
    }

@router.post("/item")
async def create_item(data: ResourceCreate, user=Depends(get_current_user)):
    doc = data.dict()
    doc["user_id"] = user["user_id"]
    doc["created_at"] = datetime.utcnow()
    result = await collection.insert_one(doc)
    inserted_doc = await collection.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted_doc)

@router.put("/{item_id}")
async def update_item(
    item_id: str, data: ResourceUpdate, user=Depends(get_current_user)
):
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    result = await collection.update_one(
        {"_id": ObjectId(item_id), "user_id": user["user_id"]},
        {"$set": update_data},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    updated_doc = await collection.find_one({"_id": ObjectId(item_id)})
    return serialize_doc(updated_doc)

@router.delete("/{item_id}")
async def delete_item(item_id: str, user=Depends(get_current_user)):
    result = await collection.delete_one(
        {"_id": ObjectId(item_id), "user_id": user["user_id"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Resource deleted successfully"}
