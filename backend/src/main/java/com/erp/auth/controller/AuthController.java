package com.erp.auth.controller;

import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.LoginResponse;
import com.erp.auth.service.AuthService;
import com.erp.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication endpoints.
 * Handles login and token validation requests.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final AuthService authService;

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param loginRequest The login credentials
     * @return JWT token and user information
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * Validates a JWT token.
     *
     * @param token The JWT token to validate
     * @return Validation result
     */
    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Check if JWT token is valid")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(
            @RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(ApiResponse.success("Token validation result", isValid));
    }
}

