// api/books/[id].js
const { getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const { id } = req.query;

  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.json({ error: "Método no permitido" });
  }

  if (!id) {
    res.statusCode = 400;
    return res.json({ error: "Falta el id" });
  }

  try {
    const collection = await getCollection();

    const book = await collection.findOne({ _id: new ObjectId(id) });

    if (!book) {
      res.statusCode = 404;
      return res.json({ error: "Libro no encontrado" });
    }

    const result = {
      ...book,
      id: String(book._id),
    };
    delete result._id;

    res.statusCode = 200;
    return res.json(result);
  } catch (err) {
    console.error("Error en GET /api/books/[id]:", err);
    res.statusCode = 500;
    return res.json({ error: "Error interno del servidor" });
  }
};
