const express = require("express");
const router = express.Router();
const mockdata = require("./mockdata");

const { getConn } = require("./app");
module.exports = router;

// TODO : auth admin token

router.post("/reset", async (req, res) => {
  const conn = getConn();
  // drop existing table
  await conn.query("DROP TABLE IF EXISTS TICKETS_APPLY_BUY");
  await conn.query("DROP TABLE IF EXISTS TICKETS_APPLY_FREE");
  await conn.query("DROP TABLE IF EXISTS TICKETS");
  await conn.query("DROP TABLE IF EXISTS CUSTOMERS");

  // Create CUSTOMERS table
  await conn.query(`
      CREATE TABLE CUSTOMERS (
        customerId CHAR(8) PRIMARY KEY,
        customerName VARCHAR(255),
        customerAge INT,
        customerGender ENUM('Male', 'Female', 'LGBT+'),
        customerSecurityNumber VARCHAR(8) UNIQUE
      )
    `);

  // Create TICKETS table
  await conn.query(`
      CREATE TABLE TICKETS (
        ticketUUID CHAR(36) PRIMARY KEY,
        ticketId VARCHAR(7),
        zone ENUM('FREE','BUY'),
        seat CHAR(3),
        status ENUM('PROCESS', 'SUCCESS', 'FAIL'),
        customerId CHAR(8),
        updateTime DATETIME,
        FOREIGN KEY (customerId) REFERENCES CUSTOMERS(customerId)
      )
    `);

  // Create TICKETS_APPLY_BUY table
  await conn.query(`
      CREATE TABLE TICKETS_APPLY_BUY (
        ticketUUID CHAR(36),
        paymentPlatform ENUM('QRCODE', 'DIRECT', 'PAYPLAT', 'NONE'),
        paymentReference VARCHAR(255),
        PRIMARY KEY (ticketUUID),
        FOREIGN KEY (ticketUUID) REFERENCES TICKETS(ticketUUID)
      )
    `);

  // Create TICKETS_APPLY_FREE table
  await conn.query(`
      CREATE TABLE TICKETS_APPLY_FREE (
        ticketUUID CHAR(36),
        Q1 TEXT,
        Q2 TEXT,
        Q3 TEXT,
        PRIMARY KEY (ticketUUID),
        FOREIGN KEY (ticketUUID) REFERENCES TICKETS(ticketUUID)
      )
    `);

  res.send("SUCCESS reset db");
});

// API to insert mock data into the database
router.post("/mockdata", async (req, res) => {
  const conn = getConn();
  if (!conn) {
    return res.status(500).json({ error: "Database not connected" });
  }
  try {
    // Insert customers
    for (const c of mockdata.customers) {
      await conn.query(
        "INSERT INTO CUSTOMERS (customerId, customerName, customerAge, customerGender, customerSecurityNumber) VALUES (?, ?, ?, ?,?)",
        [
          c.customerId,
          c.customerName,
          c.customerAge,
          c.customerGender,
          c.customerSecurityNumber,
        ]
      );
    }
    // Insert tickets
    for (const t of mockdata.tickets) {
      await conn.query(
        "INSERT INTO TICKETS (ticketUUID, ticketId, zone, seat, status, customerId, updateTime) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          t.ticketUUID,
          t.ticketId,
          t.zone,
          t.seat,
          t.status,
          t.customerId,
          t.updateTime,
        ]
      );
    }
    // Insert ticketsApplyBuy
    for (const b of mockdata.ticketsApplyBuy) {
      await conn.query(
        "INSERT INTO TICKETS_APPLY_BUY (ticketUUID, paymentPlatform, paymentReference) VALUES (?, ?, ?)",
        [b.ticketUUID, b.paymentPlatform, b.paymentReference]
      );
    }
    // Insert ticketsApplyFree
    for (const f of mockdata.ticketsApplyFree) {
      await conn.query(
        "INSERT INTO TICKETS_APPLY_FREE (ticketUUID, Q1, Q2, Q3) VALUES (?, ?, ?, ?)",
        [f.ticketUUID, f.Q1, f.Q2, f.Q3]
      );
    }
    res.json({ message: "Mock data inserted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
