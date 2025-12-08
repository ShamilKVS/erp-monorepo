package com.erp.product.repository;

import com.erp.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Product entity.
 * Provides database operations for product management.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Finds a product by SKU.
     */
    Optional<Product> findBySku(String sku);

    /**
     * Checks if a SKU already exists.
     */
    boolean existsBySku(String sku);

    /**
     * Finds all active products.
     */
    List<Product> findByIsActiveTrue();

    /**
     * Finds active products with pagination.
     */
    Page<Product> findByIsActiveTrue(Pageable pageable);

    /**
     * Searches products by name or SKU.
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(@Param("search") String search, Pageable pageable);

    /**
     * Finds products by category.
     */
    List<Product> findByCategoryAndIsActiveTrue(String category);

    /**
     * Finds products with low stock.
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity <= :threshold")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);
}

