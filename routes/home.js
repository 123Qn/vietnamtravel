import express from "express";
import pool from "../db/db.js";

const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM destinations LIMIT 6");
    const eventResult = await pool.query("SELECT * FROM events LIMIT 6");
    const events = eventResult.rows;
    const destinations = result.rows;
    res.render("home", { title: "Vietnam Travel", destinations, events });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

export default homeRouter;
