package com.carrental.web.dto;

import com.carrental.domain.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.Instant;

public class ReviewDtos {

    public record ReviewRequest(
            @Min(1) @Max(5) int rating,
            String comment
    ) {}

    public record ReviewResponse(
            Long id,
            Long vehicleId,
            String userName,
            int rating,
            String comment,
            Instant createdAt
    ) {
        public static ReviewResponse from(Review r) {
            return new ReviewResponse(
                    r.getId(), r.getVehicle().getId(), r.getUser().getFullName(),
                    r.getRating(), r.getComment(), r.getCreatedAt());
        }
    }
}
