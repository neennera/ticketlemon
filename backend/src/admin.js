const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin dashboard");
});

// query all tickets
router.get("/tickets/all", (req, res) => {
  res.send("All ticket");
});

router.get("/tickets/success", (req, res) => {
  res.send("SUCCESS ticket");
});

router.get("/tickets/apply", (req, res) => {
  res.send("FREE apply tickets");
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
