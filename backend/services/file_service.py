# services/file_service.py
from io import BytesIO
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

# --- Helper Functions ---

async def upload_file_to_gridfs(fs: AsyncIOMotorGridFSBucket, file: UploadFile, user_id: str):
    contents = await file.read()
    file_id = await fs.upload_from_stream(
        file.filename,
        BytesIO(contents),
        metadata={"user_id": user_id, "content_type": file.content_type},
    )
    return file_id, contents


async def download_file_from_gridfs(fs, db, filename: str, user_id: str):
    file_info = await db.fs.files.find_one(
        {"filename": filename, "metadata.user_id": user_id},
        sort=[("uploadDate", -1)]
    )
    if not file_info:
        raise HTTPException(status_code=404, detail="File not found")

    stream = BytesIO()
    await fs.download_to_stream(file_info["_id"], stream)
    stream.seek(0)
    return file_info, stream


async def list_files_from_gridfs(db, user_id: str):
    files_cursor = db.fs.files.find(
        {"metadata.user_id": user_id},
        sort=[("uploadDate", -1)]
    )

    files = []
    async for file in files_cursor:
        files.append({
            "filename": file.get("filename"),
            "length": file.get("length"),
            "uploadDate": file.get("uploadDate"),
            "content_type": file.get("metadata", {}).get("content_type"),
        })

    if not files:
        raise HTTPException(status_code=404, detail="No files found")

    return files


async def delete_file_from_gridfs(fs, db, filename: str, user_id: str):
    file_info = await db.fs.files.find_one(
        {"filename": filename, "metadata.user_id": user_id},
        sort=[("uploadDate", -1)]
    )
    if not file_info:
        raise HTTPException(status_code=404, detail="File not found")

    await fs.delete(file_info["_id"])
    return file_info


async def delete_all_files_from_gridfs(fs, db, user_id: str):
    files_cursor = db.fs.files.find({"metadata.user_id": user_id})
    deleted_ids = []

    async for file in files_cursor:
        await fs.delete(file["_id"])
        deleted_ids.append(file["_id"])

    if not deleted_ids:
        raise HTTPException(status_code=404, detail="No files found to delete")

    return len(deleted_ids)
