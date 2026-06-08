package com.carrental.web;

import com.carrental.domain.User;
import com.carrental.domain.Vehicle;
import com.carrental.domain.Vehicle.*;
import com.carrental.service.CurrentUserService;
import com.carrental.service.VehicleService;
import com.carrental.web.dto.VehicleDtos.VehicleRequest;
import com.carrental.web.dto.VehicleDtos.VehicleResponse;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;
    private final CurrentUserService currentUserService;

    public VehicleController(VehicleService vehicleService, CurrentUserService currentUserService) {
        this.vehicleService = vehicleService;
        this.currentUserService = currentUserService;
    }

    /** FR-04 / FR-05: public search + filters. */
    @GetMapping
    public List<VehicleResponse> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) Integer seats,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean available) {
        return vehicleService.search(city, category, brand, fuelType, transmission,
                        seats, minPrice, maxPrice, available)
                .stream().map(VehicleResponse::from).toList();
    }

    @GetMapping("/{id}")
    public VehicleResponse getOne(@PathVariable Long id) {
        return VehicleResponse.from(vehicleService.getById(id));
    }

    /** FR-12: owners list a vehicle (starts PENDING admin approval). */
    @PostMapping
    public VehicleResponse create(@RequestBody VehicleRequest req) {
        User owner = currentUserService.require();
        Vehicle v = apply(new Vehicle(), req);
        v.setOwner(owner);
        v.setApprovalStatus(ApprovalStatus.PENDING);
        return VehicleResponse.from(vehicleService.save(v));
    }

    /** FR-13: owner edits their vehicle. */
    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable Long id, @RequestBody VehicleRequest req) {
        User user = currentUserService.require();
        Vehicle v = vehicleService.getById(id);
        boolean isOwner = v.getOwner() != null && v.getOwner().getId().equals(user.getId());
        if (!isOwner && !user.getRole().name().equals("ADMIN")) {
            throw ApiException.forbidden("You can only edit your own vehicles");
        }
        return VehicleResponse.from(vehicleService.save(apply(v, req)));
    }

    private Vehicle apply(Vehicle v, VehicleRequest req) {
        // Derive a display name from brand + model when not supplied.
        String name = req.name();
        if (name == null || name.isBlank()) {
            name = ((req.brand() == null ? "" : req.brand()) + " " + (req.model() == null ? "" : req.model())).trim();
        }
        v.setName(name);
        v.setBrand(req.brand());
        v.setModel(req.model());
        v.setManufactureYear(req.manufactureYear());
        if (req.category() != null) v.setCategory(VehicleCategory.valueOf(req.category().toUpperCase()));
        if (req.fuelType() != null) v.setFuelType(FuelType.valueOf(req.fuelType().toUpperCase()));
        if (req.transmission() != null) v.setTransmission(Transmission.valueOf(req.transmission().toUpperCase()));
        v.setSeatingCapacity(req.seatingCapacity());
        v.setPricePerDay(req.pricePerDay());
        v.setSecurityDeposit(req.securityDeposit());
        v.setCity(req.city());
        v.setLocation(req.location());
        v.setImageUrl(req.imageUrl());
        v.setDescription(req.description());
        return v;
    }
}
