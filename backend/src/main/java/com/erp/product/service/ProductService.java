package com.erp.product.service;

import com.erp.product.dto.ProductRequest;
import com.erp.product.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for product operations.
 * Defines business logic for product management.
 */
public interface ProductService {

    /**
     * Creates a new product.
     */
    ProductResponse createProduct(ProductRequest request);

    /**
     * Retrieves a product by ID.
     */
    ProductResponse getProductById(Long id);

    /**
     * Retrieves all active products with pagination.
     */
    Page<ProductResponse> getAllProducts(Pageable pageable);

    /**
     * Searches products by name or SKU.
     */
    Page<ProductResponse> searchProducts(String search, Pageable pageable);

    /**
     * Updates an existing product.
     */
    ProductResponse updateProduct(Long id, ProductRequest request);

    /**
     * Soft deletes a product (sets isActive to false).
     */
    void deleteProduct(Long id);
}

