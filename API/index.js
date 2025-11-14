// api/index.js
const express = require("express");
const serverless = require("serverless-http");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// Si vas a consumir la API desde OTRO dominio, puedes descomentar esto:
const cors = require("cors");
app.use(cors());

// ---------- Configuración MongoDB (similar a tu FastAPI) ----------

let client;
let clientPromise;

function getMongoUrl() {
  if (process.env.MONGO_URL) {
    return process.env.MONGO_URL;
  }

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

// ---------- Endpoints (traducción de tu FastAPI) ----------

// GET /api/books?q=...
app.get("/books", async (req, res) => {
  const q = req.query.q || null;

  try {
    const collection = await getCollection();
    const pipeline = [];

    if (q) {
      pipeline.push({
        $search: {
          index: "books_search_index", // mismo índice que en FastAPI
          text: {
            query: q,
            path: ["title", "description", "categories"],
          },
          highlight: {
            path: ["title", "description"],
          },
        },
      });
    } else {
      // sin query, devuelve hasta 600
      pipeline.push({ $limit: 600 });
    }

    pipeline.push({
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        title: 1,
        description: 1,
        price: 1,
        number_of_reviews: { $toInt: "$number_of_reviews" },
        rating: 1,
        categories: 1,
        image_url: 1,
        highlights: { $meta: "searchHighlights" },
      },
    });

    const results = await collection.aggregate(pipeline).toArray();

    return res.status(200).json({
      count: results.length,
      books: results,
    });
  } catch (err) {
    console.error("Error en GET /api/books:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/books/facets
app.get("/books/facets", async (req, res) => {
  try {
    const collection = await getCollection();

    const pipeline = [
      {
        $searchMeta: {
          index: "books_search_index",
          facet: {
            facets: {
              categoriesFacet: {
                type: "string",
                path: "categories",
              },
              ratingFacet: {
                type: "string",
                path: "rating",
              },
              priceFacet: {
                type: "number",
                path: "price",
                boundaries: [0, 10, 20, 40, 60, 100],
              },
            },
          },
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    const facet = result[0]?.facet || {};

    return res.status(200).json(facet);
  } catch (err) {
    console.error("Error en GET /api/books/facets:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/books/:id
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await getCollection();

    const book = await collection.findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    const result = {
      ...book,
      id: String(book._id),
    };
    delete result._id;

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error en GET /api/books/:id:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ---------- Exportar como handler serverless para Vercel ----------
module.exports = serverless(app);
