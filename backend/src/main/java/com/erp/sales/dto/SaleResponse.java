package com.erp.sales.dto;

import com.erp.sales.entity.Sale;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for sale responses.
 * Contains complete sale information for display.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleResponse {

    private Long id;
    private String saleNumber;
    private Long userId;
    private String userName;
    private String customerName;
    private String customerPhone;
    private List<SaleItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String status;
    private LocalDateTime saleDate;
    private String notes;
    private LocalDateTime createdAt;

    /**
     * Creates a SaleResponse from a Sale entity.
     */
    public static SaleResponse fromEntity(Sale sale) {
        return SaleResponse.builder()
                .id(sale.getId())
                .saleNumber(sale.getSaleNumber())
                .userId(sale.getUser().getId())
                .userName(sale.getUser().getFullName())
                .customerName(sale.getCustomerName())
                .customerPhone(sale.getCustomerPhone())
                .items(sale.getItems().stream()
                        .map(SaleItemResponse::fromEntity)
                        .collect(Collectors.toList()))
                .subtotal(sale.getSubtotal())
                .taxAmount(sale.getTaxAmount())
                .discountAmount(sale.getDiscountAmount())
                .totalAmount(sale.getTotalAmount())
                .paymentMethod(sale.getPaymentMethod().name())
                .status(sale.getStatus().name())
                .saleDate(sale.getSaleDate())
                .notes(sale.getNotes())
                .createdAt(sale.getCreatedAt())
                .build();
    }
}

