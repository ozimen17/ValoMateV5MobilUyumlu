from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime, timedelta
import uuid
from typing import Optional, List
from pydantic import BaseModel
import random

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URL)
db = client.premate_db

# Collections
players_collection = db.players
games_collection = db.games

class Player(BaseModel):
    id: Optional[str] = None
    username: str
    game: str = "valorant"
    game_mode: str = "Derecelik"
    rank: str
    rank_level: int
    age: int
    voice_enabled: bool = True
    mic_enabled: bool = True
    created_at: Optional[datetime] = None

class Game(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    icon: str
    description: str

# Generate random player codes like in the original
def generate_player_code():
    codes = ["MURADIS", "RUE4IS", "2VÇ979", "NOXS30", "ROAFIST", "LZONER", "VINGEB", "ZOREX", "TEKNO", "CYBER"]
    return random.choice(codes)

# Initialize sample data
def init_sample_data():
    # Clear existing data
    players_collection.delete_many({})
    games_collection.delete_many({})
    
    # Add games matching the design
    games = [
        {
            "id": str(uuid.uuid4()), 
            "name": "Takım arkadaşı bul", 
            "slug": "find-team", 
            "icon": "👥",
            "description": "Oyun arkadaşları bul"
        },
        {
            "id": str(uuid.uuid4()), 
            "name": "Valorant skin stratejmas", 
            "slug": "valorant-skins", 
            "icon": "🔫",
            "description": "Skin değerlendirme"
        },
        {
            "id": str(uuid.uuid4()), 
            "name": "Çarkghar", 
            "slug": "wheel", 
            "icon": "💰",
            "description": "Çark çevir kazanç"
        },
        {
            "id": str(uuid.uuid4()), 
            "name": "Rank tahmin (Valorant)", 
            "slug": "rank-predict", 
            "icon": "🔮",
            "description": "Rank tahmini"
        }
    ]
    games_collection.insert_many(games)
    
    # Add sample players with realistic Turkish usernames
    sample_players = [
        {
            "id": str(uuid.uuid4()),
            "username": "refkid mova/bozuktrt",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": generate_player_code(),
            "rank_level": 5,
            "age": 0,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now() - timedelta(minutes=1)
        },
        {
            "id": str(uuid.uuid4()),
            "username": "addy chef1644",
            "game": "valorant", 
            "game_mode": "Derecelik",
            "rank": generate_player_code(),
            "rank_level": 3,
            "age": 1,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now() - timedelta(minutes=5)
        },
        {
            "id": str(uuid.uuid4()),
            "username": "pleydo3 sunShytis",
            "game": "valorant",
            "game_mode": "Derecelik", 
            "rank": generate_player_code(),
            "rank_level": 4,
            "age": 18,
            "voice_enabled": True,
            "mic_enabled": False,
            "created_at": datetime.now() - timedelta(minutes=8)
        },
        {
            "id": str(uuid.uuid4()),
            "username": "mnezda spiritiKPS",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": generate_player_code(),
            "rank_level": 6,
            "age": 14,
            "voice_enabled": False,
            "mic_enabled": True,
            "created_at": datetime.now() - timedelta(minutes=17)
        },
        {
            "id": str(uuid.uuid4()),
            "username": "HOZEKOFCE34",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": generate_player_code(),
            "rank_level": 5,
            "age": 0,
            "voice_enabled": True,
            "mic_enabled": False,
            "created_at": datetime.now() - timedelta(minutes=25)
        },
        {
            "id": str(uuid.uuid4()),
            "username": "FEIRA KIBMBergit",
            "game": "valorant", 
            "game_mode": "Derecelik",
            "rank": generate_player_code(),
            "rank_level": 4,
            "age": 0,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now() - timedelta(minutes=30)
        },
        {
            "id": str(uuid.uuid4()),
            "username": "foreginggardHTH",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": generate_player_code(),
            "rank_level": 3,
            "age": 18,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now() - timedelta(minutes=35)
        }
    ]
    players_collection.insert_many(sample_players)

@app.on_event("startup")
async def startup_event():
    init_sample_data()

@app.get("/api/games")
async def get_games():
    games = list(games_collection.find({}, {"_id": 0}))
    return games

@app.get("/api/players")
async def get_players(
    game: Optional[str] = None,
    game_mode: Optional[str] = None,
    min_rank: Optional[int] = None,
    max_rank: Optional[int] = None,
    voice_only: Optional[bool] = None
):
    query = {}
    
    if game:
        query["game"] = game
    if game_mode and game_mode != "Tümü":
        query["game_mode"] = game_mode
    if min_rank is not None:
        query["rank_level"] = {"$gte": min_rank}
    if max_rank is not None:
        if "rank_level" in query:
            query["rank_level"]["$lte"] = max_rank
        else:
            query["rank_level"] = {"$lte": max_rank}
    if voice_only:
        query["voice_enabled"] = True
    
    players = list(players_collection.find(query, {"_id": 0}).sort("created_at", -1))
    return players

@app.post("/api/players")
async def create_player(player: Player):
    player_dict = player.dict()
    if not player_dict.get("id"):
        player_dict["id"] = str(uuid.uuid4())
    if not player_dict.get("created_at"):
        player_dict["created_at"] = datetime.now()
    if not player_dict.get("rank"):
        player_dict["rank"] = generate_player_code()
    
    result = players_collection.insert_one(player_dict)
    return {"id": player_dict["id"], "message": "Oyuncu başarıyla eklendi", "player": player_dict}

@app.delete("/api/players/{player_id}")
async def delete_player(player_id: str):
    result = players_collection.delete_one({"id": player_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Oyuncu bulunamadı")
    return {"message": "Oyuncu silindi"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Premate.gg API is running"}