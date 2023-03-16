const pool = require("../../modele/database");
const fs = require("fs"); // work with file system
const path = require("path");

async function initDB() {
  const client = await pool.connect();
  try {
    const query = fs.readFileSync(
      //lis fichier
      path.join(__dirname, "../SQL/createDB.SQL"),
      "utf-8"
    );
    await client.query(query); // exécuter script sql pour créer la BD
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}
initDB().then(() => console.log("done"));
