# CryptoTrace — Blockchain Fraud Intelligence & VASP Attribution Platform

A full-stack, enterprise-grade blockchain forensic investigation platform converted from monolithic HTML into a modular architecture:
- **Frontend**: **React** (Vite) + **Vanilla CSS** with dark-mode glassmorphic aesthetics, fund-flow transaction graph, real-time live monitoring stream, AI Copilot drawer, and court-ready report export.
- **Backend API Gateway**: **Node.js** + **Express** managing REST endpoints, case orchestration, and transaction ledgers.
- **Database**: **MongoDB** with **Mongoose ODM** storing investigation cases, transaction evidence, risk alerts, and audit logs (with automatic resilient fallback).
- **AI Microservice**: **Python** (Flask + ML heuristics) providing explainable risk scoring, VASP cluster attribution, and a conversational forensic AI assistant.

---

## Architecture Overview

```
crypto pro/
├── ai-service/                   # Python AI Microservice (Port 5001)
│   ├── models/
│   │   ├── risk_engine.py        # ML Risk & Typology Scoring Engine
│   │   ├── vasp_attribution.py  # Exchange Cluster Attribution Model
│   │   └── copilot.py            # Conversational Forensic AI Copilot
│   ├── app.py                    # Flask REST API
│   └── requirements.txt          # Python dependencies
│
├── backend/                      # Node.js Backend API Gateway (Port 5000)
│   ├── server.js                 # Backend Server Entry Point
│   ├── package.json              # Backend Dependencies & Scripts
│   ├── .env                      # Environment Variables (MongoDB URI & Ports)
│   └── src/
│       ├── config/db.js          # MongoDB Mongoose Connection Manager
│       ├── models/               # Mongoose Schemas (Case, Transaction, Alert)
│       ├── services/             # AI Client, Case Service & Ledger Generator
│       ├── controllers/          # Analysis, Cases & Copilot Controllers
│       └── index.js              # Express App & Route Setup
│
├── database/                     # MongoDB Database Schemas, Seeds & Tools
│   ├── schema/                   # JSON Schema specifications (cases, txs, alerts)
│   ├── seeds/                    # Seed datasets (Lazarus, Ransomware, Pig-Butchering)
│   ├── seed.js                   # Database seeder utility (`npm run db:seed`)
│   ├── status.js                 # MongoDB health & diagnostics (`npm run db:status`)
│   └── dbClient.js               # Unified Mongoose connection manager
│
├── frontend/                     # React + Vite Frontend (Port 3000)
│   ├── src/
│   │   ├── components/           # Navigation, Cards, Graph & AI Copilot Drawer
│   │   ├── pages/                # 14 Full Investigative Forensic Views
│   │   ├── context/              # CaseContext (State & REST API Integration)
│   │   ├── index.css             # Vanilla CSS Design System
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server.js                     # Root entry point shortcut -> backend/server.js
├── backend.js                    # Root entry point shortcut -> backend/server.js
├── package.json                  # Root orchestrator (npm run dev)
├── start.bat                     # 1-click Windows Batch Launcher
└── start.ps1                     # 1-click PowerShell Launcher
```

---

## Quick Start

### 1. Launch Everything Concurrently

Run from the root directory:
```bash
npm run dev
```
*(Or double-click `start.bat` or run `./start.ps1`)*

This concurrently starts:
1. **Python AI Service** on `http://127.0.0.1:5001`
2. **Node.js Express Backend** on `http://127.0.0.1:5000` (Connected to MongoDB)
3. **React Vite Frontend** on `http://127.0.0.1:3000`

### 2. Access the Application
Open your browser at:
👉 **`http://localhost:3000`**

Use demo credentials to sign in:
- **Investigator ID**: `investigator01`
- **Password**: `demo1234`
*(or click the "Use Demo Credentials" button)*

### 3. Database Management (MongoDB)

Check connection and document statistics:
```bash
npm run db:status
```

Seed initial high-profile forensic cases, transaction evidence & alerts:
```bash
npm run db:seed
```

---

## Features & Modules

1. **Wallet Investigation**:
   - Analyzes addresses on Ethereum, Bitcoin, Tron, BNB Chain, and Polygon.
   - Multi-stage animated loading (`Ingesting data` → `Reconstructing graph` → `Detecting intermediaries` → `ML Risk Scoring` → `VASP Attribution`).
   - Circular risk gauge (0-100), explainable factors (+18, +15, etc.), AI findings, and intermediary table.

2. **Interactive Fund Flow Graph**:
   - SVG connector graph showing flow from **Victim → Target Suspect → Intermediary Hops → Exchange Deposit**.
   - Interactive zoom in/out, view reset, and entity inspection drawer.

3. **Transactions Evidence Ledger**:
   - Filterable by IN/OUT directions and searchable by hashes or counterparty labels.
   - Clickable rows opening the immutable transaction detail proof.

4. **Exchange / VASP Attribution**:
   - AI clustering attribution linking suspicious fund hops to cash-out exchanges (e.g. *NovaSwap Global*, *ZenithPay VASP*, *ObsidianX Exchange*, *MeridianCoin OTC*).
   - One-click button to draft an emergency freeze notice.

5. **Conversational AI Forensic Copilot**:
   - Floating drawer allowing investigators to converse with the Python AI service.
   - Generates formal legal freeze notices, explains risk factor weights, and analyzes cross-chain bridges.

6. **Court-Ready Investigation Reports**:
   - Formal case document complete with evidence hashes, chronological timeline, and investigator sign-off.
   - Ready to print (`window.print()`) or export to PDF.

7. **MongoDB Persistence**:
   - All cases, transactions, and alerts are stored in MongoDB (`mongodb://127.0.0.1:27017/cryptotrace`).
   - Resilient fallback: seamlessly continues operating in memory if MongoDB is offline.
