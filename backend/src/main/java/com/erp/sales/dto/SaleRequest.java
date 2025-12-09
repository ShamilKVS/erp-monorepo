package com.erp.sales.dto;

import com.erp.sales.entity.Sale;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for sale creation requests.
 * Contains all information needed to create a new sale.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleRequest {

    @Size(max = 100, message = "Customer name cannot exceed 100 characters")
    private String customerName;

    @Size(max = 20, message = "Customer phone cannot exceed 20 characters")
    private String customerPhone;

    @NotEmpty(message = "Sale must have at least one item")
    @Valid
    private List<SaleItemRequest> items;

    @DecimalMin(value = "0.00", message = "Tax amount cannot be negative")
    private BigDecimal taxAmount;

    @DecimalMin(value = "0.00", message = "Discount amount cannot be negative")
    private BigDecimal discountAmount;

    @NotNull(message = "Payment method is required")
    private Sale.PaymentMethod paymentMethod;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
}

