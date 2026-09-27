import os
# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from flask_cors import CORS
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

from models.risk_engine import risk_engine
from models.vasp_attribution import vasp_engine
from models.copilot import copilot_engine

load_dotenv()

app = Flask(__name__)
CORS(app)

PORT = int(os.getenv("PORT", 5001))

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "CryptoTrace Python AI Service",
        "version": "1.2.0",
        "port": PORT,
        "capabilities": [
            "ML Risk Scoring & Factor Breakdown",
            "VASP Cluster Attribution Engine",
            "Forensic Intelligence Copilot",
            "Investigation Summary Generator"
        ]
    })

@app.route("/api/ai/score-wallet", methods=["POST"])
def score_wallet():
    try:
        data = request.get_json(silent=True) or {}
        address = data.get("address", "").strip()
        chain = data.get("chain", "Ethereum")
        fraud_type = data.get("fraudType", "Investment Scam")
        
        if not address:
            return jsonify({"error": "Address is required"}), 400

        result = risk_engine.analyze(address, chain, fraud_type)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/ai/attribute-vasp", methods=["POST"])
def attribute_vasp():
    try:
        data = request.get_json(silent=True) or {}
        address = data.get("address", "").strip()
        chain = data.get("chain", "Ethereum")
        fraud_type = data.get("fraudType", "Investment Scam")

        if not address:
            return jsonify({"error": "Address is required"}), 400

        attribution = vasp_engine.attribute(address, chain, fraud_type)
        return jsonify({"success": True, "data": attribution})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/ai/copilot-chat", methods=["POST"])
def copilot_chat():
    try:
        data = request.get_json(silent=True) or {}
        message = data.get("message", "").strip()
        case_context = data.get("caseContext", {})

        if not message:
            return jsonify({"error": "Message cannot be empty"}), 400

        response = copilot_engine.answer_query(message, case_context)
        return jsonify({"success": True, "data": response})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/ai/generate-summary", methods=["POST"])
def generate_summary():
    try:
        data = request.get_json(silent=True) or {}
        case_data = data.get("case", {})
        
        addr = case_data.get("address", "Unknown")
        chain = case_data.get("chain", "Ethereum")
        score = case_data.get("score", 75)
        level = case_data.get("level", "High")
        vasp = case_data.get("exchange", {}).get("name", "Unknown VASP")
        fraud = case_data.get("fraudType", "Scam")
        intermediaries = case_data.get("intermediaries", [])

        summary = (
            f"Case Analysis Summary: Target wallet {addr} ({chain}) demonstrated signature behavior consistent with "
            f"{fraud}. An explainable ML risk score of {score}/100 classifies this address under {level} risk. "
            f"Forensic traversal traced funds through {len(intermediaries)} layering node(s) culminating in deposit "
            f"activity attributed to {vasp}. Recommended immediate LEA preservation request and continuous wallet surveillance."
        )

        return jsonify({
            "success": True, 
            "summary": summary,
            "executiveFindings": [
                f"High-confidence correlation with {vasp} deposit pools.",
                f"Structuring observed across {len(intermediaries)} intermediate relay addresses.",
                "Sufficient cryptographic transaction evidence collected for formal inquiry."
            ]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print(f"[*] Starting CryptoTrace Python AI Service on http://127.0.0.1:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=False)
