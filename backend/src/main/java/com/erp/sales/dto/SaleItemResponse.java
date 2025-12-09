package com.erp.sales.dto;

import com.erp.sales.entity.SaleItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for sale item responses.
 * Contains item details for display.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountPercent;
    private BigDecimal lineTotal;

    /**
     * Creates a SaleItemResponse from a SaleItem entity.
     */
    public static SaleItemResponse fromEntity(SaleItem item) {
        return SaleItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .productSku(item.getProductSku())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .discountPercent(item.getDiscountPercent())
                .lineTotal(item.getLineTotal())
                .build();
    }
}

