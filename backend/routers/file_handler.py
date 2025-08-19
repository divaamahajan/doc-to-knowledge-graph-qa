# routers/crud.py
from fastapi import UploadFile, File, APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from typing import List
import environment
from models.crud_models import ResourceCreate, ResourceUpdate
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from services.file_service import (
    upload_file_to_gridfs,
    download_file_from_gridfs,
    list_files_from_gridfs,
    delete_file_from_gridfs,
    delete_all_files_from_gridfs,
)

# --- Auth Dependency ---
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

# --- Motor Initialization ---
client = AsyncIOMotorClient(environment.MONGO_URI)
db = client[environment.DB_NAME]
fs = AsyncIOMotorGridFSBucket(db)
router = APIRouter()
collection = db[environment.PROJECT_NAME]

# --- CRUD APIs ---
@router.get("/files", response_model=List[dict])
async def list_files(user=Depends(get_current_user)):
    return await list_files_from_gridfs(db, user["user_id"])

@router.get("/file-download/{filename}")
async def download_file(filename: str, user=Depends(get_current_user)):
    file_info, stream = await download_file_from_gridfs(fs, db, filename, user["user_id"])
    return StreamingResponse(
        stream,
        media_type=file_info.get("metadata", {}).get("content_type", "application/octet-stream"),
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

@router.post("/file-upload")
async def upload_file(file: UploadFile = File(...), user=Depends(get_current_user)):
    file_id, _ = await upload_file_to_gridfs(fs, file, user["user_id"])
    return {"message": "Uploaded", "id": str(file_id)}

@router.delete("/files/{filename}")
async def delete_file(filename: str, user=Depends(get_current_user)):
    await delete_file_from_gridfs(fs, db, filename, user["user_id"])
    return {"status": "success", "message": f"File '{filename}' deleted successfully"}

@router.delete("/files")
async def delete_all_files(user=Depends(get_current_user)):
    deleted_count = await delete_all_files_from_gridfs(fs, db, user["user_id"])
    return {"status": "success", "message": f"Deleted {deleted_count} file(s) successfully"}
