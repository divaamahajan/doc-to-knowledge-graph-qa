# routers/knowledge_graph.py
from fastapi import UploadFile, File, Query, APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from typing import List
import environment
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from services.file_service import (
    upload_file_to_gridfs,
    download_file_from_gridfs,
    list_files_from_gridfs,
    delete_file_from_gridfs,
    delete_all_files_from_gridfs,
)
from utils.knowledge_graph import create_file_knowledge_graph, delete_file_knowledge_graph, ask_question, get_graph_traversal_path

# --- Auth Dependency ---
GOOGLE_CLIENT_ID = f"{environment.GOOGLE_CLIENT_ID}.apps.googleusercontent.com"

def get_current_user(authorization: str = None):
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

# --- Motor Initialization (Lazy-loaded) ---
client = None
db = None
fs = None

def get_mongodb_connection():
    """Get MongoDB connection with lazy loading and error handling"""
    global client, db, fs
    if client is None:
        try:
            if not environment.MONGO_URI:
                print("MongoDB URI not provided. File storage features will be disabled.")
                return None, None
            
            client = AsyncIOMotorClient(environment.MONGO_URI)
            db = client[environment.DB_NAME]
            fs = AsyncIOMotorGridFSBucket(db)
            print("MongoDB connection established successfully")
            return db, fs
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            print("File storage features will be disabled. Please check MongoDB configuration.")
            return None, None
    return db, fs

router = APIRouter()

# --- Knowledge Graph APIs ---
@router.get("/file-download/{filename}")
async def download_file(filename: str, user=Depends(get_current_user)):
    db, fs = get_mongodb_connection()
    if db is None or fs is None:
        raise HTTPException(status_code=503, detail="File storage service unavailable")
    
    try:
        file_info, stream = await download_file_from_gridfs(fs, db, filename, user["user_id"])
        return StreamingResponse(
            stream,
            media_type=file_info.get("metadata", {}).get("content_type", "application/octet-stream"),
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"File not found: {str(e)}")

@router.get("/files", response_model=List[dict])
async def list_files(user=Depends(get_current_user)):
    try:
        db, fs = get_mongodb_connection()
        if db is None:
            # MongoDB not available, return empty list
            return []
        
        return await list_files_from_gridfs(db, user["user_id"])
    except Exception as e:
        # MongoDB connection or authentication error
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"MongoDB error in list_files: {str(e)}")
        
        # Return empty list if MongoDB is not available
        if "authentication failed" in str(e).lower() or "connectionfailure" in str(e).lower():
            return []
        else:
            return []  # Return empty list instead of raising error

@router.post("/file-upload")
async def upload_file(file: UploadFile = File(...), user=Depends(get_current_user)):
    db, fs = get_mongodb_connection()
    if db is None or fs is None:
        raise HTTPException(status_code=503, detail="File storage service unavailable")
    
    file_id, contents = await upload_file_to_gridfs(fs, file, user["user_id"])
    try:
        kg_result = create_file_knowledge_graph(
            user_id=user["user_id"],
            filename=file.filename,
            file_contents=contents,
            content_type=file.content_type,
        )
        return {"message": "Uploaded", "id": str(file_id), "knowledge_graph": kg_result}
    except Exception as kg_error:
        return {"message": "Uploaded", "id": str(file_id), "knowledge_graph": {"status": "error", "message": str(kg_error)}}

@router.delete("/files/{filename}")
async def delete_file_endpoint(filename: str, user=Depends(get_current_user)):
    file_info = await delete_file_from_gridfs(fs, db, filename, user["user_id"])
    try:
        kg_result = delete_file_knowledge_graph(file_info["filename"], user["user_id"])
        return {"status": "success", "message": f"File '{filename}' deleted", "knowledge_graph": {"status": "success" if kg_result else "warning"}}
    except Exception as kg_error:
        return {"status": "success", "message": f"File '{filename}' deleted", "knowledge_graph": {"status": "error", "message": str(kg_error)}}

@router.delete("/files")
async def delete_all_files(user=Depends(get_current_user)):
    deleted_count = await delete_all_files_from_gridfs(fs, db, user["user_id"])
    return {"status": "success", "message": f"Deleted {deleted_count} file(s) successfully"}

@router.post("/qa")
async def qa_endpoint(
    question: str = Query(...),
    filenames: list = Query(None),
    user=Depends(get_current_user),
):
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        result = ask_question(user_id=user["user_id"], question=question, filenames=filenames)
        
        # Add graph traversal path if available
        if result.get("status") == "success" and result.get("sources"):
            traversal_path = get_graph_traversal_path(result["sources"], user["user_id"])
            result["traversal_path"] = traversal_path
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QA error: {str(e)}")

@router.get("/graph-traversal/{question_id}")
async def get_graph_traversal(question_id: str, user=Depends(get_current_user)):
    """Get the graph traversal path for a specific question"""
    try:
        # This would typically fetch from a cache or database
        # For now, we'll return a placeholder
        return {"status": "success", "traversal_path": "Graph traversal data"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching traversal: {str(e)}")

@router.post("/url-upload")
async def upload_url(url: str = Query(...), user=Depends(get_current_user)):
    """Process a URL and add it to the knowledge graph"""
    
    # Validate URL format
    if not url or not url.strip():
        raise HTTPException(status_code=400, detail="URL parameter is required")
    
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    try:
        from utils.url_extractor import extract_text_from_url
        
        # Extract text from URL
        text_content, metadata = extract_text_from_url(url)
        
        # Create filename from URL
        from urllib.parse import urlparse
        parsed_url = urlparse(url)
        filename = f"url_{parsed_url.netloc}_{parsed_url.path.replace('/', '_')}.txt"
        if len(filename) > 100:  # Truncate if too long
            filename = filename[:100] + ".txt"
        
        # Process the extracted text with original URL metadata
        from utils.knowledge_graph import create_url_knowledge_graph
        kg_result = create_url_knowledge_graph(
            user_id=user["user_id"],
            filename=filename,
            file_contents=text_content.encode('utf-8'),
            original_url=url,
            content_type='text/plain'
        )
        
        return {
            "message": "URL processed successfully",
            "filename": filename,
            "knowledge_graph": kg_result,
            "metadata": metadata
        }
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"URL processing error for {url}: {str(e)}")
        logger.error(f"Error details: {type(e).__name__}: {str(e)}")
        
        # Provide more specific error messages
        if "requests" in str(e).lower():
            error_detail = "Network error - unable to fetch URL content"
        elif "beautifulsoup" in str(e).lower():
            error_detail = "HTML parsing error - unable to extract text from URL"
        elif "encoding" in str(e).lower():
            error_detail = "Text encoding error - unable to process URL content"
        else:
            error_detail = f"Processing error: {str(e)}"
        
        raise HTTPException(status_code=500, detail=error_detail)

@router.delete("/url-delete")
async def delete_url(url: str = Query(...), user=Depends(get_current_user)):
    """Delete a previously uploaded URL from the knowledge graph"""
    
    # Validate URL format
    if not url or not url.strip():
        raise HTTPException(status_code=400, detail="URL parameter is required")
    
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    try:
        # Check if file exists in Neo4j knowledge graph by original URL
        from utils.knowledge_graph import safe_kg_query
        file_check = safe_kg_query("""
            MATCH (u:User {user_id: $user_id})-[:UPLOADED]->(f:File)
            WHERE f.original_url = $original_url
            RETURN f.filename as filename, f.total_chunks as total_chunks
        """, params={'user_id': user["user_id"], 'original_url': url})
        
        if not file_check:
            raise HTTPException(status_code=404, detail=f"URL not found in knowledge graph: {url}")
        
        # Delete from knowledge graph using the filename from query result
        filename = file_check[0]["filename"]
        try:
            kg_result = delete_file_knowledge_graph(filename, user["user_id"])
            kg_status = {"status": "success" if kg_result else "warning", "filename": filename}
        except Exception as kg_error:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Knowledge graph deletion error: {kg_error}")
            kg_status = {"status": "error", "message": str(kg_error)}
        
        return {
            "message": f"URL deleted successfully: {url}",
            "filename": filename,
            "url": url,
            "knowledge_graph": kg_status,
            "chunks_deleted": file_check[0]["total_chunks"] if file_check else 0
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"URL deletion error for {url}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Deletion error: {str(e)}")

@router.get("/url-list")
async def list_urls(user=Depends(get_current_user)):
    """List all uploaded URLs for the current user"""
    
    try:
        from utils.knowledge_graph import safe_kg_query
        
        # Query all URL files for this user
        url_files = safe_kg_query("""
            MATCH (u:User {user_id: $user_id})-[:UPLOADED]->(f:File)
            WHERE f.filename STARTS WITH 'url_' AND f.original_url IS NOT NULL
            RETURN f.filename as filename, 
                   f.total_chunks as total_chunks,
                   f.processed_date as processed_date,
                   f.source as source,
                   f.original_url as original_url
            ORDER BY f.processed_date DESC
        """, params={'user_id': user["user_id"]})
        
        if not url_files:
            return {
                "status": "success",
                "urls": [],
                "total_urls": 0,
                "message": "No URLs uploaded yet"
            }
        
        # Convert file info to URL list using stored original_url
        urls = []
        for file_info in url_files:
            # Use the original URL stored in Neo4j metadata
            original_url = file_info.get("original_url")
            if original_url:
                # Extract domain from the original URL for display
                from urllib.parse import urlparse
                parsed_url = urlparse(original_url)
                domain = parsed_url.netloc
                
                urls.append({
                    "url": original_url,
                    "filename": file_info["filename"],
                    "chunks": file_info["total_chunks"],
                    "uploaded_date": file_info["processed_date"],
                    "domain": domain
                })
        
        return {
            "status": "success", 
            "urls": urls,
            "total_urls": len(urls)
        }
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"URL listing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error listing URLs: {str(e)}")

@router.get("/url-info")
async def get_url_info(url: str = Query(...), user=Depends(get_current_user)):
    """Get detailed information about a specific uploaded URL"""
    
    # Validate URL format
    if not url or not url.strip():
        raise HTTPException(status_code=400, detail="URL parameter is required")
    
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    try:
        from utils.knowledge_graph import safe_kg_query
        
        # Get file information by original URL instead of filename
        file_info = safe_kg_query("""
            MATCH (u:User {user_id: $user_id})-[:UPLOADED]->(f:File)
            WHERE f.original_url = $original_url
            RETURN f.filename as filename,
                   f.total_chunks as total_chunks, 
                   f.processed_date as processed_date,
                   f.source as source,
                   f.pages_processed as pages_processed,
                   f.images_processed as images_processed,
                   f.successful_ocr as successful_ocr,
                   f.failed_ocr as failed_ocr,
                   f.extraction_errors as extraction_errors,
                   f.original_url as original_url
        """, params={'user_id': user["user_id"], 'original_url': url})
        
        if not file_info:
            raise HTTPException(status_code=404, detail=f"URL not found: {url}")
        
        file_data = file_info[0]
        filename = file_data["filename"]  # Get filename from query result
        
        # Get sample chunks
        sample_chunks = safe_kg_query("""
            MATCH (f:File {filename: $filename, user_id: $user_id})-[:HAS_CHUNK]->(c:Chunk)
            RETURN c.text as text, c.chunk_index as index, c.section as section
            ORDER BY c.chunk_index
            LIMIT 3
        """, params={'filename': filename, 'user_id': user["user_id"]})
        
        return {
            "status": "success",
            "url": url,
            "filename": filename,
            "chunks": file_data["total_chunks"],
            "processed_date": file_data["processed_date"],
            "processing_stats": {
                "pages_processed": file_data.get("pages_processed", 1),
                "images_processed": file_data.get("images_processed", 0), 
                "successful_ocr": file_data.get("successful_ocr", 1),
                "failed_ocr": file_data.get("failed_ocr", 0),
                "extraction_errors": file_data.get("extraction_errors", 0)
            },
            "sample_chunks": [
                {
                    "index": chunk["index"],
                    "text": chunk["text"][:200] + "..." if len(chunk["text"]) > 200 else chunk["text"],
                    "section": chunk["section"]
                }
                for chunk in sample_chunks
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"URL info error for {url}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting URL info: {str(e)}")

@router.post("/regenerate-embeddings")
async def regenerate_embeddings(user=Depends(get_current_user)):
    """Regenerate embeddings for all chunks to fix search bias issues"""
    
    try:
        from utils.knowledge_graph import regenerate_all_embeddings
        
        # Regenerate embeddings for missing ones first
        result = regenerate_all_embeddings(force=False)
        
        if result:
            return {
                "status": "success",
                "message": "Embeddings regenerated successfully",
                "action": "Generated missing embeddings"
            }
        else:
            # If no missing embeddings, check if we should force regenerate all
            return {
                "status": "info", 
                "message": "No missing embeddings found. All chunks already have embeddings.",
                "suggestion": "If search bias persists, you may need to force regenerate all embeddings"
            }
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Embedding regeneration error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error regenerating embeddings: {str(e)}")
