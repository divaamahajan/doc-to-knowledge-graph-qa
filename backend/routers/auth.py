from fastapi import APIRouter
from fastapi import  Request
from fastapi.responses import JSONResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from jose import jwt
from logger import setup_logger
from fastapi import Body
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests


logger = setup_logger(__name__)
from environment import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_ALGORITHM, JWT_SECRET

router = APIRouter()

# Load config for Authlib
config_data = {
    "GOOGLE_CLIENT_ID": GOOGLE_CLIENT_ID,
    "GOOGLE_CLIENT_SECRET": GOOGLE_CLIENT_SECRET
}
config = Config(environ=config_data)

oauth = OAuth(config)

# Register Google OAuth
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"}
)

@router.get("/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    if not user_info:
        return JSONResponse({"error": "Failed to retrieve user info"}, status_code=400)

    # Generate our own JWT
    payload = {
        "sub": user_info["sub"],
        "email": user_info["email"],
        "name": user_info["name"]
    }
    app_jwt = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return JSONResponse({
        "access_token": app_jwt,
        "token_type": "bearer",
        "user": payload
    })


@router.post("/google/verify")
async def verify_google_token(data: dict = Body(...)):
    id_token_str = data.get("id_token")
    if not id_token_str:
        return JSONResponse({"error": "Missing ID token"}, status_code=400)

    try:
        # Verify the token with Google
        idinfo = google_id_token.verify_oauth2_token(
            id_token_str, google_requests.Request(), GOOGLE_CLIENT_ID
        )

        # Extract user info from token payload
        payload = {
            "sub": idinfo["sub"],
            "email": idinfo["email"],
            "name": idinfo["name"]
        }
        app_jwt = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return {"access_token": app_jwt, "token_type": "bearer", "user": payload}

    except Exception as e:
        return JSONResponse({"error": f"Invalid token: {str(e)}"}, status_code=400)
