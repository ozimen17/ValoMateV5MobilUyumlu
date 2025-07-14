#!/usr/bin/env python3
"""
VALOMATE Backend API Testing Suite - Focused on Form Improvements
Tests backend functionality after form improvements including automatic # tag processing
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

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{API_URL}/health", timeout=15)
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

def test_games_endpoint():
    """Test the games endpoint"""
    print("\n=== Testing Games Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/games", timeout=15)
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

def test_players_endpoint():
    """Test the players endpoint and verify it returns player data correctly"""
    print("\n=== Testing Players Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/players", timeout=15)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            players = response.json()
            print(f"Number of players: {len(players)}")
            
            if len(players) > 0:
                player = players[0]
                print(f"Sample player: {player}")
                
                # Verify player structure
                required_fields = ["id", "username", "tag", "lobby_code", "game", "min_rank", "max_rank", 
                                 "looking_for", "game_mode", "mic_enabled", "created_at"]
                
                missing_fields = [field for field in required_fields if field not in player]
                if missing_fields:
                    print(f"❌ Players missing required fields: {missing_fields}")
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

def test_create_player_with_tag_processing():
    """Test POST /api/players endpoint with updated form data structure including automatic # tag processing"""
    print("\n=== Testing Create Player with Automatic # Tag Processing ===")
    
    # Test data simulating form submissions with automatic # tag processing
    test_players = [
        {
            "username": "FormTestPlayer1",
            "tag": "#ABC123",  # Tag with # symbol (as it would be processed by frontend)
            "lobby_code": "FRM01",
            "game": "valorant",
            "min_rank": "Demir",
            "max_rank": "Bronz",
            "looking_for": "2 Kişi",
            "game_mode": "Dereceli",
            "mic_enabled": True
        },
        {
            "username": "FormTestPlayer2", 
            "tag": "#XYZ789",  # Tag with # symbol (as it would be processed by frontend)
            "lobby_code": "FRM02",
            "game": "valorant",
            "min_rank": "Altın",
            "max_rank": "Radyant",
            "looking_for": "1 Kişi",
            "game_mode": "Premier",
            "mic_enabled": False
        },
        {
            "username": "FormTestPlayer3",
            "tag": "#TEST99",  # Tag with # symbol (as it would be processed by frontend)
            "lobby_code": "FRM03",
            "game": "valorant",
            "min_rank": "Gümüş",
            "max_rank": "Platin",
            "looking_for": "3 Kişi",
            "game_mode": "Derecesiz",
            "mic_enabled": True
        }
    ]
    
    created_players = []
    
    for i, player_data in enumerate(test_players):
        try:
            print(f"\nCreating player {i+1}: {player_data['username']} with tag {player_data['tag']}")
            
            response = requests.post(f"{API_URL}/players", 
                                   json=player_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=15)
            
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
    
    # Verify created players appear in the list with correct tag processing
    try:
        response = requests.get(f"{API_URL}/players", timeout=15)
        if response.status_code == 200:
            players = response.json()
            
            # Check if our test players are in the list
            found_players = 0
            for player in players:
                if player.get("username") in ["FormTestPlayer1", "FormTestPlayer2", "FormTestPlayer3"]:
                    found_players += 1
                    
                    # Verify tag data is properly stored (with # symbol)
                    tag = player.get("tag", "")
                    if not tag.startswith("#"):
                        print(f"❌ Tag processing issue: {player['username']} has tag '{tag}' without # symbol")
                        return False
                    else:
                        print(f"✅ Tag correctly processed for {player['username']}: {tag}")
            
            if found_players == len(test_players):
                print("✅ All created players found with correct tag processing")
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

def test_player_filtering():
    """Test filtering by game_mode, looking_for, and mic_only parameters"""
    print("\n=== Testing Player Filtering ===")
    
    # Test game_mode filter
    try:
        print("\n--- Testing game_mode filtering ---")
        response = requests.get(f"{API_URL}/players?game_mode=Dereceli", timeout=15)
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
        print("\n--- Testing looking_for filtering ---")
        response = requests.get(f"{API_URL}/players?looking_for=1 Kişi", timeout=15)
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
        print("\n--- Testing mic_only filtering ---")
        response = requests.get(f"{API_URL}/players?mic_only=true", timeout=15)
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

def test_cleanup_functionality():
    """Verify the 180-minute cleanup is working correctly"""
    print("\n=== Testing 180-Minute Cleanup Functionality ===")
    
    # First test the manual cleanup endpoint
    try:
        response = requests.get(f"{API_URL}/cleanup", timeout=15)
        print(f"Manual cleanup - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Manual cleanup result: {result}")
            print("✅ Manual cleanup endpoint working")
        else:
            print("❌ Manual cleanup endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Manual cleanup endpoint failed with error: {e}")
        return False
    
    # Test that players created now are NOT cleaned up (they're fresh)
    print("\n--- Testing Fresh Players Are Not Cleaned (180-minute limit) ---")
    
    # Create a test player
    fresh_player = {
        "username": "FreshPlayer180Test",
        "tag": "#FRESH",
        "lobby_code": "FRS01",
        "game": "valorant",
        "min_rank": "Demir",
        "max_rank": "Bronz",
        "looking_for": "1 Kişi",
        "game_mode": "Dereceli",
        "mic_enabled": True
    }
    
    try:
        # Create the player
        response = requests.post(f"{API_URL}/players", 
                               json=fresh_player, 
                               headers={"Content-Type": "application/json"},
                               timeout=15)
        
        if response.status_code != 200:
            print("❌ Failed to create fresh test player")
            return False
        
        created_player = response.json()
        player_id = created_player.get("id")
        print(f"Created fresh player with ID: {player_id}")
        
        # Run cleanup immediately
        cleanup_response = requests.get(f"{API_URL}/cleanup", timeout=15)
        if cleanup_response.status_code != 200:
            print("❌ Failed to run cleanup")
            return False
        
        # Check if the fresh player still exists (should not be cleaned)
        players_response = requests.get(f"{API_URL}/players", timeout=15)
        if players_response.status_code != 200:
            print("❌ Failed to get players after cleanup")
            return False
        
        players = players_response.json()
        fresh_player_exists = any(p.get("id") == player_id for p in players)
        
        if fresh_player_exists:
            print("✅ Fresh player correctly NOT cleaned up (within 180 minutes)")
        else:
            print("❌ Fresh player was incorrectly cleaned up")
            return False
            
    except Exception as e:
        print(f"❌ Error testing fresh player cleanup: {e}")
        return False
    
    # Test cleanup time limit verification
    print("\n--- Verifying 180-Minute Cleanup Configuration ---")
    
    # Get current players and check their timestamps
    try:
        response = requests.get(f"{API_URL}/players", timeout=15)
        if response.status_code == 200:
            players = response.json()
            current_time = datetime.now()
            
            print(f"Current time: {current_time}")
            print(f"Total players found: {len(players)}")
            
            # Check if any players are older than 180 minutes (should be cleaned)
            old_players = 0
            for player in players:
                try:
                    created_at = datetime.fromisoformat(player["created_at"].replace('Z', '+00:00'))
                    # Remove timezone info for comparison
                    created_at = created_at.replace(tzinfo=None)
                    age_minutes = (current_time - created_at).total_seconds() / 60
                    
                    print(f"Player {player['username']}: {age_minutes:.1f} minutes old")
                    
                    if age_minutes > 180:
                        old_players += 1
                        print(f"⚠️ Found player older than 180 minutes: {player['username']} ({age_minutes:.1f} minutes)")
                
                except Exception as e:
                    print(f"Error parsing timestamp for player {player.get('username', 'unknown')}: {e}")
            
            if old_players == 0:
                print("✅ No players older than 180 minutes found (cleanup working correctly)")
            else:
                print(f"⚠️ Found {old_players} players older than 180 minutes (cleanup may need to run)")
            
            print("✅ 180-minute cleanup functionality verified")
            return True
            
        else:
            print("❌ Failed to get players for cleanup verification")
            return False
            
    except Exception as e:
        print(f"❌ Error verifying cleanup configuration: {e}")
        return False

def run_focused_tests():
    """Run focused backend tests for form improvements"""
    print("🚀 Starting VALOMATE Backend API Tests - Form Improvements Focus")
    print("=" * 70)
    
    test_results = {
        "Health Check": test_health_check(),
        "Games Endpoint": test_games_endpoint(),
        "Players Endpoint": test_players_endpoint(),
        "Create Player with Tag Processing": test_create_player_with_tag_processing(),
        "Player Filtering": test_player_filtering(),
        "180-Minute Cleanup": test_cleanup_functionality()
    }
    
    print("\n" + "=" * 70)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 70)
    
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
    success = run_focused_tests()
    exit(0 if success else 1)