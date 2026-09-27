# CryptoTrace — MongoDB Database Layer

This directory contains the database schemas, seed datasets, connection client, and status diagnostics for the CryptoTrace forensic intelligence platform.

---

## Architecture & Configuration

- **Database Engine**: **MongoDB** (Default: `mongodb://127.0.0.1:27017/cryptotrace`)
- **ODM**: **Mongoose** v8.x
- **Environment Configuration**: Set `MONGODB_URI` in `backend/.env`

---

## Directory Structure

```
database/
├── schema/                         # Formal JSON Schema specifications
│   ├── cases.schema.json           # Forensic investigation case schema
│   ├── transactions.schema.json    # Ingested evidence transaction schema
│   └── alerts.schema.json          # Real-time AML risk alerts schema
│
├── seeds/                          # Pre-configured forensic evidence datasets
│   ├── cases.seed.json             # Seed cases (Lazarus, Ransomware, Pig-Butchering)
│   └── alerts.seed.json            # Pre-configured risk alerts
│
├── dbClient.js                     # Unified Mongoose connection manager
├── seed.js                         # Database seeder utility (`npm run db:seed`)
├── status.js                       # Database health & diagnostics (`npm run db:status`)
└── README.md                       # Documentation & instructions
```

---

## Quick Commands

### 1. Check Database Health & Document Counts
```powershell
node database/status.js
# or
npm run db:status
```

### 2. Seed Initial Forensic Cases & Evidence
```powershell
node database/seed.js
# or
npm run db:seed
```

---

## Collections & Schemas

### 1. `cases` Collection
Stores investigated suspect wallets, ML risk scores, factor breakdowns, AI findings, VASP attributions, and counterparty graphs.
- Primary Key: `caseId` (Unique indexed string, e.g. `CASE-ETH-0x8921-LAZ`)
- Address Index: `address` (Indexed cryptocurrency wallet)
- Timestamps: `createdAt`, `updatedAt`

### 2. `transactions` Collection
Stores blockchain transactions associated with investigated cases.
- Index: `caseId`, `hash`, `counterparty`
- Attributes: `block`, `timestamp`, `direction` (IN/OUT), `asset`, `amountUsd`, `riskFlag`

### 3. `alerts` Collection
Stores high-priority AML and heuristic alerts generated during wallet surveillance.
- Index: `caseId`, `wallet`
- Attributes: `sev` (CRITICAL, HIGH, MEDIUM, INFO), `msg`, `reason`, `action`, `time`
