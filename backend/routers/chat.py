# routers/chat_module.py
from fastapi import HTTPException, APIRouter

from models.chat_models import ChatRequest, ChatResponse
from environment import CLAUDE_API_KEY, CLAUDE_API_URL
import httpx


router = APIRouter()
@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not CLAUDE_API_KEY:
        raise HTTPException(status_code=500, detail="Claude API key not set")

    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "claude-opus-4-1-20250805",
        "max_tokens": 300,
        "messages": [
            {"role": "user", "content": request.message}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(CLAUDE_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"LLM API error: {response.text}")

    data = response.json()
    reply = data.get("completion") or data.get("completion") or data.get("content", [{}])[0].get("text", "")

    # The correct key is 'completion' in older API; for new messages API:
    # `reply = data['completion']` might not exist,
    # so use data["content"][0]["text"]
    if not reply:
        reply = data["content"][0]["text"]

    return ChatResponse(reply=reply)
