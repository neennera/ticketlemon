require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2/promise");

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

module.exports = { app, getConn: () => conn };

// admin routes
const adminRoute = require("./admin");
app.use("/admin", adminRoute);

// initDB routes
const initDBRoute = require("./initDB");
app.use("/initDB", initDBRoute);

app.get("/", (req, res) => {
  res.send("Welcome to TicketLemon! Ya");
});
