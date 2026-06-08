package com.carrental.web;

import com.carrental.domain.User;
import com.carrental.service.CurrentUserService;
import com.carrental.service.ReviewService;
import com.carrental.web.dto.ReviewDtos.ReviewRequest;
import com.carrental.web.dto.ReviewDtos.ReviewResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles/{vehicleId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final CurrentUserService currentUserService;

    public ReviewController(ReviewService reviewService, CurrentUserService currentUserService) {
        this.reviewService = reviewService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<ReviewResponse> list(@PathVariable Long vehicleId) {
        return reviewService.forVehicle(vehicleId).stream().map(ReviewResponse::from).toList();
    }

    @PostMapping
    public ReviewResponse add(@PathVariable Long vehicleId, @Valid @RequestBody ReviewRequest req) {
        User user = currentUserService.require();
        return ReviewResponse.from(reviewService.add(user, vehicleId, req));
    }
}
