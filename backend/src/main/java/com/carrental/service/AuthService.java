package com.carrental.service;

import com.carrental.domain.Role;
import com.carrental.domain.User;
import com.carrental.repository.UserRepository;
import com.carrental.security.JwtService;
import com.carrental.web.ApiException;
import com.carrental.web.dto.AuthDtos.AuthResponse;
import com.carrental.web.dto.AuthDtos.LoginRequest;
import com.carrental.web.dto.AuthDtos.RegisterRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw ApiException.conflict("An account with this email already exists");
        }
        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email())
                .mobile(req.mobile())
                .password(passwordEncoder.encode(req.password()))
                .role(req.role() == null ? Role.USER : req.role())
                .build();
        user = userRepository.save(user);
        return toResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        return toResponse(user);
    }

    private AuthResponse toResponse(User user) {
        String token = jwtService.generateToken(user.getEmail(),
                Map.of("role", user.getRole().name(), "uid", user.getId()));
        return new AuthResponse(token, user.getId(), user.getFullName(),
                user.getEmail(), user.getRole().name());
    }
}
