const express = require("express");
const router = express.Router();
const { getConn } = require("./app");
const { v4: uuidv4 } = require("uuid");

module.exports = router;

// buy : select seat & zone -> the zone is mark (15 minute) -> user go to payment page -> buy that ticket
// remember in both redis & apply ticket
// FREE : select FREE plan -> answer the question -> new item in FREE_TICKETS_APPLY, wait for admin to grant

// -------------- BUY TICKET ---------------
router.post("ticket/apply/buy", (req, res) => {
  // create new reserveId with seat & zone -> show the reserveId back for the reference
  // TICKETS_APPLY_BUY {reserveId, seat, status (WAIT, SUCCESS, REJECT), paymentReferenceId (null, string)}
});

// redis has 15 minutes reserve, 10 minute for user to buy in frontend & 5 for backup

// TICKETS
// {ticketId, type (FREE, BUY), seat}
// FREE ticket need to be answer & wait for admin to grant
// PATD ticket can be buy directly ! assume there a payment gateway right away

// TRANSACTION
// {transactionId, datetime, paymentReferenceId, payment}

router.post("ticket/buy/:paymentReferenceId", (req, res) => {
  // check payment from something? -> on test should be correct 80%, 20%. I dunno?
  // if true -> make an ticket from (ticketbody)
});

// -------------- FREE TICKET ---------------

router.post("/free", async (req, res) => {
  try {
    // redis TODO (no need to implement now): create new reserveId, then remember the questions
    const conn = await getConn();
    const { customer, questions } = req.body;
    const { ticketUUID, ticketId, customerId } = await getNewId();

    // INSERT DATA TO DB ----------
    await conn.query(
      "INSERT INTO CUSTOMERS (customerId, customerName, customerAge, customerGender) VALUES (?, ?, ?, ?)",
      [
        customerId,
        customer.customerName,
        customer.customerAge,
        customer.customerGender,
      ]
    );
    await conn.query(
      "INSERT INTO TICKETS (ticketUUID,ticketId,zone,seat,status,customerId,updateTime) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        ticketUUID,
        ticketId,
        "FREE",
        "F00",
        "PROCESS",
        customer.customerId,
        new Date(),
      ]
    );
    await conn.query(
      "INSERT INTO TICKETS_APPLY_FREE (ticketUUID, Q1, Q2, Q3) VALUES (?, ?, ?, ?)",
      [ticketUUID, questions.Q1, questions.Q2, questions.Q3]
    );
    res.json("success");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getNewId = async () => {
  const conn = await getConn();

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
  const [lastTicket] = await conn.query(
    "SELECT ticketId FROM TICKETS WHERE ticketId LIKE 'TF%' ORDER BY ticketId DESC LIMIT 1"
  );
  let newTicketId = "TF001";
  if (lastTicket.length > 0) {
    const lastNum = parseInt(lastTicket[0].ticketId.replace("TF", "")) || 0;
    newTicketId = "TF" + String(lastNum + 1).padStart(3, "0");
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
