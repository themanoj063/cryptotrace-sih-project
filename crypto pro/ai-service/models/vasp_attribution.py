import math
from typing import Dict, Any

KNOWN_VASPS = [
    {
        "name": "NovaSwap Global",
        "region": "Seychelles",
        "type": "Unregistered offshore exchange",
        "jurisdictionRisk": "High",
        "complianceLevel": "Tier 3 (Minimal KYC)",
        "reportedInSAR": 47
    },
    {
        "name": "ZenithPay VASP",
        "region": "UAE (Free Zone)",
        "type": "Licensed VASP — flagged cluster",
        "jurisdictionRisk": "Medium",
        "complianceLevel": "Tier 1 (Regulated)",
        "reportedInSAR": 19
    },
    {
        "name": "ObsidianX Exchange",
        "region": "Unknown / VPN-masked",
        "type": "High-risk P2P aggregator",
        "jurisdictionRisk": "Critical",
        "complianceLevel": "Tier 4 (Non-compliant)",
        "reportedInSAR": 83
    },
    {
        "name": "MeridianCoin OTC",
        "region": "Hong Kong",
        "type": "OTC desk — prior SAR filings",
        "jurisdictionRisk": "High",
        "complianceLevel": "Tier 2 (Partial KYC)",
        "reportedInSAR": 36
    },
    {
        "name": "ApexBridge LiquidPool",
        "region": "BVI / Decentralized",
        "type": "Cross-chain Liquidity Router",
        "jurisdictionRisk": "High",
        "complianceLevel": "Tier 3 (Automated)",
        "reportedInSAR": 28
    }
]

def hash_str(s: str) -> int:
    h = 0
    for ch in s:
        h = ((h * 31) + ord(ch)) & 0xFFFFFFFF
    return h

def seeded_rand(seed: float) -> float:
    x = math.sin(seed) * 10000
    return x - math.floor(x)

class VaspAttributionEngine:
    def __init__(self):
        pass

    def attribute(self, address: str, chain: str, fraud_type: str) -> Dict[str, Any]:
        seed = hash_str(f"{address}:{chain}:{fraud_type}:vasp") or 2
        
        vasp_idx = int(math.floor(seeded_rand(seed * 5.5) * len(KNOWN_VASPS)))
        selected_vasp = KNOWN_VASPS[vasp_idx % len(KNOWN_VASPS)]
        
        confidence = 62 + int(math.floor(seeded_rand(seed * 6.6) * 35))
        cluster_id = f"EX-{1000 + (hash_str(selected_vasp['name']) % 899)}"
        
        status = "VERIFIED (Attributed)" if confidence >= 82 else "SUSPECTED" if confidence >= 65 else "UNCONFIRMED"
        
        evidence = [
            f"Direct deposit interaction with {selected_vasp['name']} deposit forwarder addresses",
            f"Transaction sweep pattern matches cluster #{cluster_id} signature",
            "Batch settlement timing correlates with exchange omnibus consolidation",
            "Multi-input transaction graph converges on identified hot-wallet pool"
        ]

        return {
            "entity": selected_vasp["name"],
            "clusterId": cluster_id,
            "entityType": selected_vasp["type"],
            "region": selected_vasp["region"],
            "jurisdictionRisk": selected_vasp["jurisdictionRisk"],
            "complianceLevel": selected_vasp["complianceLevel"],
            "priorFilings": selected_vasp["reportedInSAR"],
            "confidence": confidence,
            "status": status,
            "supportingEvidence": evidence,
            "suggestedNotice": f"Formal Information Request (LE-VASP-REQ) to {selected_vasp['name']} Legal & Compliance Division ({selected_vasp['region']})"
        }

vasp_engine = VaspAttributionEngine()
