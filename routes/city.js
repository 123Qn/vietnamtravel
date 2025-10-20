import express from "express";
import pool from "../db/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const cityRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup: store files in public/uploads/reviews
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/uploads/reviews");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const regionMap = {
  north: "Northern Vietnam",
  central: "Central Vietnam",
  south: "Southern Vietnam",
};

// ---------- GET city details ----------
cityRouter.get("/:region/:city", async (req, res) => {
  try {
    const regionKey = req.params.region.toLowerCase();
    const cityName = req.params.city;
    const regionName = regionMap[regionKey];
    if (!regionName) return res.status(404).send("Region not found");

    const regionData = await pool.query(
      "SELECT * FROM regions WHERE name = $1",
      [regionName]
    );
    if (!regionData.rows.length) return res.status(404).send("Region not found");
    const regionRow = regionData.rows[0];

    const cityData = await pool.query(
      "SELECT * FROM cities WHERE region_id = $1 AND name = $2",
      [regionRow.id, cityName]
    );
    if (!cityData.rows.length) return res.status(404).send("City not found");
    const cityRow = cityData.rows[0];

    const destinationData = await pool.query(
      "SELECT * FROM destinations WHERE city_id = $1",
      [cityRow.id]
    );
    const destinations = destinationData.rows;

    const destinationIds = destinations.map(d => d.id);

    // Highlights
    let highlightData = [];
    if (destinationIds.length) {
      const highlightsRes = await pool.query(
        "SELECT * FROM highlight WHERE destination_id = ANY($1::int[])",
        [destinationIds]
      );
      highlightData = highlightsRes.rows;
    }

    // Experiences
    let experienceData = [];
    if (destinationIds.length) {
      const experiencesRes = await pool.query(
        `SELECT id, destination_id, nameOfReviewer, rate, 
                TO_CHAR(timeSubmit, 'YYYY-MM-DD') AS timeSubmitFormatted,
                img, text 
         FROM experience 
         WHERE destination_id = ANY($1::int[]) 
         ORDER BY timeSubmit DESC`,
        [destinationIds]
      );
      experienceData = experiencesRes.rows;
    }

    // Group highlights & experiences
    const highlightsByDest = {};
    highlightData.forEach(h => {
      if (!highlightsByDest[h.destination_id]) highlightsByDest[h.destination_id] = [];
      highlightsByDest[h.destination_id].push(h);
    });

    const experiencesByDest = {};
    experienceData.forEach(e => {
      if (!experiencesByDest[e.destination_id]) experiencesByDest[e.destination_id] = [];
      experiencesByDest[e.destination_id].push(e);
    });

    // Attach to destinations
    destinations.forEach(d => {
      d.highlights = highlightsByDest[d.id] || [];
      d.experiences = experiencesByDest[d.id] || [];
    });

    res.render("city-detail", {
      region: regionRow,
      city: cityRow,
      destinations,
    });
  } catch (err) {
    console.error("GET /city error:", err);
    res.status(500).send("Server error");
  }
});

// ---------- POST review with images ----------
cityRouter.post(
  "/destination/:id/review",
  upload.array("images", 5), // max 5 images
  async (req, res) => {
    try {
      const destinationId = parseInt(req.params.id);
      const { name, rate, text } = req.body;

      if (!name || !rate || !text) {
        return res.status(400).json({ error: "Missing fields" });
      }

      // Store image paths in DB (for text[] column)
      const imagePaths = req.files?.map(f => `/uploads/reviews/${f.filename}`) || [];

      const insertRes = await pool.query(
        `INSERT INTO experience 
         (destination_id, nameOfReviewer, rate, text, img, timeSubmit)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [destinationId, name, rate, text, imagePaths]
      );

      res.json({ success: true, review: insertRes.rows[0] });
    } catch (err) {
      console.error("POST /review error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default cityRouter;
