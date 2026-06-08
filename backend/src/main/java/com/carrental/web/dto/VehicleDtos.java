package com.carrental.web.dto;

import com.carrental.domain.Vehicle;

import java.math.BigDecimal;

public class VehicleDtos {

    public record VehicleResponse(
            Long id,
            String name,
            String brand,
            String model,
            Integer manufactureYear,
            String category,
            String fuelType,
            String transmission,
            int seatingCapacity,
            BigDecimal pricePerDay,
            BigDecimal securityDeposit,
            String city,
            String location,
            String imageUrl,
            String description,
            boolean available,
            String approvalStatus,
            double averageRating,
            int reviewCount
    ) {
        public static VehicleResponse from(Vehicle v) {
            return new VehicleResponse(
                    v.getId(), v.getName(), v.getBrand(), v.getModel(), v.getManufactureYear(),
                    v.getCategory() == null ? null : v.getCategory().name(),
                    v.getFuelType() == null ? null : v.getFuelType().name(),
                    v.getTransmission() == null ? null : v.getTransmission().name(),
                    v.getSeatingCapacity(), v.getPricePerDay(), v.getSecurityDeposit(),
                    v.getCity(), v.getLocation(), v.getImageUrl(), v.getDescription(),
                    v.isAvailable(),
                    v.getApprovalStatus() == null ? null : v.getApprovalStatus().name(),
                    v.getAverageRating(), v.getReviewCount());
        }
    }

    public record VehicleRequest(
            String name,
            String brand,
            String model,
            Integer manufactureYear,
            String category,
            String fuelType,
            String transmission,
            int seatingCapacity,
            BigDecimal pricePerDay,
            BigDecimal securityDeposit,
            String city,
            String location,
            String imageUrl,
            String description
    ) {}
}
