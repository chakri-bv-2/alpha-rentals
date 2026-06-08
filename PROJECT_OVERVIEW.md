# Alpha Rentals — Car Rental Management System (Project Context)

> Paste this whole file into Claude to get help (e.g., pushing to GitHub, writing a
> README, deploying, adding features). It fully describes the project.

## 1. Summary
Alpha Rentals is a full-stack self-drive car rental web application for the Indian market.
Customers search and book cars; vehicle owners list cars; admins approve listings and manage
users/bookings. Prices are in INR (₹) with GST and a refundable security deposit.

## 2. Tech Stack
- **Backend:** Java 17, Spring Boot 3.2, Spring Security, JWT (jjwt), Spring Data JPA, Hibernate.
- **Database:** MySQL (production profile) / H2 in-memory (default `dev` profile, zero setup).
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios.
- **Build:** Maven (backend), npm/Vite (frontend).
- **Auth:** Stateless JWT, BCrypt password hashing, role-based access control.

## 3. Repository Layout
```
Car/
├── README.md
├── PROJECT_OVERVIEW.md          (this file)
├── .gitignore
├── requirements.md              (original spec)
├── backend/                     Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/carrental/
│       │   ├── CarRentalApplication.java
│       │   ├── domain/          User, Vehicle, Booking, Review, Role (entities/enums)
│       │   ├── repository/      Spring Data JPA repositories
│       │   ├── security/        JwtService, JwtAuthFilter, SecurityConfig, AppUserDetails(Service)
│       │   ├── service/         AuthService, VehicleService, BookingService, ReviewService,
│       │   │                    PaymentService (mock), EmailService (mock), CurrentUserService
│       │   ├── web/             REST controllers + dto/ (request/response records) + error handling
│       │   └── config/          DataSeeder (demo data)
│       └── resources/application.yml   (dev=H2, mysql profile)
└── frontend/                    React + TypeScript + Tailwind (Vite)
    ├── package.json, vite.config.ts, tailwind.config.js, tsconfig.json
    ├── .env                     (VITE_API_URL=http://localhost:8080/api)
    ├── public/cars/             local car images (swift.jpg, dzire.webp, city.webp, ertiga.jpg,
    │                            crysta.avif, venue.avif, thar.avif, defender.png, placeholder.svg)
    └── src/
        ├── main.tsx, App.tsx, types.ts, api.ts, auth.tsx, index.css
        ├── components/          Navbar, Footer, VehicleCard, CarImage, Reveal, ProtectedRoute, icons
        ├── hooks/useReveal.ts
        └── pages/               Home, Cars, VehicleDetails, BookingPage, MyBookings,
                                 Login, Register, MyDashboard, admin/(AdminLayout, Dashboard,
                                 AddCar, ManageCars, ManageBookings)
```

## 4. Roles & Features
- **Customer (USER):** register/login, search & filter cars, view details + reviews, book with
  pickup/return date & time, view "My Bookings", cancel + refund, personal dashboard.
- **Owner (OWNER):** list a vehicle (starts PENDING admin approval), edit own vehicles.
- **Admin (ADMIN):** sidebar dashboard with stats (total cars, bookings, pending, confirmed,
  monthly revenue), Add Car, Manage Cars (approve/reject/delete), Manage Bookings.

## 5. Core Business Rules
- JWT auth on all protected endpoints; CORS allows localhost/127.0.0.1 on any port.
- Booking validation: pickup date cannot be in the past (today IS allowed); return not before
  pickup; single-day rental (return == pickup) billed as 1 day; same-day requires return time
  after pickup time; overlapping/double bookings are rejected.
- Pricing: base = pricePerDay × days; GST = 18% of base; total = base + GST + refundable deposit.
- Payments and emails are **mocked** (PaymentService logs a reference; EmailService logs).
- Seed data: 18 cars across 5 cities (Hyderabad, Bengaluru, Chennai, Visakhapatnam, Vijayawada),
  mixed availability; Swift, Honda City, Venue offered in both Manual & Automatic.

## 6. Key REST Endpoints (base: http://localhost:8080/api)
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /vehicles` (search/filter), `GET /vehicles/{id}`, `POST /vehicles`, `PUT /vehicles/{id}`
- `GET/POST /vehicles/{id}/reviews`
- `POST /bookings`, `GET /bookings/mine`, `POST /bookings/{id}/cancel`
- `GET /cities`, `POST /newsletter`
- `GET /admin/stats`, `GET /admin/users`, `GET /admin/vehicles`, `PATCH /admin/vehicles/{id}/approval`,
  `DELETE /admin/vehicles/{id}`, `GET /admin/bookings`
- Auth header: `Authorization: Bearer <token>` (all except `/auth/**` and public GET vehicle routes).

## 7. Database Entities
- **users** (id, fullName, email[unique], mobile, password[bcrypt], role, licenseVerified, blocked)
- **vehicles** (id, name, brand, model, manufactureYear, category, fuelType, transmission, seats,
  pricePerDay, securityDeposit, city, location, imageUrl, available, approvalStatus, owner→users)
- **bookings** (id, user→users, vehicle→vehicles, pickup/return date & time, totalDays, baseAmount,
  gstAmount, securityDeposit, totalAmount, status, paymentStatus, paymentReference, createdAt)
- **reviews** (id, vehicle→vehicles, user→users, rating, comment, createdAt)

## 8. How to Run Locally
**Backend (port 8080):**
```bash
cd backend
mvn spring-boot:run            # H2 in-memory by default; data resets on restart
# MySQL instead:  mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```
**Frontend (port 5173):**
```bash
cd frontend
npm install
npm run dev                    # Windows PowerShell: use `npm.cmd run dev`
```
Open http://localhost:5173.

## 9. Demo Accounts (seeded)
| Role  | Email                   | Password   |
|-------|-------------------------|------------|
| Admin | admin@alpharentals.in   | admin123   |
| User  | user@alpharentals.in    | user123    |
| Owner | owner@alpharentals.in   | owner123   |

## 10. Not Implemented (intentionally out of scope / mocked)
Real payment gateway, real email/SMTP, GST invoice PDF generation, Google OAuth,
driving-license/photo file uploads. Model fields exist; flows are stubbed.

## 11. What I Want Help With
Push this project to GitHub: create a `.gitignore` check, initialize the repo, make a first
commit, create a GitHub repository, and push. Also help write a strong README and (optionally)
add deployment instructions.
```bash
# Reference commands (run from the Car/ folder):
git init
git add .
git commit -m "Initial commit: Alpha Rentals car rental management system"
git branch -M main
# create an empty repo named alpha-rentals on GitHub, then:
git remote add origin https://github.com/<your-username>/alpha-rentals.git
git push -u origin main
```
Notes: `.gitignore` already excludes `backend/target/`, `frontend/node_modules/`, and
`frontend/dist/`. The `frontend/public/cars/` images are committed.
```
