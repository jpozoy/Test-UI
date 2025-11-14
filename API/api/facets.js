// api/facets.js
const { getCollection } = require("../db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.json({ error: "Método no permitido" });
  }

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

    res.statusCode = 200;
    return res.json(facet);
  } catch (err) {
    console.error("Error en GET /api/books/facets:", err);
    res.statusCode = 500;
    return res.json({ error: "Error interno del servidor" });
  }
};
