package com.carrental.service;

import com.carrental.domain.Booking;
import com.carrental.domain.Booking.BookingStatus;
import com.carrental.domain.Booking.PaymentStatus;
import com.carrental.domain.User;
import com.carrental.domain.Vehicle;
import com.carrental.repository.BookingRepository;
import com.carrental.web.ApiException;
import com.carrental.web.dto.BookingDtos.BookingRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    /** GST rate applied to the rental base amount (FR-5.4). */
    private static final BigDecimal GST_RATE = new BigDecimal("0.18");

    private final BookingRepository bookingRepository;
    private final VehicleService vehicleService;
    private final PaymentService paymentService;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository, VehicleService vehicleService,
                          PaymentService paymentService, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.vehicleService = vehicleService;
        this.paymentService = paymentService;
        this.emailService = emailService;
    }

    /** FR-07 / FR-08 / FR-09: create, validate, charge, confirm, notify. */
    @Transactional
    public Booking create(User user, BookingRequest req) {
        LocalDate pickup = req.pickupDate();
        LocalDate ret = req.returnDate();

        // FR-08: validate dates. Pickup can be today, but not in the past. A
        // single-day rental (return == pickup) is allowed.
        if (pickup.isBefore(LocalDate.now())) {
            throw ApiException.badRequest("Pickup date cannot be in the past");
        }
        if (ret.isBefore(pickup)) {
            throw ApiException.badRequest("Return date cannot be before the pickup date");
        }

        LocalTime pickupTime = parseTime(req.pickupTime());
        LocalTime returnTime = parseTime(req.returnTime());
        // For a same-date rental, the return time must be after the pickup time.
        if (pickup.equals(ret) && !returnTime.isAfter(pickupTime)) {
            throw ApiException.badRequest("Return time must be after the pickup time for a same-day rental");
        }

        Vehicle vehicle = vehicleService.getById(req.vehicleId());
        if (!vehicle.isAvailable()) {
            throw ApiException.conflict("Vehicle is not available for booking");
        }

        // FR-08: prevent double-booking on overlapping dates.
        List<Booking> overlaps = bookingRepository.findOverlapping(vehicle.getId(), pickup, ret);
        if (!overlaps.isEmpty()) {
            throw ApiException.conflict("Vehicle is already booked for the selected dates");
        }

        // A same-date booking counts as 1 rental day; otherwise bill per night.
        long days = Math.max(1, ChronoUnit.DAYS.between(pickup, ret));
        BigDecimal base = vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));
        BigDecimal gst = base.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal deposit = vehicle.getSecurityDeposit() == null ? BigDecimal.ZERO : vehicle.getSecurityDeposit();
        BigDecimal total = base.add(gst).add(deposit).setScale(2, RoundingMode.HALF_UP);

        Booking booking = Booking.builder()
                .user(user)
                .vehicle(vehicle)
                .pickupDate(pickup)
                .returnDate(ret)
                .pickupTime(pickupTime)
                .returnTime(returnTime)
                .totalDays(days)
                .baseAmount(base.setScale(2, RoundingMode.HALF_UP))
                .gstAmount(gst)
                .securityDeposit(deposit)
                .totalAmount(total)
                .paymentMethod(req.paymentMethod() == null ? "UPI" : req.paymentMethod())
                .build();

        booking = bookingRepository.save(booking);

        // Mock payment + confirmation (FR-09).
        String ref = paymentService.charge(booking, booking.getPaymentMethod());
        booking.setPaymentReference(ref);
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        emailService.sendBookingConfirmation(booking);
        return booking;
    }

    /** Parses an "HH:mm" string, defaulting to 10:00 when missing/blank/invalid. */
    private LocalTime parseTime(String value) {
        if (value == null || value.isBlank()) return LocalTime.of(10, 0);
        try {
            return LocalTime.parse(value.trim());
        } catch (DateTimeParseException ex) {
            throw ApiException.badRequest("Invalid time format (expected HH:mm): " + value);
        }
    }

    public List<Booking> myBookings(User user) {
        return bookingRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Booking> all() {
        return bookingRepository.findAllWithDetails();
    }

    /** FR-11: cancel a booking and process a (mock) refund. */
    @Transactional
    public Booking cancel(User user, Long bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> ApiException.notFound("Booking not found"));

        boolean isOwnerOfBooking = booking.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equals("ADMIN");
        if (!isOwnerOfBooking && !isAdmin) {
            throw ApiException.forbidden("You cannot cancel this booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw ApiException.badRequest("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw ApiException.badRequest("Completed bookings cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            paymentService.refund(booking);
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        booking = bookingRepository.save(booking);
        emailService.sendCancellation(booking);
        return booking;
    }
}
