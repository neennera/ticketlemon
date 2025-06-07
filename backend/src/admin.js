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

// query all tickets
router.get("/tickets/all", async (req, res) => {
  try {
    const conn = getConn();
    const result = await conn.query("SELECT * FROM TICKETS");
    if (!result) throw new Error("result is not defined");

    res.json({ data: result[0] });
  } catch (error) {
    res.status(500).json({ error });
  }
});

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

// grant

router.post("ticket/grant/:reserveId", (req, res) => {
  // check admin role from back office
  // grant the ticket for reserveId
  // make an ticket from (ticketbody)
  // send email to userId
  // make FREE_TICKETS_APPLY for reserveId to true
  // if FREE is done in 200 seat -> all of other is reject !
});

router.post("ticket/grant/:reserveId", (req, res) => {
  // check admin role from back office
  // grant the ticket for reserveId
});

module.exports = router;
