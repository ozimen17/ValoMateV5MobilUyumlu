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
import string

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
db = client.valomate_db

# Collections
players_collection = db.players
games_collection = db.games

class Player(BaseModel):
    id: Optional[str] = None
    username: str
    tag: str
    lobby_code: str
    game: str = "valorant"
    game_mode: str = "Derecelik"
    min_rank: str = "Demir"
    max_rank: str = "Radyant"
    age_range: str = "18+"
    looking_for: str = "Takım arkadaşı"
    expectations: str = "Eğlenceli oyun"
    voice_enabled: bool = True
    mic_enabled: bool = True
    created_at: Optional[datetime] = None

class Game(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    icon: str
    description: str

# Generate random lobby codes
def generate_lobby_code():
    letters = ''.join(random.choices(string.ascii_uppercase, k=3))
    numbers = ''.join(random.choices(string.digits, k=2))
    return f"{letters}{numbers}"

# Generate random player usernames
def generate_username():
    usernames = [
        "GamerProX", "ShadowHunter", "FireStorm", "IceQueen", "ThunderBolt",
        "NightRider", "SilverBullet", "GoldenEagle", "RedDragon", "BlueFalcon",
        "PhantomKnight", "CyberNinja", "StormBreaker", "MysticWarrior", "EliteSniper"
    ]
    return random.choice(usernames) + str(random.randint(10, 99))

# Generate random tags
def generate_tag():
    tags = ["TR1", "EU2", "NA3", "AS4", "OCE", "KR6", "JP7", "BR8", "LAT", "MEA"]
    return random.choice(tags)

# Initialize sample data
def init_sample_data():
    # Clear existing data
    players_collection.delete_many({})
    games_collection.delete_many({})
    
    # Add games matching the new design
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
    
    # Add sample players with new structure
    looking_for_options = ["Takım arkadaşı", "Rank çıkma", "Eğlenceli oyun", "Turnuva", "Pratik"]
    expectations_options = ["Toksik olmayan", "Sesli iletişim", "Çok oynayan", "Tecrübeli", "Sabırlı"]
    rank_options = ["Demir", "Bronz", "Gümüş", "Altın", "Platin", "Elmas", "Asens", "Ölümsüz", "Radyant"]
    
    sample_players = []
    for i in range(8):
        sample_players.append({
            "id": str(uuid.uuid4()),
            "username": generate_username(),
            "tag": generate_tag(),
            "lobby_code": generate_lobby_code(),
            "game": "valorant",
            "game_mode": "Derecelik",
            "min_rank": random.choice(rank_options[:6]),
            "max_rank": random.choice(rank_options[3:]),
            "age_range": random.choice(["16+", "18+", "21+", "25+"]),
            "looking_for": random.choice(looking_for_options),
            "expectations": random.choice(expectations_options),
            "voice_enabled": random.choice([True, False]),
            "mic_enabled": random.choice([True, False]),
            "created_at": datetime.now() - timedelta(minutes=random.randint(1, 60))
        })
    
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
    min_rank: Optional[str] = None,
    max_rank: Optional[str] = None,
    voice_only: Optional[bool] = None
):
    query = {}
    
    if game:
        query["game"] = game
    if game_mode and game_mode != "Tümü":
        query["game_mode"] = game_mode
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
    if not player_dict.get("lobby_code"):
        player_dict["lobby_code"] = generate_lobby_code()
    
    # Convert datetime to string for JSON serialization
    if player_dict.get("created_at"):
        player_dict["created_at"] = player_dict["created_at"].isoformat()
    
    result = players_collection.insert_one(player_dict.copy())
    return {"id": player_dict["id"], "message": "Oyuncu başarıyla eklendi"}

@app.delete("/api/players/{player_id}")
async def delete_player(player_id: str):
    result = players_collection.delete_one({"id": player_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Oyuncu bulunamadı")
    return {"message": "Oyuncu silindi"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Valomate.com API is running"}