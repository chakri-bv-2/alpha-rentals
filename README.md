cd backend  && mvn spring-boot:run          # http://localhost:8080  (Swagger at /swagger-ui.html)
cd frontend && npm install && npm run dev    # http://localhost:5173

# 🚗 DriveEasy — Car Rental Management System

A full-stack car rental platform built to the spec in [requirements.md](requirements.md).
Customers search & book self-drive cars, owners list vehicles, and admins manage the
platform. Built with **Spring Boot 3 + Java 17 + MySQL** and **React + TypeScript + Tailwind**.

> This is a **runnable MVP**. Payments, email notifications, and GST invoices are
> **simulated** (mocked) so the app runs with zero external accounts/keys. See
> [Swapping in real integrations](#swapping-in-real-integrations) to make them live.

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, React Router, Axios, Vite |
| Backend  | Java 17, Spring Boot 3.2, Spring Security, JWT, Spring Data JPA, Hibernate |
| Database | MySQL (prod) / H2 in-memory (default dev profile) |
| Docs     | Swagger / OpenAPI |

---

## Project Structure

```
Car/
├── backend/          Spring Boot REST API
│   └── src/main/java/com/carrental/
│       ├── domain/       JPA entities (User, Vehicle, Booking, Review)
│       ├── repository/   Spring Data repositories
│       ├── security/     JWT filter, SecurityConfig, UserDetails
│       ├── service/      Business logic + mock Payment/Email
│       ├── web/          REST controllers + DTOs + error handling
│       └── config/       Seed data
└── frontend/         React + TS + Tailwind SPA
    └── src/
        ├── pages/        Home, Login, Register, VehicleDetails, Booking, MyBookings, Admin
        ├── components/   Navbar, VehicleCard, ProtectedRoute
        ├── api.ts        Axios client (JWT interceptor)
        └── auth.tsx      Auth context
```

---

## Prerequisites

- **Java 17+** and **Maven 3.9+**
- **Node 18+** and **npm**
- **MySQL** — *optional* (the default `dev` profile uses in-memory H2)

---

## Running the App

### 1. Backend

```bash
cd backend
mvn spring-boot:run
```

API starts on **http://localhost:8080**.

- By default it uses an **in-memory H2 database** (`dev` profile) — no setup needed.
  Data resets on restart. H2 console: http://localhost:8080/h2-console
  (JDBC URL `jdbc:h2:mem:carrental`, user `sa`, no password).
- Swagger UI: **http://localhost:8080/swagger-ui.html**

**To use MySQL instead**, run with the `mysql` profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

Configure via environment variables (defaults shown):
`DB_HOST=localhost DB_PORT=3306 DB_NAME=car_rental DB_USER=root DB_PASSWORD=root`.
The schema is auto-created by Hibernate.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on **http://localhost:5173** and talks to the backend at
`http://localhost:8080/api` (override with `VITE_API_URL` in `frontend/.env`).

---

## Seeded Demo Accounts

The backend seeds these on first start:

| Role  | Email                   | Password   |
|-------|-------------------------|------------|
| Admin | `admin@alpharentals.in` | `admin123` |
| User  | `user@alpharentals.in`  | `user123`  |
| Owner | `owner@alpharentals.in` | `owner123` |

Nine approved vehicles are seeded — Swift, Baleno, WagonR, Dzire, Honda City, Ertiga,
Innova Crysta, Creta, and Venue — each with a generated image under
`frontend/public/cars/`.

---

## Requirements Coverage

| Module | Requirements | Status |
|--------|--------------|--------|
| User Management | FR-01/02/03 — register, JWT login, roles | ✅ (Google auth & uploads stubbed) |
| Vehicle Search & Filters | FR-04/05 | ✅ city, category, fuel, transmission, seats, price |
| Vehicle Details | FR-06 | ✅ |
| Booking | FR-07/08/09 — create, validate dates/overlap, confirm + notify | ✅ |
| Booking Management | FR-10/11 — history, cancel + refund, invoice | ✅ (invoice via print) |
| Vehicle Listing | FR-12/13 — owners add/edit | ✅ |
| Reviews & Ratings | FR-14/15 | ✅ |
| Newsletter | FR-16 | ✅ |
| Admin | FR-17/18/19 — users, vehicle approval, bookings | ✅ |
| India features | License (5.1), UPI methods (5.3), GST 18% (5.4), deposit (5.5), 8 cities (5.6) | ✅ (payment/license verify simulated) |
| Non-functional | JWT, BCrypt, RBAC, CORS, responsive UI | ✅ |

### Intentionally stubbed (per "mock integrations" scope)
- **Payments** — `PaymentService` simulates a charge/refund and returns a reference.
- **Email** — `EmailService` logs notifications instead of sending.
- **GST invoice** — booking stores the GST breakdown; the UI "Download Invoice"
  button uses browser print. No PDF generation yet.
- **Google OAuth, file uploads (license/photos)** — fields exist on the model; UI/flow not wired.

---

## Key API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | – | Register |
| POST | `/api/auth/login` | – | Login (returns JWT) |
| GET  | `/api/vehicles` | – | Search + filter |
| GET  | `/api/vehicles/{id}` | – | Vehicle details |
| POST | `/api/vehicles` | OWNER | List a vehicle |
| POST | `/api/bookings` | USER | Create + pay + confirm |
| GET  | `/api/bookings/mine` | USER | Booking history |
| POST | `/api/bookings/{id}/cancel` | USER | Cancel + refund |
| GET/POST | `/api/vehicles/{id}/reviews` | – / USER | Reviews |
| `/api/admin/**` | | ADMIN | User / vehicle / booking management |

---

## Swapping in Real Integrations

| Mock | Replace with |
|------|--------------|
| `service/PaymentService.java` | Razorpay / Stripe SDK call; persist the gateway order/payment IDs |
| `service/EmailService.java` | `JavaMailSender` (add `spring-boot-starter-mail` + SMTP config) |
| GST invoice | A PDF library (e.g. OpenPDF) building from the stored `baseAmount/gstAmount/totalAmount` |

---

## Verified

- `mvn clean compile` — backend compiles ✅
- `npm run build` — frontend type-checks & builds ✅
- End-to-end smoke test: register/login → search → book (mock pay) → history →
  review → admin views → date & overlap validations all pass ✅


  
