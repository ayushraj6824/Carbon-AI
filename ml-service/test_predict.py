import sys
import os

# Add ml-service to path so we can import predict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from predict import predict

data = {
    "energyConsumption": 53751.61,
    "renewableEnergy": 12766.8,
    "transportDistance": 3814.12,
    "processEfficiency": 81.07,
    "productionOutput": 3008.9,
    "rawMaterialUsage": 51334.48,
    "claimedEmission": 12.556
}

try:
    result = predict(data)
    print("Result:", result)
except Exception as e:
    print("Error:", e)
