from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "pong. Goto /docs for swagger"}
