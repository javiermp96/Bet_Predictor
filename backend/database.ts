import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../data');

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const db = new Database(path.join(dbPath, 'futbol.db'));

// Inicializar tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    homeTeam TEXT,
    awayTeam TEXT,
    league TEXT,
    date TEXT,
    time TEXT,
    oddsHome REAL,
    oddsDraw REAL,
    oddsAway REAL
  );

  CREATE TABLE IF NOT EXISTS predictions (
    matchId TEXT PRIMARY KEY,
    prediction TEXT,
    confidence INTEGER,
    reasoning TEXT,
    suggestedBet TEXT,
    probHome REAL,
    probDraw REAL,
    probAway REAL,
    advancedJson TEXT,
    FOREIGN KEY (matchId) REFERENCES matches(id)
  );
`);

// MIGRATION: try to add advancedJson to predictions if it already exists (catch error safely)
try {
  db.exec("ALTER TABLE predictions ADD COLUMN advancedJson TEXT;");
} catch (e) {
  // column already exists
}

export default db;
