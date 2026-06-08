package com.carrental.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String model;

    /** Manufacture year, shown as "Category • Year" on cards. */
    private Integer manufactureYear;

    @Enumerated(EnumType.STRING)
    private VehicleCategory category;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    private Transmission transmission;

    private int seatingCapacity;

    /** Price per day in INR. */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    /** Refundable security deposit in INR. */
    @Column(precision = 10, scale = 2)
    private BigDecimal securityDeposit;

    private String city;
    private String location;
    private String imageUrl;

    @Column(length = 2000)
    private String description;

    @Builder.Default
    private boolean available = true;

    /** Admin approval workflow (FR-18). */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    /** Owner who listed the vehicle (FR-12). Null for platform-owned. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Builder.Default
    private double averageRating = 0.0;

    @Builder.Default
    private int reviewCount = 0;

    @Builder.Default
    private Instant createdAt = Instant.now();

    public enum VehicleCategory { HATCHBACK, SEDAN, SUV, LUXURY, MUV, ELECTRIC }
    public enum FuelType { PETROL, DIESEL, ELECTRIC, CNG, HYBRID }
    public enum Transmission { MANUAL, AUTOMATIC }
    public enum ApprovalStatus { PENDING, APPROVED, REJECTED }
}
