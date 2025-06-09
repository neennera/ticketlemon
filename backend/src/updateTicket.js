const express = require("express");
const router = express.Router();
const { getConn } = require("./app");

module.exports = router;

// nextTODO : send email to user

router.patch("/buy", async (req, res) => {
  try {
    const conn = await getConn();
    const { ticketID, paymentPlatform, paymentReference } = req.body;
    if (!paymentPlatform || !paymentReference || !ticketID)
      throw new Error("Missing required field");

    // check paymentPlatform ----
    if (!["QRCODE", "DIRECT", "PAYPLAT"].includes(paymentPlatform))
      throw new Error("Invalid paymentPlatform");

    // nextTODO : check payment from something? -> on test should be correct 80%, 20%. I dunno?

    // check ticketID ---------
    const resQuery = await conn.query(
      "SELECT * FROM TICKETS WHERE ticketID = ? AND zone = 'BUY'",
      [ticketID]
    );
    if (resQuery[0].length == 0) throw new Error("Invalid ticketID");

    const ticketUUID = await resQuery[0][0].ticketUUID;

    await conn.query(
      "UPDATE TICKETS_APPLY_BUY SET paymentPlatform = ?, paymentReference = ? WHERE ticketUUID = ? ",
      [paymentPlatform, paymentReference, ticketUUID]
    );
    await conn.query(
      "UPDATE TICKETS SET updateTime = ?, status = 'SUCCESS' WHERE ticketUUID = ?",
      [new Date(), ticketUUID]
    );
    res.send("success");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/free", async (req, res) => {
  try {
    const conn = await getConn();
    const { ticketUUID, status } = req.body;
    if (!ticketUUID || !status) throw new Error("Missing required field");

    // check ticketUUID ---------
    const resQuery = await conn.query(
      "SELECT * FROM TICKETS WHERE ticketUUID = ? AND zone = 'FREE'",
      [ticketUUID]
    );
    if (resQuery[0].length == 0) throw new Error("Invalid ticketUUID");

    if (status === "FAIL") {
      await conn.query(
        "UPDATE TICKETS SET  updateTime = ?,status = 'FAIL' WHERE ticketUUID = ?",
        [new Date(), ticketUUID]
      );
      res.send("success");
      return;
    }

    // get seat number -------
    let seatNumber = "F00";
    const [lastSeat] = await conn.query(
      "SELECT seat FROM TICKETS WHERE zone = 'FREE' ORDER BY seat DESC LIMIT 1"
    );
    if (lastSeat.length > 0) {
      if (lastSeat[0].seat == "F99")
        throw new Error("Free seat has reach limited");
      const lastNum = parseInt(lastSeat[0].seat.replace("F", "")) || 0;
      seatNumber = "F" + String(lastNum + 1).padStart(2, "0");
    }

    // update statue ---------
    await conn.query(
      "UPDATE TICKETS SET status = 'SUCCESS', seat = ? WHERE ticketUUID = ?",
      [seatNumber, ticketUUID]
    );
    res.send("success");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/free/updateFail", async (req, res) => {
  try {
    const conn = await getConn();
    await conn.query(
      "UPDATE TICKETS SET status = 'FAIL' WHERE status = 'PROCESS' AND zone = 'FREE'"
    );
    res.send("success");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
