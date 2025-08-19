from fastapi import APIRouter
import discord
from discord.ext import commands
import environment
from logger import setup_logger
logger = setup_logger(__name__)

TOKEN = environment.DISCORD_BOT_TOKEN
CHANNEL_ID = environment.DISCORD_BOT_TOKEN

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    logger.info(f"Discord bot logged in as {bot.user}")

async def send_discord_notification(message: str, channel_id: str):
    channel = bot.get_channel(channel_id)
    if channel:
        await channel.send(message)

async def send_dm_to_self(message: str, self_id: str):
    user = await bot.fetch_user(self_id)
    if user:
        await user.send(message)

router = APIRouter()

@router.get("/discord/info")
async def root():
    return {"message": "Join discord server <https://discord.gg/jsyHVhSp> to get notifications"}

@router.post("/discord//channel/{id}/{msg}")
async def notify(id: str, msg: str):
    await send_discord_notification(msg, id)
    return {"status": "Sent to channel ", "id": id, "message": msg}

@router.post("/discord/user/{id}/{msg}")
async def dm_me(id: str, msg: str):
    await send_dm_to_self(msg, id)
    return {"status": "Sent to user ", "id": id, "message": msg}