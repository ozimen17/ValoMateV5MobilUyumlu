from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime
import uuid
from typing import Optional, List
from pydantic import BaseModel

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
    game: str
    game_mode: str
    rank: str
    rank_level: int
    age: int
    voice_enabled: bool
    mic_enabled: bool
    created_at: Optional[datetime] = None

class Game(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    icon: str

# Initialize sample data
def init_sample_data():
    # Clear existing data
    players_collection.delete_many({})
    games_collection.delete_many({})
    
    # Add games
    games = [
        {"id": str(uuid.uuid4()), "name": "Valorant", "slug": "valorant", "icon": "🎯"},
        {"id": str(uuid.uuid4()), "name": "PUBG Mobile", "slug": "pubg-mobile", "icon": "🔫"},
        {"id": str(uuid.uuid4()), "name": "Brawl Stars", "slug": "brawl-stars", "icon": "⭐"},
        {"id": str(uuid.uuid4()), "name": "Counter-Strike", "slug": "counter-strike", "icon": "💥"},
        {"id": str(uuid.uuid4()), "name": "League of Legends", "slug": "lol", "icon": "⚔️"},
        {"id": str(uuid.uuid4()), "name": "Random Takım", "slug": "random", "icon": "❓"}
    ]
    games_collection.insert_many(games)
    
    # Add sample players
    sample_players = [
        {
            "id": str(uuid.uuid4()),
            "username": "refkid mova/bozuk=rt",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": "MURADIS",
            "rank_level": 5,
            "age": 0,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "addy chef1644",
            "game": "valorant", 
            "game_mode": "Derecelik",
            "rank": "RUE4IS",
            "rank_level": 3,
            "age": 1,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "pleydo3 sunShytis",
            "game": "valorant",
            "game_mode": "Derecelik", 
            "rank": "2VÇ979",
            "rank_level": 4,
            "age": 18,
            "voice_enabled": True,
            "mic_enabled": False,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "mnezda spiritiKPS",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": "NOXS30",
            "rank_level": 6,
            "age": 14,
            "voice_enabled": False,
            "mic_enabled": True,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "HOZEKOFCE34",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": "ROAFIST",
            "rank_level": 5,
            "age": 0,
            "voice_enabled": True,
            "mic_enabled": False,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "FEIRA KIBMBergit",
            "game": "valorant", 
            "game_mode": "Derecelik",
            "rank": "LZONER",
            "rank_level": 4,
            "age": 0,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "foreginggard4=TH",
            "game": "valorant",
            "game_mode": "Derecelik",
            "rank": "VINGEB",
            "rank_level": 3,
            "age": 18,
            "voice_enabled": True,
            "mic_enabled": True,
            "created_at": datetime.now()
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
    if game_mode:
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
    
    players = list(players_collection.find(query, {"_id": 0}))
    return players

@app.post("/api/players")
async def create_player(player: Player):
    player_dict = player.dict()
    if not player_dict.get("id"):
        player_dict["id"] = str(uuid.uuid4())
    if not player_dict.get("created_at"):
        player_dict["created_at"] = datetime.now()
    
    result = players_collection.insert_one(player_dict)
    return {"id": player_dict["id"], "message": "Player created successfully"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Premate.gg API is running"}