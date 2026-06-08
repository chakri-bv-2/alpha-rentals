package com.carrental.web;

import com.carrental.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Misc public endpoints: supported cities (5.6) and newsletter (FR-16). */
@RestController
@RequestMapping("/api")
public class MetaController {

    private static final List<String> CITIES = List.of(
            "Hyderabad", "Bengaluru", "Chennai", "Visakhapatnam", "Vijayawada");

    private final EmailService emailService;

    public MetaController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/cities")
    public List<String> cities() {
        return CITIES;
    }

    @PostMapping("/newsletter")
    public Map<String, Object> subscribe(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        if (email.isBlank()) throw ApiException.badRequest("Email is required");
        emailService.sendNewsletterSubscription(email);
        return Map.of("subscribed", true, "email", email);
    }
}
