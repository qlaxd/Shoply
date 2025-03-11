const mongoose = require('../../../Backend/node_modules/mongoose');
const AuditLog = require('../../../Backend/models/AuditLog');

async function deSeedAuditLogs() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017');
    
    const result = await AuditLog.deleteMany({});
    
    console.log(`${result.deletedCount} audit log bejegyzés törölve.`);
    
    await mongoose.disconnect();
    console.log('Audit log bejegyzések törlése sikeresen befejeződött!');
  } catch (error) {
    console.error('Hiba az audit log bejegyzések törlése során:', error);
    process.exit(1);
  }
}

deSeedAuditLogs(); 