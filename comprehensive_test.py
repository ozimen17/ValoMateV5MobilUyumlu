#!/usr/bin/env python3
"""
Comprehensive Backend API Test for age_range field removal
Tests all the functionality requested in the review
"""

import requests
import json
import time

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
API_URL = f"{BASE_URL}/api"
print(f"Testing backend at: {API_URL}")

def test_health_check():
    """1. Health Check: Test the /api/health endpoint"""
    print("\n1. === Testing Health Check ===")
    try:
        response = requests.get(f"{API_URL}/health", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get("status") == "ok":
            print("✅ Health check passed")
            return True
        else:
            print("❌ Health check failed")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_games_endpoint():
    """2. Games Endpoint: Test /api/games endpoint"""
    print("\n2. === Testing Games Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/games", timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            games = response.json()
            print(f"Number of games: {len(games)}")
            if len(games) > 0:
                print(f"Sample game: {games[0]}")
                print("✅ Games endpoint working")
                return True
            else:
                print("❌ No games returned")
                return False
        else:
            print("❌ Games endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Games endpoint failed: {e}")
        return False

def test_players_endpoint():
    """3. Players Endpoint: Test /api/players?game=valorant"""
    print("\n3. === Testing Players Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/players?game=valorant", timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            players = response.json()
            print(f"Number of Valorant players: {len(players)}")
            
            if len(players) > 0:
                player = players[0]
                print(f"Sample player: {json.dumps(player, indent=2)}")
                
                # Verify no age_range field
                if "age_range" in player:
                    print("❌ age_range field still exists")
                    return False
                else:
                    print("✅ age_range field successfully removed")
                
                # Verify required fields exist
                required_fields = ["id", "username", "tag", "lobby_code", "game", "min_rank", "max_rank", 
                                 "looking_for", "game_mode", "mic_enabled", "created_at"]
                missing_fields = [field for field in required_fields if field not in player]
                if missing_fields:
                    print(f"❌ Missing fields: {missing_fields}")
                    return False
                
                print("✅ Players endpoint working correctly")
                return True
            else:
                print("⚠️ No players found (might be expected)")
                return True
        else:
            print("❌ Players endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Players endpoint failed: {e}")
        return False

def test_create_player():
    """4. Create Player: Test creating a new player without age_range field"""
    print("\n4. === Testing Create Player (No age_range) ===")
    
    player_data = {
        "username": "ReviewTestPlayer",
        "tag": "REVIEW",
        "lobby_code": "REV01",
        "min_rank": "Altın",
        "max_rank": "Elmas",
        "looking_for": "2 Kişi",
        "game_mode": "Premier",
        "mic_enabled": True
    }
    
    try:
        print(f"Creating player: {json.dumps(player_data, indent=2)}")
        response = requests.post(f"{API_URL}/players", 
                               json=player_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if "id" in result:
                print("✅ Player created successfully without age_range field")
                return True, result["id"]
            else:
                print("❌ No ID returned")
                return False, None
        else:
            print("❌ Player creation failed")
            return False, None
            
    except Exception as e:
        print(f"❌ Player creation failed: {e}")
        return False, None

def test_player_filtering():
    """5. Player Filtering: Test filtering by game_mode, looking_for, and mic_only"""
    print("\n5. === Testing Player Filtering ===")
    
    filters_to_test = [
        ("game_mode", "Premier"),
        ("looking_for", "2 Kişi"),
        ("mic_only", "true")
    ]
    
    all_passed = True
    
    for filter_name, filter_value in filters_to_test:
        try:
            response = requests.get(f"{API_URL}/players?{filter_name}={filter_value}", timeout=30)
            print(f"Filter {filter_name}={filter_value}: Status {response.status_code}")
            
            if response.status_code == 200:
                players = response.json()
                print(f"  Found {len(players)} players")
                
                # Verify filtering works correctly
                for player in players:
                    if filter_name == "game_mode" and player.get("game_mode") != filter_value:
                        print(f"  ❌ Filter failed: expected {filter_value}, got {player.get('game_mode')}")
                        all_passed = False
                    elif filter_name == "looking_for" and player.get("looking_for") != filter_value:
                        print(f"  ❌ Filter failed: expected {filter_value}, got {player.get('looking_for')}")
                        all_passed = False
                    elif filter_name == "mic_only" and not player.get("mic_enabled"):
                        print(f"  ❌ Mic filter failed: expected mic_enabled=true, got {player.get('mic_enabled')}")
                        all_passed = False
                
                print(f"  ✅ {filter_name} filtering works")
            else:
                print(f"  ❌ {filter_name} filtering failed")
                all_passed = False
                
        except Exception as e:
            print(f"  ❌ {filter_name} filtering error: {e}")
            all_passed = False
    
    return all_passed

def test_cleanup():
    """6. Cleanup: Test the cleanup functionality"""
    print("\n6. === Testing Cleanup Functionality ===")
    try:
        response = requests.get(f"{API_URL}/cleanup", timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Cleanup result: {result}")
            print("✅ Cleanup functionality working")
            return True
        else:
            print("❌ Cleanup failed")
            return False
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")
        return False

def run_comprehensive_test():
    """Run all tests requested in the review"""
    print("🚀 COMPREHENSIVE BACKEND API TEST")
    print("Testing backend after age_range field removal")
    print("=" * 60)
    
    test_results = {}
    
    # Run all tests
    test_results["Health Check"] = test_health_check()
    test_results["Games Endpoint"] = test_games_endpoint()
    test_results["Players Endpoint"] = test_players_endpoint()
    
    create_success, player_id = test_create_player()
    test_results["Create Player"] = create_success
    
    test_results["Player Filtering"] = test_player_filtering()
    test_results["Cleanup"] = test_cleanup()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 COMPREHENSIVE TEST RESULTS")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Backend API works correctly without age_range field")
        print("✅ Player creation works with new model structure")
        print("✅ Player retrieval and filtering work properly")
        print("✅ Cleanup functionality is operational")
        return True
    else:
        print("⚠️ Some tests failed. Check details above.")
        return False

if __name__ == "__main__":
    success = run_comprehensive_test()
    exit(0 if success else 1)