require("dotenv").config();
const express = require("express");
const app = express();
module.exports = app;

app.use(express.json());

// listen to port 300
if (require.main === module) {
  const PORT = process.env.PORT || 80;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.get("/", (req, res) => {
  res.send("Welcome to TicketLemon! Ya");
});
