package com.erp.sales.entity;

import com.erp.common.entity.BaseEntity;
import com.erp.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * SaleItem entity representing individual items in a sale.
 * Links products to sales with quantity and pricing information.
 */
@Entity
@Table(name = "sale_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(name = "product_sku", nullable = false, length = 50)
    private String productSku;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "discount_percent", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;

    /**
     * Calculates the line total based on quantity, unit price, and discount.
     */
    public void calculateLineTotal() {
        BigDecimal gross = unitPrice.multiply(BigDecimal.valueOf(quantity));
        if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
                    discountPercent.divide(BigDecimal.valueOf(100)));
            this.lineTotal = gross.multiply(discountMultiplier);
        } else {
            this.lineTotal = gross;
        }
    }
}

