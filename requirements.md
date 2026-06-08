# Car Rental Management System

## Requirements Specification Document

---

# 1. Introduction

## 1.1 Project Overview

The Car Rental Management System is a full-stack web application designed to provide a seamless platform for users to search, book, and rent vehicles online. The system allows customers to browse available vehicles, view detailed information, make reservations, and manage bookings. Vehicle owners can list their cars for rental, while administrators manage users, vehicles, bookings, and system operations.

The platform aims to simplify the car rental process by offering a user-friendly interface, secure booking system, online payments, vehicle verification, and real-time availability tracking.

---

# 2. Objectives

The primary objectives of the system are:

- Provide a convenient online car rental platform.
- Allow users to search and book vehicles easily.
- Enable vehicle owners to monetize their vehicles.
- Improve booking efficiency through automation.
- Ensure secure and transparent transactions.
- Provide administrators with centralized management capabilities.
- Support multiple cities across India.

---

# 3. Scope of the Project

The system covers:

- User Registration and Authentication
- Vehicle Search and Filtering
- Vehicle Booking Management
- Vehicle Listing by Owners
- Online Payment Processing
- Booking History Management
- Admin Dashboard
- Reviews and Ratings
- Notifications and Alerts
- Invoice Generation

The application is intended for customers, vehicle owners, and administrators.

---

# 4. Functional Requirements

## 4.1 User Management Module

### FR-01 User Registration

The system shall allow users to register using:

- Email Address
- Mobile Number
- Password

### FR-02 User Authentication

The system shall provide:

- Secure Login
- Secure Logout
- Password Reset
- Google Authentication

### FR-03 Profile Management

Users shall be able to:

- Update Profile Information
- Change Password
- Upload Driving License
- Upload Profile Picture

---

## 4.2 Vehicle Search Module

### FR-04 Vehicle Search

Users shall be able to search vehicles based on:

- Pickup Location
- Pickup Date
- Return Date
- Vehicle Category
- Price Range

### FR-05 Vehicle Filters

Users shall filter vehicles using:

- Fuel Type
- Transmission Type
- Seating Capacity
- Brand
- Price Range
- Availability

---

## 4.3 Vehicle Details Module

### FR-06 Vehicle Information

The system shall display:

- Vehicle Name
- Vehicle Model
- Vehicle Images
- Rental Price
- Fuel Type
- Seating Capacity
- Transmission Type
- Vehicle Location
- Availability Status

---

## 4.4 Booking Module

### FR-07 Booking Creation

Users shall be able to:

- Select Vehicle
- Choose Rental Dates
- Confirm Booking
- check dates they should not be backwards

### FR-08 Booking Validation

The system shall:

- Check Vehicle Availability
- Prevent Duplicate Bookings
- Validate Booking Dates
- check dates they should not be backwards

### FR-09 Booking Confirmation

The system shall:

- Generate Booking Confirmation
- Send Email Notifications
- Update Vehicle Availability

---

## 4.5 Booking Management Module

### FR-10 Booking History

Users shall be able to:

- View Active Bookings
- View Past Bookings
- Download Booking Invoices

### FR-11 Booking Cancellation

Users shall be able to:

- Cancel Bookings
- Request Refunds

---

## 4.6 Vehicle Listing Module

### FR-12 Vehicle Listing

Vehicle owners shall be able to:

- Add Vehicles
- Upload Images
- Set Rental Prices
- Manage Availability

### FR-13 Vehicle Update

Vehicle owners shall be able to:

- Edit Vehicle Information
- Remove Vehicles
- Update Pricing

---

## 4.7 Review and Rating Module

### FR-14 Reviews

Users shall be able to:

- Submit Reviews
- Rate Vehicles

### FR-15 Ratings

The system shall:

- Display Ratings
- Calculate Average Ratings

---

## 4.8 Subscription Module

### FR-16 Newsletter Subscription

Users shall be able to subscribe to:

- Promotional Offers
- New Vehicle Notifications
- Discount Alerts

---

## 4.9 Admin Module

### FR-17 User Management

Admin shall be able to:

- View Users
- Block Users
- Delete Users

### FR-18 Vehicle Management

Admin shall be able to:

- Approve Vehicles
- Reject Listings
- Remove Vehicles

### FR-19 Booking Management

Admin shall be able to:

- View All Bookings
- Manage Refunds
- Generate Reports

---

# 5. India-Specific Features

## 5.1 Driving License Verification

The system shall require users to upload:

- Valid Indian Driving License

The admin shall verify the uploaded documents before booking approval.

---



---

## 5.3 UPI Payment Integration

The system shall support:

- Google Pay
- PhonePe
- Paytm
- BHIM UPI
- Credit Cards
- Debit Cards
- Net Banking

---

## 5.4 GST Invoice Generation

The system shall generate:

- GST-Compliant Invoices
- Tax Breakdown Reports

---

## 5.5 Security Deposit Management

The platform shall:

- Collect Security Deposit
- Process Refunds Automatically

---

## 5.6 Multi-City Support

Supported Cities:

- Hyderabad
- Bengaluru
- Chennai
- Mumbai
- Delhi
- Pune
- Visakhapatnam
- Vijayawada

---



## 5.8 Emergency Assistance

The system shall provide:


- 24/7 Roadside Assistance Emergency Support Contacts

---

# 6. Non-Functional Requirements

## 6.1 Performance

- Page Load Time < 3 Seconds
- Search Response < 2 Seconds
- Booking Confirmation < 5 Seconds

---

## 6.2 Security

- JWT Authentication
- Password Encryption using BCrypt
- HTTPS Communication
- Role-Based Access Control
- Secure Payment Processing

---


---


---

## 6.5 Usability

The system shall provide:

- Responsive Design
- Mobile Compatibility
- User-Friendly Interface
- Easy Navigation

---

# 7. System Requirements



---

## 7.2 Software Requirements

### Frontend

- React.js
- TypeScript
- Tailwind CSS
- Axios
- React Router

### Backend

- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Hibernate
- Spring Data JPA

### Database

- MySQL

### Development Tools

- Maven
- Git
- GitHub
- Postman
- Swagger/OpenAPI

---


---

# 9. Conclusion

The Car Rental Management System provides a comprehensive platform for vehicle rental services. The system enables users to search, book, and manage rentals efficiently while allowing vehicle owners to generate income through vehicle listings. With secure authentication, payment integration, vehicle verification, and scalable architecture, the platform delivers a reliable and user-friendly car rental experience suitable for the Indian market.

# UI/UX Requirements Specification

## Homepage Requirements

### Navigation Bar

The homepage shall contain a responsive navigation bar with:

- Company Logo
- Home Menu
- Cars Menu
- My Bookings Menu
- Search Bar
- List Your Car Button
- Login / Logout Button
- Dashboard Access for Vehicle Owners

### Hero Section

The homepage shall display:

- Large Hero Banner
- Luxury Vehicle Image
- Tagline: "Luxury Cars on Rent"
- Car Search Form

The search form shall include:

- Pickup Location Dropdown
- Pickup Date Selector
- Return Date Selector
- Search Button

---

## Featured Vehicles Section

The homepage shall display featured vehicles in card layout.

Each vehicle card shall contain:

- Vehicle Image
- Availability Badge
- Price Per Day
- Vehicle Name
- Vehicle Type
- Manufacturing Year
- Fuel Type
- Seating Capacity
- Transmission Type
- Location

### Vehicle Card Actions

Users shall be able to:

- View Vehicle Details
- Book Vehicle
- Check Availability

---

## Vehicle Listing Promotion Section

The homepage shall contain a promotional section encouraging vehicle owners to list their vehicles.

The section shall display:

- Promotional Banner
- Call-To-Action Button
- Benefits of Listing Vehicles

Benefits displayed:

- Passive Income
- Insurance Coverage
- Driver Verification
- Secure Payments

---

## Customer Reviews Section

The homepage shall display customer testimonials.

Each testimonial shall contain:

- Customer Name
- Customer Photo
- Customer Location
- Star Rating
- Review Text

---

## Newsletter Subscription Section

The homepage shall include:

- Email Input Field
- Subscribe Button

Users shall receive:

- Promotional Offers
- New Vehicle Notifications
- Discount Coupons

---

## Footer Section

The footer shall contain:

### Company Information

- Company Description
- Social Media Links

### Quick Links

- Home
- Browse Cars
- List Your Car
- About Us

### Resources

- Help Center
- Terms of Service
- Privacy Policy
- Insurance Information

### Contact Information

- Address
- Phone Number
- Email Address

---

# Cars Listing Page Requirements

The Cars page shall display:

- Grid Layout of Available Cars
- Vehicle Search Bar
- Filters

Filters include:

- Location
- Vehicle Type
- Price Range
- Fuel Type
- Transmission Type
- Seating Capacity

Each car card shall display:

- Vehicle Image
- Daily Rental Price
- Availability Status
- Vehicle Specifications
- View Details Button

---

# Vehicle Details Page Requirements

The Vehicle Details page shall display:

- Large Vehicle Image
- Vehicle Gallery
- Vehicle Name
- Vehicle Category
- Vehicle Specifications
- Daily Rental Price

### Booking Panel

The booking panel shall include:

- Pickup Date
- Return Date
- Total Cost Calculation
- Book Now Button

The system shall:

- Validate dates
- Check availability
- Prevent overlapping bookings

---

# My Bookings Page Requirements

Users shall be able to:

- View Current Bookings
- View Previous Bookings
- Cancel Bookings
- Download Invoice

Booking details shall display:

- Vehicle Information
- Booking Dates
- Rental Amount
- Booking Status

---

# Vehicle Owner Dashboard Requirements

Vehicle owners shall be able to:

- View Listed Vehicles
- Add New Vehicle
- Edit Vehicle Details
- Delete Vehicle
- View Rental Earnings
- View Booking Requests

Dashboard statistics shall include:

- Total Vehicles
- Total Bookings
- Total Revenue
- Active Rentals

---

# Admin Dashboard Requirements

Admin shall be able to:

- Manage Users
- Manage Vehicles
- Approve Vehicle Listings
- Reject Listings
- Monitor Bookings
- Generate Reports

Admin analytics shall include:

- Total Users
- Total Cars
- Revenue Statistics
- Booking Trends

---

# India-Specific Features

The system shall support:


- GST Invoice Generation
- UPI Payments
- Google Pay
- PhonePe
- Paytm

- Multi-City Support


- Roadside Assistance

Supported cities include:

- Hyderabad
- Bengaluru
- Chennai
- Mumbai
- Delhi
- Pune
- Vijayawada
- Visakhapatnam

---

# UI Design Requirements

The user interface shall follow:

- Modern Minimal Design
- Clean White Background
- Blue Primary Theme
- Rounded Components
- Responsive Layout
- Mobile-First Design
- Fast Navigation
- Professional Luxury-Car Branding



while maintaining a premium luxury car rental appearance.