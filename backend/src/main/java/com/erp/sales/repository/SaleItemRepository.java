package com.erp.sales.repository;

import com.erp.sales.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for SaleItem entity.
 * Provides database operations for sale items.
 */
@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

    /**
     * Finds all items for a specific sale.
     */
    List<SaleItem> findBySaleId(Long saleId);

    /**
     * Finds top selling products within a date range.
     */
    @Query("SELECT si.product.id, si.productName, SUM(si.quantity) as totalQty " +
           "FROM SaleItem si JOIN si.sale s " +
           "WHERE s.saleDate BETWEEN :startDate AND :endDate AND s.status = 'COMPLETED' " +
           "GROUP BY si.product.id, si.productName " +
           "ORDER BY totalQty DESC")
    List<Object[]> findTopSellingProducts(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}

