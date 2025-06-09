require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const redis = require("redis");

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
let redisConn = null;

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
const initRedis = async () => {
  redisConn = redis.createClient();
  redisConn.on("error", (err) => console.log("Redis Client Error", err));
  await redisConn.connect();
};

// ------------ START APP ------------
if (require.main === module) {
  const PORT = process.env.PORT || 80;
  app.listen(PORT, async () => {
    await initMySQL();
    await initRedis();
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
  getRedisConn: () => {
    if (!redisConn) {
      return res.status(500).json({ error: "Database not connected" });
    }
    return redisConn;
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
const getCacheBuySeat = require("./lib/getCacheBuySeat");
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

    if (!result1 || !Array.isArray(result1[0]) || result1[0].length === 0)
      throw new Error("result is not defined");
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

app.get("/buyseatleft", async (req, res) => {
  try {
    const seatedBuy = await getCacheBuySeat();

    res.json({ data: seatedBuy });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.use((req, res, next) => {
  res.status(404).send("404 route not found");
});
