package com.carrental.service;

import com.carrental.domain.Booking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Mock payment gateway (FR-5.3 UPI/cards). Simulates a successful charge and
 * returns a reference. Swap with a real Razorpay/Stripe integration later.
 */
@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    public String charge(Booking booking, String method) {
        String ref = "PAY-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        log.info("[MOCK PAYMENT] Charged ₹{} via {} for booking {} -> {}",
                booking.getTotalAmount(), method, booking.getId(), ref);
        return ref;
    }

    public void refund(Booking booking) {
        log.info("[MOCK REFUND] Refunded ₹{} (deposit ₹{}) for booking {} ref {}",
                booking.getTotalAmount(), booking.getSecurityDeposit(),
                booking.getId(), booking.getPaymentReference());
    }
}
