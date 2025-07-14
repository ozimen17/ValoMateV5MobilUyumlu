#!/usr/bin/env python3
"""
VALOMATE Backend API Testing Suite
Tests all backend functionality after rank badge images feature implementation
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading backend URL: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("ERROR: Could not get backend URL from frontend/.env")
    exit(1)

API_URL = f"{BASE_URL}/api"
print(f"Testing backend at: {API_URL}")

# Test data
VALID_RANKS = ["Demir", "Bronz", "Gümüş", "Altın", "Platin", "Elmas", "Asens", "Ölümsüz", "Radyant"]
GAME_MODES = ["Dereceli", "Premier", "Derecesiz", "Tam Gaz", "Özel Oyun", "1vs1", "2vs2"]
LOOKING_FOR_OPTIONS = ["1 Kişi", "2 Kişi", "3 Kişi", "4 Kişi", "5 Kişi"]

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{API_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok":
                print("✅ Health check passed")
                return True
            else:
                print("❌ Health check failed - invalid response")
                return False
        else:
            print("❌ Health check failed - wrong status code")
            return False
    except Exception as e:
        print(f"❌ Health check failed with error: {e}")
        return False

def test_get_games():
    """Test the games endpoint"""
    print("\n=== Testing GET /api/games ===")
    try:
        response = requests.get(f"{API_URL}/games", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            games = response.json()
            print(f"Number of games: {len(games)}")
            
            if len(games) > 0:
                game = games[0]
                print(f"Sample game: {game}")
                
                # Verify game structure
                required_fields = ["id", "name", "slug", "icon", "description"]
                if all(field in game for field in required_fields):
                    print("✅ Games endpoint working correctly")
                    return True
                else:
                    print("❌ Games missing required fields")
                    return False
            else:
                print("❌ No games returned")
                return False
        else:
            print("❌ Games endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Games endpoint failed with error: {e}")
        return False

def test_get_players():
    """Test the players endpoint without filters"""
    print("\n=== Testing GET /api/players ===")
    try:
        response = requests.get(f"{API_URL}/players", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            players = response.json()
            print(f"Number of players: {len(players)}")
            
            if len(players) > 0:
                player = players[0]
                print(f"Sample player: {player}")
                
                # Verify player structure and rank fields
                required_fields = ["id", "username", "tag", "lobby_code", "game", "min_rank", "max_rank", 
                                 "age_range", "looking_for", "game_mode", "mic_enabled", "created_at"]
                
                missing_fields = [field for field in required_fields if field not in player]
                if missing_fields:
                    print(f"❌ Players missing required fields: {missing_fields}")
                    return False
                
                # Verify rank fields contain valid ranks
                if player["min_rank"] not in VALID_RANKS:
                    print(f"❌ Invalid min_rank: {player['min_rank']}")
                    return False
                
                if player["max_rank"] not in VALID_RANKS:
                    print(f"❌ Invalid max_rank: {player['max_rank']}")
                    return False
                
                # Verify sorting (newest first)
                if len(players) > 1:
                    first_time = datetime.fromisoformat(players[0]["created_at"].replace('Z', '+00:00'))
                    second_time = datetime.fromisoformat(players[1]["created_at"].replace('Z', '+00:00'))
                    if first_time < second_time:
                        print("❌ Players not sorted by newest first")
                        return False
                
                print("✅ Players endpoint working correctly")
                return True
            else:
                print("⚠️ No players returned (might be expected if cleanup ran)")
                return True
        else:
            print("❌ Players endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Players endpoint failed with error: {e}")
        return False

def test_player_filtering():
    """Test player filtering functionality"""
    print("\n=== Testing Player Filtering ===")
    
    # Test game_mode filter
    try:
        response = requests.get(f"{API_URL}/players?game_mode=Dereceli", timeout=10)
        if response.status_code == 200:
            players = response.json()
            print(f"Players with game_mode=Dereceli: {len(players)}")
            
            # Verify all returned players have the correct game_mode
            for player in players:
                if player.get("game_mode") != "Dereceli":
                    print(f"❌ Filter failed: player has game_mode {player.get('game_mode')}")
                    return False
            print("✅ Game mode filtering works")
        else:
            print("❌ Game mode filtering failed")
            return False
    except Exception as e:
        print(f"❌ Game mode filtering failed: {e}")
        return False
    
    # Test looking_for filter
    try:
        response = requests.get(f"{API_URL}/players?looking_for=1 Kişi", timeout=10)
        if response.status_code == 200:
            players = response.json()
            print(f"Players with looking_for=1 Kişi: {len(players)}")
            
            # Verify all returned players have the correct looking_for
            for player in players:
                if player.get("looking_for") != "1 Kişi":
                    print(f"❌ Filter failed: player has looking_for {player.get('looking_for')}")
                    return False
            print("✅ Looking for filtering works")
        else:
            print("❌ Looking for filtering failed")
            return False
    except Exception as e:
        print(f"❌ Looking for filtering failed: {e}")
        return False
    
    # Test mic_only filter
    try:
        response = requests.get(f"{API_URL}/players?mic_only=true", timeout=10)
        if response.status_code == 200:
            players = response.json()
            print(f"Players with mic_only=true: {len(players)}")
            
            # Verify all returned players have mic_enabled=true
            for player in players:
                if not player.get("mic_enabled"):
                    print(f"❌ Mic filter failed: player has mic_enabled {player.get('mic_enabled')}")
                    return False
            print("✅ Mic only filtering works")
        else:
            print("❌ Mic only filtering failed")
            return False
    except Exception as e:
        print(f"❌ Mic only filtering failed: {e}")
        return False
    
    return True

def test_create_player():
    """Test creating a new player with rank data"""
    print("\n=== Testing POST /api/players ===")
    
    # Test data with all supported ranks
    test_players = [
        {
            "username": "TestPlayer1",
            "tag": "TEST",
            "lobby_code": "ABC12",
            "game": "valorant",
            "min_rank": "Demir",
            "max_rank": "Bronz",
            "age_range": "18+",
            "looking_for": "2 Kişi",
            "game_mode": "Dereceli",
            "mic_enabled": True
        },
        {
            "username": "TestPlayer2", 
            "tag": "TST2",
            "lobby_code": "XYZ34",
            "game": "valorant",
            "min_rank": "Altın",
            "max_rank": "Radyant",
            "age_range": "18+",
            "looking_for": "1 Kişi",
            "game_mode": "Premier",
            "mic_enabled": False
        }
    ]
    
    created_players = []
    
    for i, player_data in enumerate(test_players):
        try:
            response = requests.post(f"{API_URL}/players", 
                                   json=player_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            print(f"Player {i+1} - Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Player {i+1} created: {result}")
                
                if "id" in result:
                    created_players.append(result["id"])
                    print(f"✅ Player {i+1} created successfully")
                else:
                    print(f"❌ Player {i+1} creation failed - no ID returned")
                    return False
            else:
                print(f"❌ Player {i+1} creation failed")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Player {i+1} creation failed with error: {e}")
            return False
    
    # Verify created players appear in the list
    try:
        response = requests.get(f"{API_URL}/players", timeout=10)
        if response.status_code == 200:
            players = response.json()
            
            # Check if our test players are in the list
            found_players = 0
            for player in players:
                if player.get("username") in ["TestPlayer1", "TestPlayer2"]:
                    found_players += 1
                    
                    # Verify rank data is properly stored
                    if player.get("username") == "TestPlayer1":
                        if player.get("min_rank") != "Demir" or player.get("max_rank") != "Bronz":
                            print(f"❌ Rank data not stored correctly for TestPlayer1")
                            return False
                    elif player.get("username") == "TestPlayer2":
                        if player.get("min_rank") != "Altın" or player.get("max_rank") != "Radyant":
                            print(f"❌ Rank data not stored correctly for TestPlayer2")
                            return False
            
            if found_players == len(test_players):
                print("✅ All created players found with correct rank data")
                return True
            else:
                print(f"❌ Only found {found_players} out of {len(test_players)} created players")
                return False
        else:
            print("❌ Failed to verify created players")
            return False
            
    except Exception as e:
        print(f"❌ Failed to verify created players: {e}")
        return False

def test_rank_validation():
    """Test that all supported ranks work correctly"""
    print("\n=== Testing Rank Validation ===")
    
    for rank in VALID_RANKS:
        try:
            player_data = {
                "username": f"RankTest{rank}",
                "tag": "RANK",
                "lobby_code": "RNK01",
                "game": "valorant",
                "min_rank": rank,
                "max_rank": rank,
                "age_range": "18+",
                "looking_for": "1 Kişi",
                "game_mode": "Dereceli",
                "mic_enabled": True
            }
            
            response = requests.post(f"{API_URL}/players", 
                                   json=player_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code != 200:
                print(f"❌ Failed to create player with rank {rank}")
                return False
                
        except Exception as e:
            print(f"❌ Error testing rank {rank}: {e}")
            return False
    
    print("✅ All ranks validated successfully")
    return True

def test_cleanup_functionality():
    """Test the cleanup endpoint"""
    print("\n=== Testing Cleanup Functionality ===")
    try:
        response = requests.get(f"{API_URL}/cleanup", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Cleanup result: {result}")
            print("✅ Cleanup endpoint working")
            return True
        else:
            print("❌ Cleanup endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Cleanup endpoint failed with error: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("🚀 Starting VALOMATE Backend API Tests")
    print("=" * 50)
    
    test_results = {
        "Health Check": test_health_check(),
        "Games Endpoint": test_get_games(),
        "Players Endpoint": test_get_players(),
        "Player Filtering": test_player_filtering(),
        "Create Player": test_create_player(),
        "Rank Validation": test_rank_validation(),
        "Cleanup Functionality": test_cleanup_functionality()
    }
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests passed! The backend is working correctly.")
        return True
    else:
        print("⚠️ Some backend tests failed. Check the details above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)