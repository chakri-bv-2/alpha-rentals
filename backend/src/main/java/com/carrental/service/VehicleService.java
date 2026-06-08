package com.carrental.service;

import com.carrental.domain.Vehicle;
import com.carrental.domain.Vehicle.*;
import com.carrental.repository.VehicleRepository;
import com.carrental.web.ApiException;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    /** FR-04 / FR-05: search and filter approved & available vehicles. */
    public List<Vehicle> search(String city, String category, String brand,
                                String fuelType, String transmission, Integer seats,
                                BigDecimal minPrice, BigDecimal maxPrice, Boolean available) {

        Specification<Vehicle> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            // Only show admin-approved listings to customers.
            p.add(cb.equal(root.get("approvalStatus"), ApprovalStatus.APPROVED));

            if (city != null && !city.isBlank())
                p.add(cb.equal(cb.lower(root.get("city")), city.toLowerCase()));
            if (brand != null && !brand.isBlank())
                p.add(cb.equal(cb.lower(root.get("brand")), brand.toLowerCase()));
            if (category != null && !category.isBlank())
                p.add(cb.equal(root.get("category"), VehicleCategory.valueOf(category.toUpperCase())));
            if (fuelType != null && !fuelType.isBlank())
                p.add(cb.equal(root.get("fuelType"), FuelType.valueOf(fuelType.toUpperCase())));
            if (transmission != null && !transmission.isBlank())
                p.add(cb.equal(root.get("transmission"), Transmission.valueOf(transmission.toUpperCase())));
            if (seats != null)
                p.add(cb.greaterThanOrEqualTo(root.get("seatingCapacity"), seats));
            if (minPrice != null)
                p.add(cb.greaterThanOrEqualTo(root.get("pricePerDay"), minPrice));
            if (maxPrice != null)
                p.add(cb.lessThanOrEqualTo(root.get("pricePerDay"), maxPrice));
            if (available != null)
                p.add(cb.equal(root.get("available"), available));

            return cb.and(p.toArray(new Predicate[0]));
        };

        return vehicleRepository.findAll(spec);
    }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Vehicle not found: " + id));
    }

    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
}
