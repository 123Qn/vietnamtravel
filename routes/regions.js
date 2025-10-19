import express from "express";
import pool from "../db/db.js";

const regionRouter = express.Router();

const regionMap = {
  north: "Northern Vietnam",
  central: "Central Vietnam",
  south: "Southern Vietnam",
};

regionRouter.get("/:region", async (req, res) => {
  try {
    const key = req.params.region.toLowerCase();
    const regionName = regionMap[key];
    if (!regionName) return res.status(404).send("Region not found");

    const regionData = await pool.query(
      "SELECT * FROM regions WHERE name = $1",
      [regionName]
    );
    if (!regionData.rows.length) return res.status(404).send("Region not found");

    const regionRow = regionData.rows[0];
    const cities = await pool.query(
      "SELECT * FROM cities WHERE region_id = $1 ORDER BY name ASC",
      [regionRow.id]
    );

    // Pass regionKey to EJS
    res.render("dest-landing", {
      title: "Citys in " + regionName,
      region: regionRow,
      cities: cities.rows,
      regionMap: regionMap, // <--- Add this line
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default regionRouter;
