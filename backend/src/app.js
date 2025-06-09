require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2/promise");

// install cors for cross origin resource sharing to frontend
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
let conn = null;

// ------------ init function ------------
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: process.env.DBhost || "localhost",
    user: process.env.DBuser || "root",
    password: process.env.DBpassword || "root",
    database: process.env.DBname || "ticketlemon",
  });
  console.log(`init connecttion to mySQL success`);
};

// ------------ START APP ------------
if (require.main === module) {
  const PORT = process.env.PORT || 80;
  app.listen(PORT, async () => {
    await initMySQL();
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = {
  app,
  getConn: () => {
    if (!conn) {
      return res.status(500).json({ error: "Database not connected" });
    }
    return conn;
  },
};

// admin routes
const adminRoute = require("./admin");
app.use("/admin", adminRoute);

// initDB routes
const initDBRoute = require("./initDB");
app.use("/initDB", initDBRoute);

// applyTicket routes
const applyTicketRoute = require("./applyTicket");
app.use("/applyTicket", applyTicketRoute);

// updateTicket routes
const updateTicketRoute = require("./updateTicket");
app.use("/updateTicket", updateTicketRoute);

app.get("/", (req, res) => {
  res.send("Welcome to TicketLemon!");
});

app.get("/ticket/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    const result1 = await conn.query(
      "SELECT * FROM TICKETS WHERE TICKETS.ticketId = ?",
      [ticketId]
    );

    if (!result1) throw new Error("result is not defined");
    if (result1[0][0].zone === "FREE") {
      const result = await conn.query(
        "SELECT * FROM TICKETS JOIN TICKETS_APPLY_FREE ON TICKETS.ticketUUID = TICKETS_APPLY_FREE.ticketUUID WHERE TICKETS.ticketId = ?",
        [ticketId]
      );
      res.json({ data: result[0] });
    } else {
      res.json({ data: result1[0] });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.use((req, res, next) => {
  res.status(404).send("404 route not found");
});
