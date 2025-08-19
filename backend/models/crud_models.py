from pydantic import BaseModel
from typing import Optional, Dict, Any

# --- Pydantic Models ---
class ResourceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None

class Document(BaseModel):
    title: str
    content: str

class QARequest(BaseModel):
    question: str
    filename: Optional[str] = None
    top_k: int = 5