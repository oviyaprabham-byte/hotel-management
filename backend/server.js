const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + extension);
  },
});

const upload = multer({
  storage: storage,
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/api/hotels", async (req, res) => {
  try {
    const { title, minPrice, maxPrice, limit, offset } = req.query;
    let query = "SELECT * FROM hotels";
    let countQuery = "SELECT COUNT(*) FROM hotels";
    let values = [];
    let countValues = [];
    let conditions = [];

    if (title) {
      conditions.push(`title ILIKE $${conditions.length + 1}`);
      values.push(`%${title}%`);
      countValues.push(`%${title}%`);
    }

    if (minPrice && maxPrice) {
      conditions.push(
        `price BETWEEN $${conditions.length + 1} AND $${conditions.length + 2}`,
      );

      values.push(minPrice, maxPrice);
      countValues.push(minPrice, maxPrice);
    }

    if (conditions.length > 0) {
      const whereClause = " WHERE " + conditions.join(" AND ");
      query += whereClause;
      countQuery += whereClause;
    }

    const currentLimit = Number(limit) || 10;
    const currentOffset = Number(offset) || 0;

    query += ` LIMIT $${values.length + 1}`;
    values.push(currentLimit);

    query += ` OFFSET $${values.length + 1}`;
    values.push(currentOffset);
    const result = await pool.query(query, values);
    const countResult = await pool.query(countQuery, countValues);
    const totalHotels = Number(countResult.rows[0].count);

    res.json({
      hotels: result.rows,
      totalHotels: totalHotels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.get("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.post("/api/hotels", upload.single("image"), async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO hotels
        (image, title, description, latitude, longitude, price)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [image, title, description, latitude, longitude, price],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.put("/api/hotels/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, latitude, longitude, price } = req.body;

    const image = req.file ? req.file.filename : null;

    const result = await pool.query(
      `UPDATE hotels
         SET image = COALESCE($1, image),
             title = $2,
             description = $3,
             latitude = $4,
             longitude = $5,
             price = $6
         WHERE id = $7
         RETURNING *`,
      [image, title, description, latitude, longitude, price, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.delete("/api/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM hotels WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json({
      message: "Hotel deleted successfully",
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
