package com.carrental.service;

import com.carrental.domain.Review;
import com.carrental.domain.User;
import com.carrental.domain.Vehicle;
import com.carrental.repository.ReviewRepository;
import com.carrental.repository.VehicleRepository;
import com.carrental.web.dto.ReviewDtos.ReviewRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleService vehicleService;

    public ReviewService(ReviewRepository reviewRepository, VehicleRepository vehicleRepository,
                         VehicleService vehicleService) {
        this.reviewRepository = reviewRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleService = vehicleService;
    }

    public List<Review> forVehicle(Long vehicleId) {
        return reviewRepository.findByVehicleIdOrderByCreatedAtDesc(vehicleId);
    }

    /** FR-14 / FR-15: add a review and recompute the vehicle's average rating. */
    @Transactional
    public Review add(User user, Long vehicleId, ReviewRequest req) {
        Vehicle vehicle = vehicleService.getById(vehicleId);
        Review review = reviewRepository.save(Review.builder()
                .vehicle(vehicle).user(user)
                .rating(req.rating()).comment(req.comment())
                .build());

        List<Review> all = reviewRepository.findByVehicleIdOrderByCreatedAtDesc(vehicleId);
        double avg = all.stream().mapToInt(Review::getRating).average().orElse(0.0);
        vehicle.setAverageRating(Math.round(avg * 10.0) / 10.0);
        vehicle.setReviewCount(all.size());
        vehicleRepository.save(vehicle);

        return review;
    }
}
