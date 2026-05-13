import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict

# Fix Windows console encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

app = Flask(__name__)
CORS(app, origins=["http://localhost:5000", "http://localhost:5173"])


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "Carbon AI ML Service", "port": 5001})


@app.route('/predict', methods=['POST'])
def predict_endpoint():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400

        result = predict(data)
        return jsonify(result), 200

    except FileNotFoundError as e:
        return jsonify({
            "error": "Model files not found. Please run train_model.py first.",
            "detail": str(e)
        }), 503
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("[INFO] Carbon AI ML Service starting on port 5001 ...")
    app.run(host='0.0.0.0', port=5001, debug=False)
