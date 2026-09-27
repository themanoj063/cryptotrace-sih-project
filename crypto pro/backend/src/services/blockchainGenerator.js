const CHAIN_META = {
  'Ethereum': { sym: 'ETH', color: '#4E8FE0' },
  'Bitcoin': { sym: 'BTC', color: '#E8B94A' },
  'Tron': { sym: 'TRX', color: '#F3506B' },
  'BNB Chain': { sym: 'BNB', color: '#E8B94A' },
  'Polygon': { sym: 'MATIC', color: '#8A6EF0' }
};

const EXCHANGES = [
  { name: 'NovaSwap Global', region: 'Seychelles', type: 'Unregistered offshore exchange', clusterId: 'EX-1180' },
  { name: 'ZenithPay VASP', region: 'UAE (Free Zone)', type: 'Licensed VASP — flagged cluster', clusterId: 'EX-1402' },
  { name: 'ObsidianX Exchange', region: 'Unknown / VPN-masked', type: 'High-risk P2P aggregator', clusterId: 'EX-1891' },
  { name: 'MeridianCoin OTC', region: 'Hong Kong', type: 'OTC desk — prior SAR filings', clusterId: 'EX-1234' }
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick(arr, seed) {
  return arr[Math.floor(seededRand(seed) * arr.length)];
}

function seededAddress(seed, chain) {
  const hex = '0123456789abcdef';
  let a = '';
  if (chain === 'Bitcoin') {
    a = 'bc1q';
    for (let i = 0; i < 34; i++) a += hex[Math.floor(seededRand(seed + i * 1.131) * 16)];
  } else if (chain === 'Tron') {
    a = 'T';
    const b62 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    for (let i = 0; i < 33; i++) a += b62[Math.floor(seededRand(seed + i * 2.177) * b62.length)];
  } else {
    a = '0x';
    for (let i = 0; i < 40; i++) a += hex[Math.floor(seededRand(seed + i * 1.319) * 16)];
  }
  return a;
}

function generateLedgerAndEntities(address, chain, fraudType, aiRisk, aiVasp, caseCounter, userVictimAddress) {
  const seed = hashStr(address + chain + fraudType) || 1;
  const cm = CHAIN_META[chain] || CHAIN_META['Ethereum'];

  // Base metrics
  const score = aiRisk ? aiRisk.score : (28 + Math.floor(seededRand(seed * 1.7) * 70));
  const level = aiRisk ? aiRisk.level : (score <= 30 ? 'Low' : score <= 60 ? 'Medium' : score <= 80 ? 'High' : 'Critical');
  const txCount = aiRisk ? aiRisk.txCount : (40 + Math.floor(seededRand(seed * 2.3) * 900));
  const totalReceived = aiRisk ? aiRisk.totalReceived : (1200 + Math.floor(seededRand(seed * 3.1) * 480000));
  const totalSent = aiRisk ? aiRisk.totalSent : Math.floor(totalReceived * (0.7 + seededRand(seed * 4.2) * 0.28));

  // Exchange attribution
  let exchange = null;
  let confidence = 75;
  if (aiVasp) {
    exchange = {
      name: aiVasp.entity,
      region: aiVasp.region,
      type: aiVasp.entityType,
      clusterId: aiVasp.clusterId,
      jurisdictionRisk: aiVasp.jurisdictionRisk,
      complianceLevel: aiVasp.complianceLevel,
      status: aiVasp.status,
      priorFilings: aiVasp.priorFilings,
      supportingEvidence: aiVasp.supportingEvidence
    };
    confidence = aiVasp.confidence;
  } else {
    const pickedEx = pick(EXCHANGES, seed * 5.5);
    confidence = 58 + Math.floor(seededRand(seed * 6.6) * 40);
    exchange = {
      ...pickedEx,
      status: confidence >= 80 ? 'VERIFIED (Simulated)' : confidence >= 60 ? 'SUSPECTED' : 'UNKNOWN',
      confidence,
      supportingEvidence: [
        `Direct deposit interaction with ${pickedEx.name} cluster wallets`,
        'Transaction timing matches exchange consolidation cycle'
      ]
    };
  }

  // Intermediary / Layering wallets
  const numIntermediaries = aiRisk ? aiRisk.numIntermediaries : (level === 'Low' ? 0 : level === 'Medium' ? 1 : level === 'High' ? 2 : 3);
  const intermediaries = [];
  for (let i = 0; i < numIntermediaries; i++) {
    intermediaries.push({
      address: seededAddress(seed * 7.7 + i * 3.3, chain),
      role: pick(['Layering Wallet', 'Burner Wallet', 'High-Frequency Relay', 'Bridge-Interfacing Wallet'], seed * 7.7 + i),
      txCount: 3 + Math.floor(seededRand(seed * 8.8 + i) * 40),
      amount: Math.floor(totalSent * (0.15 + seededRand(seed * 9.9 + i) * 0.25)),
      risk: pick(['Medium', 'High', 'Critical'], seed * 10 + i),
      reason: pick(['Rapid pass-through under 15 min', 'Multiple unrelated wallets converge here', 'Known mixer-adjacent address', 'Deposit pattern matches exchange batching'], seed * 11 + i)
    });
  }

  const victimAddress = (userVictimAddress && userVictimAddress.trim())
    ? userVictimAddress.trim()
    : seededAddress(seed * 23.1, chain);
  const exchangeDepositAddress = seededAddress(seed * 24.2, chain);

  const now = new Date();
  const firstTx = new Date(now - (10 + Math.floor(seededRand(seed * 12) * 60)) * 86400000);
  const lastTx = new Date(now - Math.floor(seededRand(seed * 13) * 4) * 86400000);

  // Cross chain hops
  const chains = Object.keys(CHAIN_META).filter(c => c !== chain);
  const hopChain1 = pick(chains, seed * 14);
  const numHops = level === 'Low' ? 0 : level === 'Medium' ? 1 : 2;
  const crossChain = [];
  let prevChain = chain;
  for (let i = 0; i < numHops; i++) {
    const dest = i === 0 ? hopChain1 : pick(chains.filter(c => c !== hopChain1), seed * 15 + i);
    crossChain.push({
      from: prevChain,
      to: dest,
      bridge: pick(['Wormhole-style Bridge', 'Multichain Relay', 'LayerZero-style Bridge', 'Native Cross-Chain Swap'], seed * 16 + i),
      amount: Math.floor(totalSent * (0.2 + seededRand(seed * 17 + i) * 0.3)),
      hash: '0x' + Math.abs(hashStr(address + i)).toString(16).padEnd(16, '0').slice(0, 16),
      risk: pick(['Medium', 'High'], seed * 18 + i),
      time: new Date(now - Math.floor(seededRand(seed * 19 + i) * 3) * 86400000)
    });
    prevChain = dest;
  }

  // Alerts
  const alerts = [];
  if (level === 'Critical') {
    alerts.push({
      sev: 'CRITICAL',
      msg: 'Suspect wallet transferred funds to a high-risk exchange cluster.',
      reason: `Deposit matched to ${exchange.name} (${exchange.type})`,
      action: 'Prepare urgent VASP information request.'
    });
  }
  if (numIntermediaries >= 2) {
    alerts.push({
      sev: 'HIGH',
      msg: 'Multiple intermediary wallets detected in fund path.',
      reason: `${numIntermediaries} layering wallets identified between suspect and exchange.`,
      action: 'Monitor all intermediary wallets for further movement.'
    });
  }
  alerts.push({
    sev: 'MEDIUM',
    msg: 'Cross-chain movement detected.',
    reason: 'Funds bridged across chains to obscure origin.',
    action: 'Cross-reference bridge protocol logs.'
  });
  if (level === 'High' || level === 'Critical') {
    alerts.push({
      sev: 'HIGH',
      msg: 'Mixer/tumbler interaction suspected on fund path.',
      reason: 'Transaction pattern consistent with mixing service usage.',
      action: 'Flag for enhanced due diligence.'
    });
  }

  // Evidence Transaction ledger
  const noiseWallets = ['Unknown Retail Wallet', 'Unknown Retail Wallet', 'P2P Counterparty', 'Unrelated Wallet', 'Small Depositor'];
  const sampleSize = Math.min(txCount, 34);
  const meaningful = [];

  // Incoming from victim
  const numIn = level === 'Low' ? 2 : level === 'Medium' ? 3 : 4;
  let receivedLeft = totalReceived;
  for (let i = 0; i < numIn; i++) {
    const amt = i === numIn - 1 ? receivedLeft : Math.floor(totalReceived * (0.15 + seededRand(seed * 30 + i) * 0.25));
    receivedLeft -= amt;
    meaningful.push({
      dir: 'IN',
      cpAddr: victimAddress,
      cpLabel: 'Victim Wallet',
      cpType: 'victim',
      amountUsd: Math.max(amt, 50),
      riskFlag: false,
      order: i
    });
  }

  // Outgoing to intermediaries
  intermediaries.forEach((w, i) => {
    const legs = 1 + Math.floor(seededRand(seed * 31 + i) * 2);
    for (let j = 0; j < legs; j++) {
      meaningful.push({
        dir: 'OUT',
        cpAddr: w.address,
        cpLabel: `Intermediary ${i + 1} (${w.role})`,
        cpType: 'intermediary',
        amountUsd: Math.floor(w.amount / legs),
        riskFlag: true,
        order: 100 + i * 10 + j
      });
    }
  });

  // Final legs to exchange
  const exLegs = 1 + Math.floor(seededRand(seed * 32) * 2);
  for (let i = 0; i < exLegs; i++) {
    meaningful.push({
      dir: 'OUT',
      cpAddr: exchangeDepositAddress,
      cpLabel: `Suspected Exchange Deposit — ${exchange.name}`,
      cpType: 'exchange',
      amountUsd: Math.floor(totalSent * (0.3 + seededRand(seed * 33 + i) * 0.3)),
      riskFlag: true,
      order: 900 + i
    });
  }

  // Fill noise slots
  const noiseCount = Math.max(0, sampleSize - meaningful.length);
  const noise = [];
  for (let i = 0; i < noiseCount; i++) {
    const s = seed * 40 + i * 7.13;
    const addr = seededAddress(s, chain);
    noise.push({
      dir: seededRand(s + 1) > 0.5 ? 'IN' : 'OUT',
      cpAddr: addr,
      cpLabel: pick(noiseWallets, s + 2),
      cpType: 'unknown',
      amountUsd: 40 + Math.floor(seededRand(s + 3) * 4000),
      riskFlag: false,
      order: 200 + i
    });
  }

  const allLegs = [...meaningful, ...noise].sort((a, b) => a.order - b.order);
  const spanMs = Math.max(1, (now - firstTx));
  const transactions = allLegs.map((leg, i) => {
    const ts = new Date(firstTx.getTime() + Math.floor(spanMs * ((i + 1) / (allLegs.length + 1))));
    const block = 18000000 + Math.floor(seededRand(seed * 50 + i) * 900000);
    const hash = (chain === 'Tron' ? '' : '0x') + Math.abs(hashStr(address + 'txhash' + i)).toString(16).padEnd(24, '0').slice(0, 24);
    return {
      hash,
      block,
      timestamp: ts,
      direction: leg.dir,
      asset: cm.sym,
      amountUsd: leg.amountUsd,
      counterparty: leg.cpAddr,
      counterpartyLabel: leg.cpLabel,
      counterpartyType: leg.cpType,
      status: 'Confirmed',
      riskFlag: leg.riskFlag
    };
  }).sort((a, b) => b.timestamp - a.timestamp);

  // Counterparties aggregation
  const cpMap = {};
  transactions.forEach(t => {
    if (!cpMap[t.counterparty]) {
      cpMap[t.counterparty] = {
        address: t.counterparty,
        label: t.counterpartyLabel,
        type: t.counterpartyType,
        txCount: 0,
        totalIn: 0,
        totalOut: 0,
        first: t.timestamp,
        last: t.timestamp
      };
    }
    const c = cpMap[t.counterparty];
    c.txCount++;
    if (t.direction === 'IN') c.totalOut += t.amountUsd;
    else c.totalIn += t.amountUsd;
    if (t.timestamp < c.first) c.first = t.timestamp;
    if (t.timestamp > c.last) c.last = t.timestamp;
  });

  const counterpartyRiskOf = (type) => type === 'exchange' ? 'High' : type === 'intermediary' ? 'High' : type === 'victim' ? 'Low' : 'Medium';
  const counterparties = Object.values(cpMap).map(c => ({
    ...c,
    risk: counterpartyRiskOf(c.type)
  })).sort((a, b) => (b.totalIn + b.totalOut) - (a.totalIn + a.totalOut));

  const txHashes = [];
  for (let i = 0; i < 4; i++) {
    txHashes.push('0x' + Math.abs(hashStr(address + 'tx' + i)).toString(16).padEnd(20, '0').slice(0, 20));
  }

  const caseId = `CT-2026-0${caseCounter}`;

  return {
    caseId,
    id: caseId,
    address,
    chain,
    fraudType,
    score,
    level,
    txCount,
    totalReceived,
    totalSent,
    victimAddress,
    exchangeDepositAddress,
    exchange,
    confidence,
    factors: aiRisk ? aiRisk.factors : [],
    aiFindings: aiRisk ? aiRisk.aiFindings : [],
    intermediaries,
    counterparties,
    crossChain,
    alerts,
    transactions,
    sampleSize,
    firstTx,
    lastTx,
    txHashes,
    recommendations: aiRisk ? aiRisk.recommendations : [
      'Preserve relevant transaction hashes and block heights as evidence.',
      'Monitor all identified intermediary wallets for further activity.',
      'Verify the suspected VASP attribution through formal request.',
      'Prepare a VASP information request for KYC records, where applicable.',
      'Consider an asset-freezing workflow per applicable legal procedure.',
      'Preserve blockchain evidence, timestamps, and node snapshots.'
    ]
  };
}

module.exports = {
  CHAIN_META,
  EXCHANGES,
  generateLedgerAndEntities
};
