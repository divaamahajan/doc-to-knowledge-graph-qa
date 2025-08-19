
from fastapi import FastAPI
# import database.tables as tables
# from database.postgres import engine
from routers import auth, chat, notify, ping , crud, knowledge_graph, file_handler
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from environment import SESSION_SECRET_KEY, FRONTEND_URL, PROJECT_NAME, ENV
# from routers.crud import  get_crud_router
# from routers.knowledge_graph import  get_crud_router_kg
from logger import setup_logger
logger = setup_logger(__name__)

import asyncio
from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers.notify import bot, TOKEN

@asynccontextmanager
async def lifespan(app: FastAPI):
    bot_task = asyncio.create_task(bot.start(TOKEN))
    yield
    await bot.close()
    bot_task.cancel()

app = FastAPI(lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)

app.include_router(ping.router, prefix="", tags=["ping"])
app.include_router(auth.router, prefix="/auth", tags=["auth"]) #Tag in Swagger UI
app.include_router(crud.router, prefix=f"/crud", tags=[f"crud"])
app.include_router(file_handler.router, prefix=f"/file_handler", tags=[f"file_handler"])
app.include_router(knowledge_graph.router, prefix=f"/knowledge-graph", tags=[f"knowledge-graph"])
app.include_router(chat.router, tags=["chat_ai"]) #Tag in Swagger UI
app.include_router(notify.router, prefix="/notify", tags=["notify"])

# app.include_router(analyze.router, prefix="/analyze", tags=["analyze"]) #Tag in Swagger UI
# app.include_router(manage.router, prefix="/manage", tags=["manage"])

origins = [
    FRONTEND_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
