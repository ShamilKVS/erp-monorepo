package com.erp.sales.entity;

import com.erp.auth.entity.User;
import com.erp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Sale entity representing a sales transaction.
 * Contains sale details, items, and payment information.
 */
@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale extends BaseEntity {

    @Column(name = "sale_number", nullable = false, unique = true, length = 20)
    private String saleNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SaleItem> items = new ArrayList<>();

    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SaleStatus status = SaleStatus.COMPLETED;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(length = 500)
    private String notes;

    /**
     * Adds an item to the sale.
     */
    public void addItem(SaleItem item) {
        items.add(item);
        item.setSale(this);
    }

    /**
     * Payment methods supported.
     */
    public enum PaymentMethod {
        CASH,
        CARD,
        BANK_TRANSFER,
        OTHER
    }

    /**
     * Sale status options.
     */
    public enum SaleStatus {
        PENDING,
        COMPLETED,
        CANCELLED,
        REFUNDED
    }
}

