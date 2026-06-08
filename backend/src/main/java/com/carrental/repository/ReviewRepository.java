package com.carrental.repository;

import com.carrental.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r JOIN FETCH r.user JOIN FETCH r.vehicle "
            + "WHERE r.vehicle.id = :vehicleId ORDER BY r.createdAt DESC")
    List<Review> findByVehicleIdOrderByCreatedAtDesc(@Param("vehicleId") Long vehicleId);
}
