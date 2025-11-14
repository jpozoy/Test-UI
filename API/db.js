// db.js
const { MongoClient } = require("mongodb");

let client;
let clientPromise;

function getMongoUrl() {
  if (process.env.MONGO_URL) return process.env.MONGO_URL;

  const user = process.env.MONGO_USER;
  const pass = process.env.MONGO_PASS;
  const cluster = process.env.MONGO_CLUSTER;

  if (!user || !pass || !cluster) {
    throw new Error("Faltan variables de entorno de MongoDB");
  }

  return `mongodb+srv://${user}:${pass}@${cluster}/?appName=ClusterDB`;
}

function getClient() {
  if (!clientPromise) {
    const uri = getMongoUrl();
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getCollection() {
  const conn = await getClient();
  const dbName = process.env.MONGO_DB || "booksdb";
  const collectionName = process.env.MONGO_COLLECTION || "documents";
  return conn.db(dbName).collection(collectionName);
}

module.exports = { getCollection };
