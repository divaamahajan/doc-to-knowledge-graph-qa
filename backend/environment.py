from dotenv import load_dotenv
load_dotenv()

from logger import setup_logger
logger = setup_logger(__name__)

import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY", "your_super_secret_key_here")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretbuildathonkey")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://root:changeme@mongo_container:27017")
PROJECT_NAME  = os.getenv("PROJECT_NAME", "project1")
DB_NAME = os.getenv("MONGO_DB_NAME", f"{PROJECT_NAME}-db")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
ENV = os.getenv("ENV", "test_db")

DISCORD_BOT_TOKEN=os.getenv("DISCORD_BOT_TOKEN")

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASS = os.getenv("NEO4J_PASS")

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")
CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")