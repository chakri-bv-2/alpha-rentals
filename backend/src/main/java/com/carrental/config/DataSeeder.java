package com.carrental.config;

import com.carrental.domain.Role;
import com.carrental.domain.User;
import com.carrental.domain.Vehicle;
import com.carrental.domain.Vehicle.*;
import com.carrental.repository.UserRepository;
import com.carrental.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DataSeeder {

    /** Pickup area for each supported city. */
    private static final Map<String, String> CITY_AREA = Map.of(
            "Hyderabad", "Gachibowli",
            "Bengaluru", "Koramangala",
            "Chennai", "T. Nagar",
            "Visakhapatnam", "MVP Colony",
            "Vijayawada", "Benz Circle");

    private record ModelDef(String name, String brand, String model, int year,
                            VehicleCategory category, FuelType fuel,
                            int seats, String price, String deposit, String description) {}

    private static final Map<String, ModelDef> MODELS = new LinkedHashMap<>();
    static {
        MODELS.put("swift", new ModelDef("Maruti Suzuki Swift", "Maruti Suzuki", "Swift VXI", 2022,
                VehicleCategory.HATCHBACK, FuelType.PETROL, 5, "1500", "3000",
                "Compact, fuel-efficient hatchback ideal for zipping through the city."));
        MODELS.put("dzire", new ModelDef("Maruti Suzuki Dzire", "Maruti Suzuki", "Dzire ZXI", 2022,
                VehicleCategory.SEDAN, FuelType.PETROL, 5, "1900", "4000",
                "Comfortable compact sedan with a generous boot — great for airport runs."));
        MODELS.put("city", new ModelDef("Honda City", "Honda", "City ZX", 2023,
                VehicleCategory.SEDAN, FuelType.PETROL, 5, "2600", "5000",
                "Refined sedan with premium interiors and a punchy engine."));
        MODELS.put("ertiga", new ModelDef("Maruti Suzuki Ertiga", "Maruti Suzuki", "Ertiga ZXI", 2022,
                VehicleCategory.MUV, FuelType.PETROL, 7, "2400", "5000",
                "7-seater MUV perfect for family trips and group travel."));
        MODELS.put("crysta", new ModelDef("Toyota Innova Crysta", "Toyota", "Innova Crysta", 2023,
                VehicleCategory.MUV, FuelType.DIESEL, 7, "4500", "8000",
                "The benchmark 7-seater — supremely comfortable for long highway drives."));
        MODELS.put("venue", new ModelDef("Hyundai Venue", "Hyundai", "Venue SX", 2022,
                VehicleCategory.SUV, FuelType.PETROL, 5, "2300", "4500",
                "Compact SUV that's easy to drive and park, loaded with tech."));
        MODELS.put("thar", new ModelDef("Mahindra Thar", "Mahindra", "Thar LX 4x4", 2023,
                VehicleCategory.SUV, FuelType.DIESEL, 4, "3500", "10000",
                "Iconic 4x4 off-roader built for adventure and rugged terrain."));
    }

    /** A single seeded vehicle: model slug, city, transmission, availability. */
    private record Row(String slug, String city, Transmission transmission, boolean available) {}

    /** 18 cars across 5 cities with mixed availability. Swift, City & Venue appear
     *  in both MANUAL and AUTOMATIC. */
    private static final Row[] FLEET = {
            // Hyderabad (4)
            new Row("swift",  "Hyderabad", Transmission.MANUAL,    true),
            new Row("swift",  "Hyderabad", Transmission.AUTOMATIC, true),
            new Row("venue",  "Hyderabad", Transmission.AUTOMATIC, true),
            new Row("thar",   "Hyderabad", Transmission.MANUAL,    false),
            // Bengaluru (4)
            new Row("city",   "Bengaluru", Transmission.AUTOMATIC, true),
            new Row("city",   "Bengaluru", Transmission.MANUAL,    true),
            new Row("venue",  "Bengaluru", Transmission.MANUAL,    true),
            new Row("ertiga", "Bengaluru", Transmission.MANUAL,    false),
            // Chennai (4)
            new Row("thar",   "Chennai", Transmission.MANUAL,    true),
            new Row("ertiga", "Chennai", Transmission.MANUAL,    true),
            new Row("crysta", "Chennai", Transmission.AUTOMATIC, true),
            new Row("dzire",  "Chennai", Transmission.MANUAL,    false),
            // Visakhapatnam (3)
            new Row("swift",  "Visakhapatnam", Transmission.MANUAL,    true),
            new Row("venue",  "Visakhapatnam", Transmission.MANUAL,    true),
            new Row("ertiga", "Visakhapatnam", Transmission.MANUAL,    true),
            // Vijayawada (3)
            new Row("dzire",  "Vijayawada", Transmission.MANUAL,    true),
            new Row("thar",   "Vijayawada", Transmission.MANUAL,    true),
            new Row("city",   "Vijayawada", Transmission.AUTOMATIC, false),
    };

    @Bean
    CommandLineRunner seed(UserRepository users, VehicleRepository vehicles, PasswordEncoder encoder) {
        return args -> {
            if (users.count() > 0) return;

            users.save(User.builder().fullName("Admin").email("admin@alpharentals.in")
                    .mobile("9000000001").password(encoder.encode("admin123"))
                    .role(Role.ADMIN).licenseVerified(true).build());

            users.save(User.builder().fullName("Demo User").email("user@alpharentals.in")
                    .mobile("9000000002").password(encoder.encode("user123"))
                    .role(Role.USER).licenseVerified(true).build());

            User owner = users.save(User.builder().fullName("Fleet Owner").email("owner@alpharentals.in")
                    .mobile("9000000003").password(encoder.encode("owner123"))
                    .role(Role.OWNER).licenseVerified(true).build());

            List<Vehicle> fleet = new ArrayList<>();
            for (Row r : FLEET) {
                ModelDef m = MODELS.get(r.slug());
                fleet.add(Vehicle.builder()
                        .name(m.name()).brand(m.brand()).model(m.model()).manufactureYear(m.year())
                        .category(m.category()).fuelType(m.fuel()).transmission(r.transmission())
                        .seatingCapacity(m.seats())
                        .pricePerDay(new BigDecimal(m.price())).securityDeposit(new BigDecimal(m.deposit()))
                        .city(r.city()).location(CITY_AREA.get(r.city()))
                        .imageUrl(img(r.slug())).description(m.description())
                        .available(r.available()).approvalStatus(ApprovalStatus.APPROVED).owner(owner)
                        .build());
            }
            vehicles.saveAll(fleet);
        };
    }

    /**
     * Car images — local files you dropped into frontend/public/cars/. The UI falls
     * back to a placeholder if an image is unavailable.
     */
    private static String img(String slug) {
        return switch (slug) {
            case "swift"  -> "/cars/swift.jpg";
            case "dzire"  -> "/cars/dzire.webp";
            case "city"   -> "/cars/city.webp";
            case "ertiga" -> "/cars/ertiga.jpg";
            case "crysta" -> "/cars/crysta.avif";
            case "venue"  -> "/cars/venue.avif";
            case "thar"   -> "/cars/thar.avif";
            default        -> "/cars/" + slug + ".svg";
        };
    }
}
