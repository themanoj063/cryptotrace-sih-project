/**
 * CryptoTrace Database Seeder
 * Populates MongoDB with forensic investigation cases, transactions, and alerts
 */
const { getDatabaseConnection, MONGODB_URI, mongoose } = require('./dbClient');
const Case = require('../backend/src/models/Case');
const Transaction = require('../backend/src/models/Transaction');
const Alert = require('../backend/src/models/Alert');

const casesSeed = require('./seeds/cases.seed.json');
const alertsSeed = require('./seeds/alerts.seed.json');

async function seedDatabase() {
  console.log('====================================================');
  console.log('  CryptoTrace MongoDB Database Seeder');
  console.log(`  Target URI: ${MONGODB_URI}`);
  console.log('====================================================\n');

  try {
    console.log('[*] Connecting to MongoDB...');
    await getDatabaseConnection();
    console.log('[+] Connected successfully to MongoDB.\n');

    // 1. Seed Cases
    console.log(`[*] Seeding ${casesSeed.length} investigation cases...`);
    let casesInserted = 0;
    for (const c of casesSeed) {
      await Case.findOneAndUpdate(
        { caseId: c.caseId },
        c,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      casesInserted++;
      console.log(`    -> Seeded Case: [${c.caseId}] - ${c.fraudType} (${c.chain})`);
    }

    // 2. Seed Alerts
    console.log(`\n[*] Seeding ${alertsSeed.length} risk alerts...`);
    let alertsInserted = 0;
    for (const a of alertsSeed) {
      await Alert.findOneAndUpdate(
        { caseId: a.caseId, msg: a.msg },
        a,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      alertsInserted++;
      console.log(`    -> Seeded Alert: [${a.sev}] for ${a.wallet.substring(0, 10)}...`);
    }

    // 3. Seed Sample Transactions for CASE-ETH-0x8921-LAZ
    console.log('\n[*] Generating and seeding forensic transaction ledger...');
    const txCount = await Transaction.countDocuments({ caseId: 'CASE-ETH-0x8921-LAZ' });
    if (txCount === 0) {
      const sampleTxs = [
        {
          caseId: 'CASE-ETH-0x8921-LAZ',
          hash: '0x3a91b92019485710293847561029384756102938475610293847561029384756',
          block: 19842010,
          timestamp: new Date(Date.now() - 3600000 * 2),
          direction: 'IN',
          asset: 'ETH',
          amountUsd: 3840000,
          counterparty: '0x4b10293847561029384756102938475610293847',
          counterpartyLabel: 'Exploit Smart Contract (Victim)',
          counterpartyType: 'victim',
          riskFlag: true
        },
        {
          caseId: 'CASE-ETH-0x8921-LAZ',
          hash: '0x8821f92019485710293847561029384756102938475610293847561029384756',
          block: 19842015,
          timestamp: new Date(Date.now() - 3600000 * 1.8),
          direction: 'OUT',
          asset: 'ETH',
          amountUsd: 1920000,
          counterparty: '0x1111a12384756102938475610293847561029384',
          counterpartyLabel: 'Peeling Intermediary 1',
          counterpartyType: 'intermediary',
          riskFlag: true
        },
        {
          caseId: 'CASE-ETH-0x8921-LAZ',
          hash: '0x7741e92019485710293847561029384756102938475610293847561029384756',
          block: 19842022,
          timestamp: new Date(Date.now() - 3600000 * 1.5),
          direction: 'OUT',
          asset: 'ETH',
          amountUsd: 960000,
          counterparty: '0x2222b23384756102938475610293847561029384',
          counterpartyLabel: 'Peeling Intermediary 2',
          counterpartyType: 'intermediary',
          riskFlag: true
        },
        {
          caseId: 'CASE-ETH-0x8921-LAZ',
          hash: '0x5511d92019485710293847561029384756102938475610293847561029384756',
          block: 19842035,
          timestamp: new Date(Date.now() - 3600000 * 1.2),
          direction: 'OUT',
          asset: 'ETH',
          amountUsd: 945000,
          counterparty: '0x3333c34384756102938475610293847561029384',
          counterpartyLabel: 'Consolidation Hub',
          counterpartyType: 'intermediary',
          riskFlag: true
        },
        {
          caseId: 'CASE-ETH-0x8921-LAZ',
          hash: '0x1122a92019485710293847561029384756102938475610293847561029384756',
          block: 19842048,
          timestamp: new Date(Date.now() - 3600000 * 0.9),
          direction: 'OUT',
          asset: 'USDT',
          amountUsd: 3825000,
          counterparty: '0x71c0293847561029384756102938475610293847',
          counterpartyLabel: 'NovaSwap Deposit Omnibus Hot Wallet',
          counterpartyType: 'exchange',
          riskFlag: true
        }
      ];

      await Transaction.insertMany(sampleTxs);
      console.log(`    -> Seeded ${sampleTxs.length} verified evidence transactions.`);
    } else {
      console.log(`    -> Evidence transactions already present (${txCount} records).`);
    }

    // Summary counts
    const totalCases = await Case.countDocuments();
    const totalAlerts = await Alert.countDocuments();
    const totalTxs = await Transaction.countDocuments();

    console.log('\n====================================================');
    console.log('  MongoDB Seeding Completed Successfully!');
    console.log(`  Total Cases in MongoDB:        ${totalCases}`);
    console.log(`  Total Alerts in MongoDB:       ${totalAlerts}`);
    console.log(`  Total Transactions in MongoDB: ${totalTxs}`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n[!] Error during database seeding:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[*] Database connection closed.');
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
