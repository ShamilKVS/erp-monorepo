package com.erp.auth.repository;

import com.erp.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides database operations for user management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by username.
     */
    Optional<User> findByUsername(String username);

    /**
     * Finds a user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a username already exists.
     */
    boolean existsByUsername(String username);

    /**
     * Checks if an email already exists.
     */
    boolean existsByEmail(String email);
}

