package com.carrental.web;

import com.carrental.domain.Booking;
import com.carrental.domain.Booking.BookingStatus;
import com.carrental.domain.Booking.PaymentStatus;
import com.carrental.domain.User;
import com.carrental.domain.Vehicle;
import com.carrental.domain.Vehicle.ApprovalStatus;
import com.carrental.repository.UserRepository;
import com.carrental.repository.VehicleRepository;
import com.carrental.service.BookingService;
import com.carrental.web.dto.BookingDtos.BookingResponse;
import com.carrental.web.dto.VehicleDtos.VehicleResponse;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingService bookingService;

    public AdminController(UserRepository userRepository, VehicleRepository vehicleRepository,
                           BookingService bookingService) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.bookingService = bookingService;
    }

    // ---- Dashboard stats ----
    @GetMapping("/stats")
    public Map<String, Object> stats() {
        List<Booking> bookings = bookingService.all();
        long totalCars = vehicleRepository.count();
        long pending = bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long confirmed = bookings.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();

        LocalDate now = LocalDate.now();
        BigDecimal monthlyRevenue = bookings.stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.PAID && b.getTotalAmount() != null)
                .filter(b -> {
                    LocalDate d = b.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate();
                    return d.getMonthValue() == now.getMonthValue() && d.getYear() == now.getYear();
                })
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<BookingResponse> recent = bookings.stream().limit(5).map(BookingResponse::from).toList();

        return Map.of(
                "totalCars", totalCars,
                "totalBookings", bookings.size(),
                "pending", pending,
                "confirmed", confirmed,
                "monthlyRevenue", monthlyRevenue,
                "recentBookings", recent);
    }

    // ---- FR-17 User management ----
    @GetMapping("/users")
    public List<Map<String, Object>> users() {
        return userRepository.findAll().stream().map(u -> Map.<String, Object>of(
                "id", u.getId(), "fullName", u.getFullName(), "email", u.getEmail(),
                "role", u.getRole().name(), "blocked", u.isBlocked(),
                "licenseVerified", u.isLicenseVerified())).toList();
    }

    @PatchMapping("/users/{id}/block")
    public Map<String, Object> setBlocked(@PathVariable Long id, @RequestParam boolean blocked) {
        User u = userRepository.findById(id).orElseThrow(() -> ApiException.notFound("User not found"));
        u.setBlocked(blocked);
        userRepository.save(u);
        return Map.of("id", u.getId(), "blocked", u.isBlocked());
    }

    @PatchMapping("/users/{id}/verify-license")
    public Map<String, Object> verifyLicense(@PathVariable Long id, @RequestParam boolean verified) {
        User u = userRepository.findById(id).orElseThrow(() -> ApiException.notFound("User not found"));
        u.setLicenseVerified(verified);
        userRepository.save(u);
        return Map.of("id", u.getId(), "licenseVerified", u.isLicenseVerified());
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // ---- FR-18 Vehicle management ----
    @GetMapping("/vehicles")
    public List<VehicleResponse> allVehicles() {
        return vehicleRepository.findAll().stream().map(VehicleResponse::from).toList();
    }

    @PatchMapping("/vehicles/{id}/approval")
    public VehicleResponse setApproval(@PathVariable Long id, @RequestParam String status) {
        Vehicle v = vehicleRepository.findById(id).orElseThrow(() -> ApiException.notFound("Vehicle not found"));
        v.setApprovalStatus(ApprovalStatus.valueOf(status.toUpperCase()));
        return VehicleResponse.from(vehicleRepository.save(v));
    }

    @DeleteMapping("/vehicles/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleRepository.deleteById(id);
    }

    // ---- FR-19 Booking management ----
    @GetMapping("/bookings")
    public List<BookingResponse> allBookings() {
        return bookingService.all().stream().map(BookingResponse::from).toList();
    }
}
