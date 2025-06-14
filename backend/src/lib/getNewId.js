const { getConn } = require("../app");
const { v4: uuidv4 } = require("uuid");

const getNewId = async (
  customerSecurityNumber,
  isFree = true,
  seatNumber = ""
) => {
  const conn = await getConn();
  let newCustomerId = "INDB"; // mark if this customer already in system

  // Check Duplicate Seat (Again within DB for secure) -----------
  if (!isFree) {
    const [DupSeat] = await conn.query(
      "SELECT * FROM TICKETS WHERE status != 'FAIL' AND seat = ?",
      [[seatNumber]]
    );
    if (DupSeat.length > 0) throw new Error("Duplicate seatNumber");
  }

  // Check Duplicate Customer -----------
  const [DupCustomer] = await conn.query(
    "SELECT customerId FROM CUSTOMERS WHERE customerSecurityNumber = ?",
    [customerSecurityNumber]
  );

  if (DupCustomer.length > 0) {
    const [CustomerHasTicket] = await conn.query(
      "SELECT * FROM TICKETS WHERE customerId = ? AND status != 'FAIL'",
      [[DupCustomer[0].customerId]]
    );
    if (CustomerHasTicket.length > 0)
      throw new Error("customer already has ticket in system");
    newCustomerId = "INDB_" + DupCustomer[0].customerId;
  } else {
    // new customer
    // Generate new customerId (CUSxxx) -----------
    const [lastCustomer] = await conn.query(
      "SELECT customerId FROM CUSTOMERS ORDER BY customerId DESC LIMIT 1"
    );

    if (lastCustomer.length > 0) {
      const lastNum =
        parseInt(lastCustomer[0].customerId.replace("CUS", "")) || 0;
      newCustomerId = "CUS" + String(lastNum + 1).padStart(5, "0");
    } else {
      newCustomerId = "CUS00001";
    }
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
module.exports = getNewId;
