# TicketLemon Project 🍋

A full-stack web application for concert ticket management with real-time seat reservation.

A learning project for redis, node.js, express !

## Overview

TicketLemon is a comprehensive ticket booking system that allows users to purchase tickets for concerts and events. It features two types of tickets (free and paid), payment processing, and an admin dashboard for ticket management.

## Key Features

- **Ticket Management**: Buying tickets and applying for free tickets
- **Real-time Seat Availability**: Updated in real-time with Redis
- **Admin Dashboard**: For monitor ticket and grant free ticket
- **Ticket Status Tracking**: Check ticket application status

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Express.js, Node.js
- **Database**: MySQL
- **Caching & Real-time**: Redis
- **Containerization**: Docker, Docker Compose

## Redis Implementation Highlights

Redis is used for several critical features:

1. **Real-time Seat Availability**:

   - Seats are represented as a bitmap in Redis (`backend\src\lib\getCacheBuySeat.js`)
   - Prevents double-booking by providing atomic operations
   - Improves performance by avoiding frequent database queries

2. **Reservation Timeout**:

   - Tickets in "PROCESS" status are given a 5-minute window using Redis key expiration (`backend\src\applyTicket.js`)
   - After expiration, the ticket status is automatically updated to "FAIL"
   - Ensures seats don't remain locked indefinitely

3. **WebSocket Integration** (IN FUTURE):
   - Redis powers the real-time seat updates sent via WebSockets
   - All clients see seat availability changes immediately

## Express.js Implementation Highlights

The Express backend is structured around modular routes:

1. **API Organization**:

   - `/admin/*` - Admin-only routes for ticket management
   - `/applyTicket/*` - Endpoints for ticket reservations
   - `/updateTicket/*` - Endpoints for payment processing
   - `/ticket/:id` - Ticket lookup by ID
   - `/buyseatleft` - Real-time seat availability

2. **Middleware Usage**:

   - CORS configuration for frontend communication
   - JSON body parsing
   - Error handling middleware

3. **Database Connectivity**:
   - Connection pooling with MySQL
   - Prepared statements for security

## Getting Started

## Project Structure

```
ticketlemon/
├── backend/              # Express backend
│   ├── src/
│   │   ├── app.js        # Main Express server
│   │   ├── admin.js      # Admin routes
│   │   ├── applyTicket.js# Ticket reservation endpoints
│   │   ├── updateTicket.js# Payment and status updates
│   │   ├── initDB.js     # Database initialization
│   │   └── lib/          # Utilities
│   │       ├── getCacheBuySeat.js # Redis cache utilities
│   │       └── getNewId.js # ID generation
│   ├── docker-compose.yml # Docker setup with MySQL, Redis, etc.
│   ├── Dockerfile        # Node.js app container definition
│   └── .env              # Environment configuration
│
└── frontend/             # Next.js frontend
    ├── src/
    │   └── app/
    │       ├── admin/    # Admin dashboard
    │       ├── buy/      # Ticket purchase UI
    │       ├── free/     # Free ticket application
    │       ├── payment/  # Payment processing
    │       └── status/   # Ticket status checking
    └── package.json
```

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose

### Backend Setup

```bash
cd backend
# Create .env file with database credentials
# Start the Docker containers
docker-compose up -d
# Install dependencies
npm install
# Start the development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
# Create .env file with API URL
npm install
npm run dev
```

Visit http://localhost:3000 to access the application.

## Database Schema

The application uses four main tables:

- `CUSTOMERS` - User information
- `TICKETS` - Core ticket data
- `TICKETS_APPLY_BUY` - Paid ticket data
- `TICKETS_APPLY_FREE` - Free ticket application data

## Future Improvements

- Implement authentication and authorization
- Add ticket validation QR codes
- Enhance admin dashboard with analytics
- Implement more robust payment gateway integration
