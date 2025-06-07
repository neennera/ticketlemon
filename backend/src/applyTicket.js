// TICKETS_APPLY_FREE {reserveId, q1, q2, q3, status (WAIT, SUCCESS, REJECT)}
// To get ticket
// buy : select seat & zone -> the zone is mark (15 minute) -> user go to payment page -> buy that ticket
// remember in both redis & apply ticket
// FREE : select FREE plan -> answer the question -> new item in FREE_TICKETS_APPLY, wait for admin to grant

// -------------- BUY TICKET ---------------

app.post("ticket/apply/buy", (req, res) => {
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

app.post("ticket/buy/:paymentReferenceId", (req, res) => {
  // check payment from something? -> on test should be correct 80%, 20%. I dunno?
  // if true -> make an ticket from (ticketbody)
});

// -------------- FREE TICKET ---------------

app.post("ticket/apply/free", (req, res) => {
  // create new reserveId, then remember the questions
  // create TICKETS_APPLY_FREE {reserveId, q1, q2, q3, status (WAIT)}
});
