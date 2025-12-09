package com.erp.sales.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for sale item requests.
 * Contains product and quantity information for a sale item.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleItemRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @DecimalMin(value = "0.00", message = "Discount percent cannot be negative")
    @DecimalMax(value = "100.00", message = "Discount percent cannot exceed 100")
    private BigDecimal discountPercent;
}

