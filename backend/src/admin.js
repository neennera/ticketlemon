const express = require("express");
const router = express.Router();
const { getConn } = require("./app");

router.get("/", async (req, res) => {
  try {
    const conn = getConn();
    const result = await conn.query("SELECT * FROM TICKETSs");
    if (!result) throw new Error("result is not defined");

    res.json({ data: result[0] });
  } catch (error) {
    if (!result) res.status(500).json({ error });
  }
});

// ---------- GET TICKETS ----------
router.get("/tickets", async (req, res) => {
  try {
    const conn = getConn();

    // using pagify for all tickets
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination info
    const [countRows] = await conn.query(
      "SELECT COUNT(*) as count FROM TICKETS"
    );
    const total = countRows[0].count;

    const result = await conn.query("SELECT * FROM TICKETS  LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    if (!result) throw new Error("result is not defined");

    res.json({ data: result[0] });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// ---------- GET TICKETS BY STATUS ----------
router.get("/tickets/status/:status", async (req, res) => {
  try {
    const conn = getConn();
    const { status } = req.params;
    if (!["PROCESS", "SUCCESS", "FAIL"].includes(status))
      throw new Error("status is not valid enum");

    const result = await conn.query("SELECT * FROM TICKETS WHERE status = ?", [
      status,
    ]);
    if (!result) throw new Error("result is not defined");

    res.json({ data: result[0] });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

// login admin & auth

module.exports = router;
