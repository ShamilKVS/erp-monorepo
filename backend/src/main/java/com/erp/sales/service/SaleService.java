package com.erp.sales.service;

import com.erp.sales.dto.SaleRequest;
import com.erp.sales.dto.SaleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for sales operations.
 * Defines business logic for sales management.
 */
public interface SaleService {

    /**
     * Creates a new sale.
     *
     * @param request The sale request data
     * @param userId  The ID of the user creating the sale
     * @return The created sale response
     */
    SaleResponse createSale(SaleRequest request, Long userId);

    /**
     * Retrieves a sale by ID.
     */
    SaleResponse getSaleById(Long id);

    /**
     * Retrieves a sale by sale number.
     */
    SaleResponse getSaleBySaleNumber(String saleNumber);

    /**
     * Retrieves all sales with pagination.
     */
    Page<SaleResponse> getAllSales(Pageable pageable);

    /**
     * Retrieves sales by user ID.
     */
    Page<SaleResponse> getSalesByUserId(Long userId, Pageable pageable);

    /**
     * Retrieves sales within a date range.
     */
    List<SaleResponse> getSalesByDateRange(LocalDate startDate, LocalDate endDate);

    /**
     * Retrieves sales within a date range with pagination.
     */
    Page<SaleResponse> getSalesByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable);

    /**
     * Cancels a sale.
     */
    SaleResponse cancelSale(Long id);
}

