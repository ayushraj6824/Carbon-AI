import requests
import json

base_url = "http://localhost:5000/api"

# 1. Register
user = {
    "name": "E2E Test User",
    "email": "e2e@example.com",
    "password": "password123"
}
try:
    res = requests.post(f"{base_url}/auth/register", json=user)
    if res.status_code == 409:
        res = requests.post(f"{base_url}/auth/login", json=user)
    token = res.json()["token"]
    print("Logged in. Token:", token[:10], "...")
except Exception as e:
    print("Auth error:", e)
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

# 2. Submit Claim with missing/empty numeric fields
claim1 = {
    "sector": "Manufacturing",
    "industrySector": "Testing",
    "energyConsumption": "",
    "renewableEnergy": None,
    "transportDistance": "invalid_string",
    "processEfficiency": "",
    "productionOutput": 0,
    "rawMaterialUsage": "",
    "claimedEmission": "",
    "transportMode": "Truck",
    "carbonReductionStrategy": "Energy Efficiency"
}

print("\n--- Testing Empty/Invalid Payload ---")
res1 = requests.post(f"{base_url}/claims/validate", json=claim1, headers=headers)
print("Status:", res1.status_code)
print(json.dumps(res1.json(), indent=2))

# 3. Submit Claim with realistic valid data
claim2 = {
    "sector": "Manufacturing",
    "industrySector": "Steel",
    "energyConsumption": 53751.61,
    "renewableEnergy": 12766.8,
    "nonRenewableEnergy": 40984.81,
    "transportDistance": 3814.12,
    "processEfficiency": 81.07,
    "productionOutput": 3008.9,
    "rawMaterialUsage": 51334.48,
    "claimedEmission": 16.0,
    "transportMode": "Truck",
    "carbonReductionStrategy": "Energy Efficiency"
}

print("\n--- Testing Valid Realistic Payload ---")
res2 = requests.post(f"{base_url}/claims/validate", json=claim2, headers=headers)
print("Status:", res2.status_code)
print(json.dumps(res2.json(), indent=2))
