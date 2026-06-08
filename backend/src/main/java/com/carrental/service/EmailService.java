package com.carrental.service;

import com.carrental.domain.Booking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Mock notification service (FR-09, FR-16). Logs instead of sending real email.
 * Replace with JavaMailSender for production.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public void sendBookingConfirmation(Booking booking) {
        log.info("[MOCK EMAIL] To: {} | Booking #{} confirmed for '{}' from {} to {}. Total ₹{}.",
                booking.getUser().getEmail(), booking.getId(),
                booking.getVehicle().getName(), booking.getPickupDate(),
                booking.getReturnDate(), booking.getTotalAmount());
    }

    public void sendCancellation(Booking booking) {
        log.info("[MOCK EMAIL] To: {} | Booking #{} cancelled. Refund of ₹{} is being processed.",
                booking.getUser().getEmail(), booking.getId(), booking.getTotalAmount());
    }

    public void sendNewsletterSubscription(String email) {
        log.info("[MOCK EMAIL] Subscribed {} to promotional offers & new vehicle alerts.", email);
    }
}
