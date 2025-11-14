// api/books/index.js
const { getCollection } = require("../../db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.json({ error: "Método no permitido" });
  }

  const q = req.query.q || null;

  try {
    const collection = await getCollection();
    const pipeline = [];

    if (q) {
      pipeline.push({
        $search: {
          index: "books_search_index",
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

    res.statusCode = 200;
    return res.json({
      count: results.length,
      books: results,
    });
  } catch (err) {
    console.error("Error en GET /api/books:", err);
    res.statusCode = 500;
    return res.json({ error: "Error interno del servidor" });
  }
};
