const express = require("express");
const router = express.Router();
const { getConn, getRedisConn } = require("./app");
const getCacheBuySeat = require("./lib/getCacheBuySeat");
const getNewId = require("./lib/getNewId");
module.exports = router;

// -------------- BUY TICKET ---------------
router.post("/buy", async (req, res) => {
  try {
    // redis : quickly mark seatReserve
    // redis has 5 minutes reserve to complete payment -> if not we must mark ticket.status to FAIL

    const conn = await getConn();
    const redisConn = await getRedisConn();

    const { customer, seatNumber } = req.body;
    if (
      !customer.customerName ||
      !customer.customerAge ||
      !customer.customerGender ||
      !customer.customerSecurityNumber ||
      !seatNumber
    )
      throw new Error("Missing required field");

    // check seat number pattern ---------
    const match = seatNumber.match(/^B(\d{2})$/);
    if (!match || match[1] < "01" || match[1] > "20")
      throw new Error("Invalid Seat Number");

    // REDIS : check if seat number avaliable with redis -----
    let cacheBuySeat = await getCacheBuySeat();
    const buySeat = JSON.parse(cacheBuySeat);
    const intSeatNumber = parseInt(seatNumber.replace("B", ""));
    if (buySeat[intSeatNumber - 1])
      throw new Error("this Seat Number already booked");

    // get new Id --------
    let { ticketUUID, ticketId, customerId } = await getNewId(
      customer.customerSecurityNumber,
      false,
      seatNumber
    );

    // INSERT DATA TO DB ----------

    if (!customerId.includes("INDB"))
      await conn.query(
        "INSERT INTO CUSTOMERS (customerId, customerName, customerAge, customerGender,customerSecurityNumber) VALUES (?, ?, ?, ?,?)",
        [
          customerId,
          customer.customerName,
          customer.customerAge,
          customer.customerGender,
          customer.customerSecurityNumber,
        ]
      );
    else customerId = customerId.replace("INDB_", "");

    await conn.query(
      "INSERT INTO TICKETS (ticketUUID,ticketId,zone,seat,status,customerId,updateTime) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        ticketUUID,
        ticketId,
        "BUY",
        seatNumber,
        "PROCESS",
        customerId,
        new Date(),
      ]
    );
    await conn.query(
      "INSERT INTO TICKETS_APPLY_BUY (ticketUUID, paymentPlatform,paymentReference) VALUES (?, ?, ?)",
      [ticketUUID, "NONE", null]
    );

    // REDIS : update seatBitMap & schedule 15 minute timeout
    buySeat[intSeatNumber - 1] = true;
    cacheBuySeat = JSON.stringify(buySeat);
    redisConn.set("cacheBuySeat", cacheBuySeat);

    await redisConn.set(`reservation:${ticketUUID}`, "PROCESS", {
      EX: 300, // lifetime = 5 minutes in seconds
    });

    res.json({ data: ticketId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------- FREE TICKET ---------------
router.post("/free", async (req, res) => {
  try {
    // redisTODO (no need to implement now): create new reserveId, then remember the questions
    // does it really need to be done
    const conn = await getConn();
    const { customer, questions } = req.body;

    if (
      !customer.customerName ||
      !customer.customerAge ||
      !customer.customerGender ||
      !customer.customerSecurityNumber ||
      !questions.Q1 ||
      !questions.Q2 ||
      !questions.Q3
    )
      throw new Error("Missing required field");

    // get new Id --------
    const { ticketUUID, ticketId, customerId } = await getNewId(
      customer.customerSecurityNumber
    );

    // INSERT DATA TO DB ----------
    if (customerId.includes("INDB"))
      await conn.query(
        "INSERT INTO CUSTOMERS (customerId, customerName, customerAge, customerGender,customerSecurityNumber) VALUES (?, ?, ?, ?,?)",
        [
          customerId,
          customer.customerName,
          customer.customerAge,
          customer.customerGender,
          customer.customerSecurityNumber,
        ]
      );
    await conn.query(
      "INSERT INTO TICKETS (ticketUUID,ticketId,zone,seat,status,customerId,updateTime) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [ticketUUID, ticketId, "FREE", "F00", "PROCESS", customerId, new Date()]
    );
    await conn.query(
      "INSERT INTO TICKETS_APPLY_FREE (ticketUUID, Q1, Q2, Q3) VALUES (?, ?, ?, ?)",
      [ticketUUID, questions.Q1, questions.Q2, questions.Q3]
    );

    res.json({ data: ticketId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// redis scheduler timeout for buy ticket reserved seat
// It has built-in expiration functionality & fast for realtime
async function checkExpiredReservations() {
  const conn = await getConn();
  const redisConn = await getRedisConn();
  // Get all processing tickets
  const [pendingTickets] = await conn.query(
    "SELECT ticketUUID, seat FROM TICKETS WHERE status = 'PROCESS' AND zone = 'BUY'"
  );

  for (const ticket of pendingTickets) {
    // Check if reservation still exists in Redis
    const status = await redisConn.get(`reservation:${ticket.ticketUUID}`);

    // if not = the reservation is expired
    if (!status) {
      // Update ticket status
      await conn.query(
        "UPDATE TICKETS SET status = 'FAIL', updateTime = ? WHERE ticketUUID = ?",
        [new Date(), ticket.ticketUUID]
      );

      // Free up the seat in Redis
      let cacheBuySeat = await redisConn.get("cacheBuySeat");
      if (cacheBuySeat) {
        const seatBitMap = JSON.parse(cacheBuySeat);
        const seatNum = parseInt(ticket.seat.replace("B", ""));
        seatBitMap[seatNum - 1] = false;
        await redisConn.set("cacheBuySeat", JSON.stringify(seatBitMap));
      }
    }
  }
}
// check every minute
setInterval(checkExpiredReservations, 60000);
