package com.carrental.repository;

import com.carrental.domain.Booking;
import com.carrental.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.vehicle WHERE b.user = :user ORDER BY b.createdAt DESC")
    List<Booking> findByUserOrderByCreatedAtDesc(@Param("user") User user);

    @Query("SELECT b FROM Booking b JOIN FETCH b.vehicle JOIN FETCH b.user ORDER BY b.createdAt DESC")
    List<Booking> findAllWithDetails();

    @Query("SELECT b FROM Booking b JOIN FETCH b.vehicle JOIN FETCH b.user WHERE b.id = :id")
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);

    /**
     * Returns overlapping non-cancelled bookings for a vehicle in [pickup, return].
     * Used to prevent double-booking (FR-08).
     */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.vehicle.id = :vehicleId
              AND b.status <> com.carrental.domain.Booking$BookingStatus.CANCELLED
              AND b.pickupDate <= :returnDate
              AND b.returnDate >= :pickupDate
            """)
    List<Booking> findOverlapping(@Param("vehicleId") Long vehicleId,
                                  @Param("pickupDate") LocalDate pickupDate,
                                  @Param("returnDate") LocalDate returnDate);
}
