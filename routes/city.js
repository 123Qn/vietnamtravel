import express from "express";
import pool from "../db/db.js";

const cityRouter = express.Router();
const regionMap = {
  north: "Northern Vietnam",
  central: "Central Vietnam",
  south: "Southern Vietnam",
};

cityRouter.get("/:region/:city", async (req, res) => {
  try {
    const regionKey = req.params.region.toLowerCase(); // e.g., 'north'
    const cityName = req.params.city;                  // e.g., 'Hanoi'
    const regionName = regionMap[regionKey];
    if (!regionName) return res.status(404).send("Region not found");

    // Fetch region
    const regionData = await pool.query(
      "SELECT * FROM regions WHERE name = $1",
      [regionName]
    );
    if (!regionData.rows.length) return res.status(404).send("Region not found");
    const regionRow = regionData.rows[0];

    // Fetch city by name and region
    const cityData = await pool.query(
      "SELECT * FROM cities WHERE region_id = $1 AND name = $2",
      [regionRow.id, cityName]
    );
    if (!cityData.rows.length) return res.status(404).send("City not found");
    const cityRow = cityData.rows[0];

    // Fetch city content (if you have content table)
    const contentData = await pool.query(
      "SELECT * FROM content WHERE city_id = $1",
      [cityRow.id]
    );

    res.render("city-detail", {
      region: regionRow,
      city: cityRow,
      content: contentData.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default cityRouter;
