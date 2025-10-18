import express from "express";
import pool from "../db/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM destinations LIMIT 6");
    const destinations = result.rows;
    res.render("home", { title: "Vietnam Travel", destinations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

export default router;
