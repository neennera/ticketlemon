module.exports = {
  customers: [
    {
      customerId: "CUS00001",
      customerName: "Alice Smith",
      customerAge: 28,
      customerGender: "Female",
    },
    {
      customerId: "CUS00003",
      customerName: "Bob Johnson",
      customerAge: 35,
      customerGender: "Male",
    },
    {
      customerId: "CUS00003",
      customerName: "Charlie Lee",
      customerAge: 22,
      customerGender: "LGBT+",
    },
  ],
  tickets: [
    {
      ticketUUID: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      ticketId: "TICKET001",
      zone: "FREE",
      seat: "A01",
      status: "PROCESS",
      customerId: "11111111-1111-1111-1111-111111111111",
      updateTime: "2025-06-07 12:00:00",
    },
    {
      ticketUUID: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      ticketId: "TICKET002",
      zone: "BUY",
      seat: "B01",
      status: "SUCCESS",
      customerId: "22222222-2222-2222-2222-222222222222",
      updateTime: "2025-06-07 12:10:00",
    },
  ],
  ticketsApplyBuy: [
    {
      ticketUUID: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      paymentPlatform: "QRCODE",
      paymentReference: "PAY123456",
    },
  ],
  ticketsApplyFree: [
    {
      ticketUUID: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      Q1: "Why do you want a free ticket?",
      Q2: "Have you attended before?",
      Q3: "Any comments?",
    },
  ],
};
