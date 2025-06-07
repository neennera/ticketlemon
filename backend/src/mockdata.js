module.exports = {
  customers: [
    {
      customerId: "CUS00001",
      customerName: "Alice Smith",
      customerAge: 28,
      customerGender: "Female",
      customerSecurityNumber: "12345678",
    },
    {
      customerId: "CUS00002",
      customerName: "Bob Johnson",
      customerAge: 35,
      customerGender: "Male",
      customerSecurityNumber: "55555666",
    },
    {
      customerId: "CUS00003",
      customerName: "Charlie Lee",
      customerAge: 22,
      customerGender: "LGBT+",
      customerSecurityNumber: "77777888",
    },
  ],
  tickets: [
    {
      ticketUUID: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      ticketId: "TF00001",
      zone: "FREE",
      seat: "F00",
      status: "PROCESS",
      customerId: "CUS00001",
      updateTime: "2025-06-07 12:00:00",
    },
    {
      ticketUUID: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      ticketId: "TF00002",
      zone: "FREE",
      seat: "F01",
      status: "SUCCESS",
      customerId: "CUS00002",
      updateTime: "2025-06-07 12:10:00",
    },
    {
      ticketUUID: "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      ticketId: "TB00003",
      zone: "BUY",
      seat: "B01",
      status: "SUCCESS",
      customerId: "CUS00003",
      updateTime: "2025-06-07 12:10:00",
    },
  ],
  ticketsApplyBuy: [
    {
      ticketUUID: "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
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
    {
      ticketUUID: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      Q1: "Why do you want a free ticket? 2",
      Q2: "Have you attended before? 2",
      Q3: "Any comments? 2",
    },
  ],
};
