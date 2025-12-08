package com.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the ERP POS Application.
 * This application provides a complete Point of Sale system with:
 * - User Authentication (JWT-based)
 * - Product Management (CRUD operations)
 * - Sales Management (Create and track sales)
 * - Sales Reporting (Summary and export functionality)
 */
@SpringBootApplication
public class ErpPosApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpPosApplication.class, args);
    }
}

