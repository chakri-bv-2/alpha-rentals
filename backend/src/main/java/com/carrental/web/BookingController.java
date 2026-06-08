package com.carrental.web;

import com.carrental.domain.User;
import com.carrental.service.BookingService;
import com.carrental.service.CurrentUserService;
import com.carrental.web.dto.BookingDtos.BookingRequest;
import com.carrental.web.dto.BookingDtos.BookingResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final CurrentUserService currentUserService;

    public BookingController(BookingService bookingService, CurrentUserService currentUserService) {
        this.bookingService = bookingService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public BookingResponse create(@Valid @RequestBody BookingRequest req) {
        User user = currentUserService.require();
        return BookingResponse.from(bookingService.create(user, req));
    }

    /** FR-10: booking history for the logged-in user. */
    @GetMapping("/mine")
    public List<BookingResponse> mine() {
        User user = currentUserService.require();
        return bookingService.myBookings(user).stream().map(BookingResponse::from).toList();
    }

    /** FR-11: cancel a booking. */
    @PostMapping("/{id}/cancel")
    public BookingResponse cancel(@PathVariable Long id) {
        User user = currentUserService.require();
        return BookingResponse.from(bookingService.cancel(user, id));
    }
}
