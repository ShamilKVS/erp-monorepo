package com.erp.sales.repository;

import com.erp.sales.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Sale entity.
 * Provides database operations for sales management.
 */
@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    /**
     * Finds a sale by sale number.
     */
    Optional<Sale> findBySaleNumber(String saleNumber);

    /**
     * Finds sales by user ID.
     */
    Page<Sale> findByUserId(Long userId, Pageable pageable);

    /**
     * Finds sales within a date range.
     */
    @Query("SELECT s FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    List<Sale> findSalesBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Finds sales within a date range with pagination.
     */
    @Query("SELECT s FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Page<Sale> findSalesBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    /**
     * Finds the last sale number.
     */
    @Query("SELECT s.saleNumber FROM Sale s ORDER BY s.id DESC LIMIT 1")
    Optional<String> findLastSaleNumber();
}

