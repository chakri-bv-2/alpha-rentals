package com.carrental.web;

import com.carrental.service.AuthService;
import com.carrental.service.CurrentUserService;
import com.carrental.web.dto.AuthDtos.AuthResponse;
import com.carrental.web.dto.AuthDtos.LoginRequest;
import com.carrental.web.dto.AuthDtos.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    public AuthController(AuthService authService, CurrentUserService currentUserService) {
        this.authService = authService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @GetMapping("/me")
    public Map<String, Object> me() {
        var u = currentUserService.require();
        return Map.of(
                "id", u.getId(),
                "fullName", u.getFullName(),
                "email", u.getEmail(),
                "mobile", u.getMobile(),
                "role", u.getRole().name(),
                "licenseVerified", u.isLicenseVerified()
        );
    }
}
