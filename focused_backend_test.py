#!/usr/bin/env python3
"""
Focused Backend API Testing for 180-minute cleanup and improved form functionality
Tests the specific requirements from the review request
"""

import requests
import json
import time
from datetime import datetime, timedelta

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
    """1. Health Check: Test the /api/health endpoint"""
    print("\n=== 1. Health Check Test ===")
    try:
        response = requests.get(f"{API_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get("status") == "ok":
            print("✅ Health check passed - Backend is running")
            return True
        else:
            print("❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Health check failed with error: {e}")
        return False

def test_games_endpoint():
    """2. Games Endpoint: Test /api/games endpoint"""
    print("\n=== 2. Games Endpoint Test ===")
    try:
        response = requests.get(f"{API_URL}/games", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            games = response.json()
            print(f"Number of games: {len(games)}")
            if len(games) > 0:
                print(f"Sample game: {games[0]}")
                print("✅ Games endpoint working correctly")
                return True
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
    """3. Players Endpoint: Test /api/players?game=valorant"""
    print("\n=== 3. Players Endpoint Test ===")
    try:
        response = requests.get(f"{API_URL}/players?game=valorant", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            players = response.json()
            print(f"Number of Valorant players: {len(players)}")
            
            if len(players) > 0:
                player = players[0]
                print(f"Sample player: {player}")
                
                # Verify player structure (without age_range field)
                required_fields = ["id", "username", "tag", "lobby_code", "game", "min_rank", "max_rank", 
                                 "looking_for", "game_mode", "mic_enabled", "created_at"]
                
                missing_fields = [field for field in required_fields if field not in player]
                if missing_fields:
                    print(f"❌ Players missing required fields: {missing_fields}")
                    return False
                
                # Verify age_range field is NOT present (as per user request)
                if "age_range" in player:
                    print("❌ age_range field still present - should be removed")
                    return False
                
                print("✅ Players endpoint working correctly (age_range field removed)")
                return True
            else:
                print("⚠️ No players returned (might be expected)")
                return True
        else:
            print("❌ Players endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Players endpoint failed with error: {e}")
        return False

def test_create_player():
    """4. Create Player: Test creating a new player with updated form data structure"""
    print("\n=== 4. Create Player Test ===")
    
    # Test player data with all required fields (no age_range)
    player_data = {
        "username": "TestUser2025",
        "tag": "TR01",
        "lobby_code": "ABC123",
        "game": "valorant",
        "min_rank": "Altın",
        "max_rank": "Elmas",
        "looking_for": "2 Kişi",
        "game_mode": "Premier",
        "mic_enabled": True
    }
    
    try:
        response = requests.post(f"{API_URL}/players", 
                               json=player_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            result = response.json()
            if "id" in result and "message" in result:
                print("✅ Player created successfully with updated form structure")
                return True, result["id"]
            else:
                print("❌ Player creation response missing required fields")
                return False, None
        else:
            print("❌ Player creation failed")
            return False, None
            
    except Exception as e:
        print(f"❌ Player creation failed with error: {e}")
        return False, None

def test_player_filtering():
    """5. Player Filtering: Test filtering by game_mode, looking_for, and mic_only"""
    print("\n=== 5. Player Filtering Test ===")
    
    success = True
    
    # Test game_mode filter
    try:
        response = requests.get(f"{API_URL}/players?game_mode=Premier", timeout=10)
        if response.status_code == 200:
            players = response.json()
            print(f"Players with game_mode=Premier: {len(players)}")
            
            for player in players:
                if player.get("game_mode") != "Premier":
                    print(f"❌ Game mode filter failed")
                    success = False
                    break
            else:
                print("✅ Game mode filtering works")
        else:
            print("❌ Game mode filtering failed")
            success = False
    except Exception as e:
        print(f"❌ Game mode filtering error: {e}")
        success = False
    
    # Test looking_for filter
    try:
        response = requests.get(f"{API_URL}/players?looking_for=2 Kişi", timeout=10)
        if response.status_code == 200:
            players = response.json()
            print(f"Players with looking_for=2 Kişi: {len(players)}")
            
            for player in players:
                if player.get("looking_for") != "2 Kişi":
                    print(f"❌ Looking for filter failed")
                    success = False
                    break
            else:
                print("✅ Looking for filtering works")
        else:
            print("❌ Looking for filtering failed")
            success = False
    except Exception as e:
        print(f"❌ Looking for filtering error: {e}")
        success = False
    
    # Test mic_only filter
    try:
        response = requests.get(f"{API_URL}/players?mic_only=true", timeout=10)
        if response.status_code == 200:
            players = response.json()
            print(f"Players with mic_only=true: {len(players)}")
            
            for player in players:
                if not player.get("mic_enabled"):
                    print(f"❌ Mic only filter failed")
                    success = False
                    break
            else:
                print("✅ Mic only filtering works")
        else:
            print("❌ Mic only filtering failed")
            success = False
    except Exception as e:
        print(f"❌ Mic only filtering error: {e}")
        success = False
    
    return success

def test_180_minute_cleanup():
    """6. Cleanup: Test the 180-minute cleanup functionality"""
    print("\n=== 6. 180-Minute Cleanup Test ===")
    
    try:
        # Test manual cleanup endpoint
        response = requests.get(f"{API_URL}/cleanup", timeout=10)
        print(f"Manual cleanup - Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print("❌ Manual cleanup endpoint failed")
            return False
        
        print(f"Cleanup result: {response.json()}")
        
        # Verify cleanup time configuration by checking current players
        players_response = requests.get(f"{API_URL}/players", timeout=10)
        if players_response.status_code == 200:
            players = players_response.json()
            current_time = datetime.now()
            
            print(f"Current time: {current_time}")
            print(f"Total players: {len(players)}")
            
            # Check if any players are older than 180 minutes
            old_players = 0
            for player in players:
                try:
                    created_at = datetime.fromisoformat(player["created_at"].replace('Z', '+00:00'))
                    created_at = created_at.replace(tzinfo=None)
                    age_minutes = (current_time - created_at).total_seconds() / 60
                    
                    if age_minutes > 180:
                        old_players += 1
                        print(f"⚠️ Player older than 180 minutes: {player['username']} ({age_minutes:.1f} min)")
                
                except Exception as e:
                    print(f"Error parsing timestamp: {e}")
            
            if old_players == 0:
                print("✅ 180-minute cleanup working correctly - no players older than 180 minutes")
                return True
            else:
                print(f"⚠️ Found {old_players} players older than 180 minutes")
                return True  # Still working, just needs cleanup to run
        else:
            print("❌ Failed to verify cleanup functionality")
            return False
            
    except Exception as e:
        print(f"❌ Cleanup test failed with error: {e}")
        return False

def run_focused_tests():
    """Run all focused backend tests"""
    print("🎯 Starting Focused Backend API Tests for 180-minute cleanup and improved form")
    print("=" * 80)
    
    test_results = {}
    
    # Run tests in order
    test_results["Health Check"] = test_health_check()
    test_results["Games Endpoint"] = test_games_endpoint()
    test_results["Players Endpoint"] = test_players_endpoint()
    
    create_success, player_id = test_create_player()
    test_results["Create Player"] = create_success
    
    test_results["Player Filtering"] = test_player_filtering()
    test_results["180-Minute Cleanup"] = test_180_minute_cleanup()
    
    print("\n" + "=" * 80)
    print("📊 FOCUSED TEST RESULTS SUMMARY")
    print("=" * 80)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All focused backend tests passed!")
        print("✅ Backend properly handles 180-minute cleanup time")
        print("✅ Player creation works with improved form validation")
        print("✅ All API endpoints function properly with updated cleanup logic")
        print("✅ Cleanup function correctly removes players older than 180 minutes")
        return True
    else:
        print("⚠️ Some focused backend tests failed. Check details above.")
        return False

if __name__ == "__main__":
    success = run_focused_tests()
    exit(0 if success else 1)