const express = require("express");
const router = express.Router();
const { getConn } = require("./app");
const { v4: uuidv4 } = require("uuid");

module.exports = router;

// buy : select seat & zone -> the zone is mark (15 minute) -> user go to payment page -> buy that ticket
// remember in both redis & apply ticket
// FREE : select FREE plan -> answer the question -> new item in FREE_TICKETS_APPLY, wait for admin to grant

// redis has 15 minutes reserve, 10 minute for user to buy in frontend & 5 for backup

// TICKETS
// {ticketId, type (FREE, BUY), seat}
// FREE ticket need to be answer & wait for admin to grant
// PATD ticket can be buy directly ! assume there a payment gateway right away

// TRANSACTION
// {transactionId, datetime, paymentReferenceId, payment}

// -------------- BUY TICKET ---------------
router.post("/buy", async (req, res) => {
  try {
    // redisTODO (no need to implement now): add seatReserve for buy
    const conn = await getConn();

    const { customer, seatNumber } = req.body;
    if (
      !customer.customerName ||
      !customer.customerAge ||
      !customer.customerGender ||
      !customer.customerSecurityNumber ||
      !seatNumber
    )
      throw new Error("Missing required field");

    // check seat number ---------
    const match = seatNumber.match(/^B(\d{2})$/);
    if (!match || match[1] < "01" || match[1] > "20")
      throw new Error("Invalid Seat Number");

    // get new Id --------
    const { ticketUUID, ticketId, customerId } = await getNewId(
      customer.customerSecurityNumber,
      false,
      seatNumber
    );

    // INSERT DATA TO DB ----------
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

    res.json({ data: ticketId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------- FREE TICKET ---------------
router.post("/free", async (req, res) => {
  try {
    // redisTODO (no need to implement now): create new reserveId, then remember the questions
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

const getNewId = async (
  customerSecurityNumber,
  isFree = true,
  seatNumber = ""
) => {
  const conn = await getConn();

  // Check Duplicate Seat -----------
  if (!isFree) {
    const [DupSeat] = await conn.query("SELECT * FROM TICKETS WHERE seat = ?", [
      [seatNumber],
    ]);
    if (DupSeat.length > 0) throw new Error("Duplicate seatNumber");
  }

  // Check Duplicate Customer -----------
  const [DupCustomer] = await conn.query(
    "SELECT customerId FROM CUSTOMERS WHERE customerSecurityNumber = ?",
    [customerSecurityNumber]
  );

  if (DupCustomer.length > 0)
    throw new Error("Duplicate customerSecurityNumber");

  // Generate new customerId (CUSxxx) -----------
  const [lastCustomer] = await conn.query(
    "SELECT customerId FROM CUSTOMERS ORDER BY customerId DESC LIMIT 1"
  );
  let newCustomerId = "CUS001";
  if (lastCustomer.length > 0) {
    const lastNum =
      parseInt(lastCustomer[0].customerId.replace("CUS", "")) || 0;
    newCustomerId = "CUS" + String(lastNum + 1).padStart(4, "0");
  }

  // Generate new ticketId (TFxxx) -----------
  const startTextQuery = isFree ? "TF%" : "TB%";
  const startText = isFree ? "TF" : "TB";
  const query = `SELECT ticketId FROM TICKETS WHERE ticketId LIKE ? ORDER BY ticketId DESC LIMIT 1`;
  const [lastTicket] = await conn.query(query, [startTextQuery]);
  let newTicketId = startText + "001";
  if (lastTicket.length > 0) {
    const lastNum =
      parseInt(lastTicket[0].ticketId.replace(startText, "")) || 0;
    newTicketId = startText + String(lastNum + 1).padStart(5, "0");
  }

  // Generate unique ticketUUID
  let newTicketUUID;
  let isUnique = false;
  while (!isUnique) {
    newTicketUUID = uuidv4();
    const [exists] = await conn.query(
      "SELECT ticketUUID FROM TICKETS WHERE ticketUUID = ?",
      [newTicketUUID]
    );
    if (exists.length === 0) isUnique = true;
  }

  return {
    ticketUUID: newTicketUUID,
    ticketId: newTicketId,
    customerId: newCustomerId,
  };
};
