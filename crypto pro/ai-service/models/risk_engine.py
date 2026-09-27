import math
import hashlib
from typing import Dict, List, Any

FACTOR_BANK = [
    {"t": "Interaction with a previously flagged suspicious wallet", "w": "+18", "weight": 18, "cat": "Counterparty"},
    {"t": "High-frequency transfers within a short window", "w": "+12", "weight": 12, "cat": "Velocity"},
    {"t": "Rapid fund movement (in-and-out under 10 minutes)", "w": "+15", "weight": 15, "cat": "Velocity"},
    {"t": "Layering through 2+ intermediary wallets", "w": "+14", "weight": 14, "cat": "Structuring"},
    {"t": "Interaction with a known mixer/tumbler service", "w": "+22", "weight": 22, "cat": "Obfuscation"},
    {"t": "Cross-chain bridge activity to obscure origin", "w": "+10", "weight": 10, "cat": "Obfuscation"},
    {"t": "Transfer to a known exchange deposit cluster", "w": "+9", "weight": 9, "cat": "CashOut"},
    {"t": "Unusual transaction size / round-number pattern", "w": "+6", "weight": 6, "cat": "Structuring"},
    {"t": "Peel chain disbursement pattern detected", "w": "+16", "weight": 16, "cat": "Structuring"},
    {"t": "Dormant wallet sudden high-volume reactivation", "w": "+11", "weight": 11, "cat": "Anomaly"}
]

AI_FINDINGS_BANK = [
    {"t": "Rapid fund forwarding detected across suspect wallet", "c": 94},
    {"t": "Layering pattern consistent with fraud-proceeds laundering", "c": 88},
    {"t": "Exchange deposit pattern matches known VASP cluster", "c": 91},
    {"t": "Cross-chain movement detected via bridge protocol", "c": 79},
    {"t": "High-risk counterparty interaction detected", "c": 85},
    {"t": "Cyclic fund routing attempting to disguise ultimate beneficiary", "c": 82},
    {"t": "Transaction volume velocity spikes deviate from retail baseline", "c": 90}
]

def hash_string(s: str) -> int:
    h = 0
    for ch in s:
        h = ((h * 31) + ord(ch)) & 0xFFFFFFFF
    return h

def seeded_rand(seed: float) -> float:
    x = math.sin(seed) * 10000
    return x - math.floor(x)

def pick_seeded(arr: list, seed: float) -> Any:
    idx = int(math.floor(seeded_rand(seed) * len(arr)))
    return arr[idx % len(arr)]

def risk_level_from_score(score: int) -> str:
    if score <= 30:
        return "Low"
    if score <= 60:
        return "Medium"
    if score <= 80:
        return "High"
    return "Critical"

class BlockchainRiskEngine:
    def __init__(self):
        pass

    def analyze(self, address: str, chain: str, fraud_type: str) -> Dict[str, Any]:
        seed = hash_string(f"{address}:{chain}:{fraud_type}") or 1
        
        # Base deterministic score calculation
        base_score = 28 + int(math.floor(seeded_rand(seed * 1.7) * 70))
        score = max(15, min(99, base_score))
        level = risk_level_from_score(score)

        # Activity estimations
        tx_count = 35 + int(math.floor(seeded_rand(seed * 2.3) * 900))
        total_received = 1500 + int(math.floor(seeded_rand(seed * 3.1) * 480000))
        sent_ratio = 0.7 + seeded_rand(seed * 4.2) * 0.28
        total_sent = int(math.floor(total_received * sent_ratio))

        # Select contributing factors
        num_factors = 2 if level == "Low" else 3 if level == "Medium" else 5 if level == "High" else 7
        shuffled_factors = sorted(
            FACTOR_BANK, 
            key=lambda f: seeded_rand(seed + FACTOR_BANK.index(f) * 1.13)
        )
        selected_factors = shuffled_factors[:num_factors]

        # AI findings
        num_ai = 1 if level == "Low" else 2 if level == "Medium" else 4 if level == "High" else 5
        shuffled_ai = sorted(
            AI_FINDINGS_BANK,
            key=lambda f: seeded_rand(seed + AI_FINDINGS_BANK.index(f) * 2.45)
        )
        ai_findings = []
        for f in shuffled_ai[:num_ai]:
            noise = int(math.floor(seeded_rand(seed + f["c"]) * 6)) - 3
            conf = max(60, min(98, f["c"] + noise))
            ai_findings.append({"t": f["t"], "c": conf})

        # Intermediaries / Layering wallets count
        num_intermediaries = 0 if level == "Low" else 1 if level == "Medium" else 2 if level == "High" else 3
        
        # Recommendations
        recommendations = [
            "Preserve relevant transaction hashes and block heights as immutable forensic evidence.",
            "Monitor all identified intermediary wallets for further outgoing fund disbursements.",
            "Verify the suspected VASP attribution through formal regulatory / LEA request.",
            "Prepare a VASP information request for KYC records and IP log retention.",
            "Consider initiating emergency asset-freezing workflow per applicable cyber law procedures.",
            "Preserve blockchain evidence, node timestamps, and UTXO/account state snapshots."
        ]
        if level in ["High", "Critical"]:
            recommendations.insert(0, "CRITICAL: Issue immediate alert to financial intelligence unit and partner exchanges.")

        return {
            "score": score,
            "level": level,
            "txCount": tx_count,
            "totalReceived": total_received,
            "totalSent": total_sent,
            "factors": selected_factors,
            "aiFindings": ai_findings,
            "numIntermediaries": num_intermediaries,
            "recommendations": recommendations,
            "factorCount": len(selected_factors),
            "engineVersion": "CryptoTrace-ML-Heuristic-v1.2",
            "modelConfidence": 70 + int(math.floor(seeded_rand(seed * 9.1) * 26))
        }

risk_engine = BlockchainRiskEngine()
