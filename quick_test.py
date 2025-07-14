#!/usr/bin/env python3
"""
Quick test for player creation without age_range field
"""

import requests
import json

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

def test_create_player_simple():
    """Test creating a player without age_range field"""
    print("\n=== Testing Player Creation (No age_range) ===")
    
    player_data = {
        "username": "TestPlayerNoAge",
        "tag": "NOAGE",
        "lobby_code": "TEST1",
        "game": "valorant",
        "min_rank": "Demir",
        "max_rank": "Bronz",
        "looking_for": "1 Kişi",
        "game_mode": "Dereceli",
        "mic_enabled": True
    }
    
    try:
        print(f"Sending player data: {json.dumps(player_data, indent=2)}")
        response = requests.post(f"{API_URL}/players", 
                               json=player_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Player created successfully without age_range field")
            return True
        else:
            print("❌ Player creation failed")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_get_created_player():
    """Verify the created player appears in the list"""
    print("\n=== Verifying Created Player ===")
    
    try:
        response = requests.get(f"{API_URL}/players", timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            players = response.json()
            print(f"Total players: {len(players)}")
            
            # Look for our test player
            for player in players:
                if player.get("username") == "TestPlayerNoAge":
                    print(f"Found test player: {json.dumps(player, indent=2)}")
                    
                    # Verify no age_range field exists
                    if "age_range" in player:
                        print("❌ age_range field still exists in player data")
                        return False
                    else:
                        print("✅ age_range field successfully removed from player data")
                        return True
            
            print("⚠️ Test player not found in list")
            return False
        else:
            print("❌ Failed to get players")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Backend API without age_range field")
    print("=" * 50)
    
    # Test player creation
    creation_success = test_create_player_simple()
    
    # Test player retrieval
    retrieval_success = test_get_created_player()
    
    print("\n" + "=" * 50)
    print("📊 RESULTS")
    print("=" * 50)
    print(f"Player Creation: {'✅ PASS' if creation_success else '❌ FAIL'}")
    print(f"Player Retrieval: {'✅ PASS' if retrieval_success else '❌ FAIL'}")
    
    if creation_success and retrieval_success:
        print("🎉 Backend API works correctly without age_range field!")
    else:
        print("⚠️ Some issues found")