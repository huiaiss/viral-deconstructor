const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const dir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(dir).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`Running: ${file}`);
    await pool.query(sql);
  }
  console.log('Migrations complete');
  await pool.end();
}

migrate().catch((e) => { console.error(e); process.exit(1); });
