package com.erp.auth.service;

import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.LoginResponse;

/**
 * Authentication service interface.
 * Defines authentication operations for the application.
 */
public interface AuthService {

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param loginRequest The login credentials
     * @return LoginResponse containing JWT token and user info
     */
    LoginResponse login(LoginRequest loginRequest);

    /**
     * Validates a JWT token.
     *
     * @param token The JWT token to validate
     * @return true if valid, false otherwise
     */
    boolean validateToken(String token);
}

