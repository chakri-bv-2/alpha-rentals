package com.carrental.web.dto;

import com.carrental.domain.Booking;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class BookingDtos {

    public record BookingRequest(
            @NotNull Long vehicleId,
            @NotNull LocalDate pickupDate,
            @NotNull LocalDate returnDate,
            String pickupTime,   // "HH:mm", optional (defaults to 10:00)
            String returnTime,   // "HH:mm", optional (defaults to 10:00)
            String paymentMethod
    ) {}

    public record BookingResponse(
            Long id,
            Long vehicleId,
            String vehicleName,
            String vehicleImageUrl,
            Integer vehicleYear,
            String vehicleCategory,
            String vehicleCity,
            LocalDate pickupDate,
            LocalDate returnDate,
            String pickupTime,
            String returnTime,
            long totalDays,
            BigDecimal baseAmount,
            BigDecimal gstAmount,
            BigDecimal securityDeposit,
            BigDecimal totalAmount,
            String status,
            String paymentStatus,
            String paymentReference,
            String paymentMethod,
            Instant createdAt
    ) {
        public static BookingResponse from(Booking b) {
            var v = b.getVehicle();
            return new BookingResponse(
                    b.getId(),
                    v.getId(),
                    v.getName(),
                    v.getImageUrl(),
                    v.getManufactureYear(),
                    v.getCategory() == null ? null : v.getCategory().name(),
                    v.getCity(),
                    b.getPickupDate(), b.getReturnDate(),
                    b.getPickupTime() == null ? null : b.getPickupTime().toString(),
                    b.getReturnTime() == null ? null : b.getReturnTime().toString(),
                    b.getTotalDays(),
                    b.getBaseAmount(), b.getGstAmount(), b.getSecurityDeposit(), b.getTotalAmount(),
                    b.getStatus().name(), b.getPaymentStatus().name(),
                    b.getPaymentReference(), b.getPaymentMethod(),
                    b.getCreatedAt());
        }
    }
}
