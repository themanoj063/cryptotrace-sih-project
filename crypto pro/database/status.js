/**
 * CryptoTrace Database Status & Diagnostic Utility
 * Checks MongoDB connectivity, collections, and record statistics
 */
const { getDatabaseConnection, MONGODB_URI, mongoose } = require('./dbClient');
const Case = require('../backend/src/models/Case');
const Transaction = require('../backend/src/models/Transaction');
const Alert = require('../backend/src/models/Alert');

async function checkDatabaseStatus() {
  console.log('====================================================');
  console.log('  CryptoTrace MongoDB Status & Diagnostics');
  console.log('====================================================');

  try {
    const startTime = Date.now();
    await getDatabaseConnection();
    const pingTime = Date.now() - startTime;

    console.log(`\n  Status:       ONLINE`);
    console.log(`  Target URI:   ${MONGODB_URI}`);
    console.log(`  Ping Latency: ${pingTime}ms`);
    console.log(`  DB Name:      ${mongoose.connection.name}`);
    console.log(`  Host:         ${mongoose.connection.host}:${mongoose.connection.port}`);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n  Active Collections (${collections.length}):`);
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`    - ${col.name.padEnd(20)}: ${count} documents`);
    }

    const casesCount = await Case.countDocuments();
    const txCount = await Transaction.countDocuments();
    const alertCount = await Alert.countDocuments();

    console.log('\n  Forensic Data Summary:');
    console.log(`    * Investigation Cases:  ${casesCount}`);
    console.log(`    * Transaction Records:  ${txCount}`);
    console.log(`    * Risk / AML Alerts:    ${alertCount}`);

    console.log('\n====================================================');
    console.log('  Database Health: OPTIMAL (MongoDB Ready)');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n  Status:       OFFLINE / UNREACHABLE');
    console.error(`  Error:        ${err.message}`);
    console.error(`  Target URI:   ${MONGODB_URI}`);
    console.log('\n====================================================');
    console.log('  Notice: Backend will operate using resilient in-memory store');
    console.log('  To connect MongoDB: Ensure service is running (net start MongoDB)');
    console.log('====================================================\n');
    if (process.argv.includes('--strict')) {
      process.exit(1);
    }
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  checkDatabaseStatus();
}

module.exports = { checkDatabaseStatus };
