package com.erp.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for sales report summary.
 * Contains aggregated sales data for reporting.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportSummary {

    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalSales;
    private BigDecimal totalRevenue;
    private BigDecimal totalTax;
    private BigDecimal totalDiscount;
    private BigDecimal averageSaleAmount;
    private List<DailySalesSummary> dailySummary;
    private List<TopProductSummary> topProducts;
    private List<PaymentMethodSummary> paymentMethodBreakdown;

    /**
     * Daily sales summary.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySalesSummary {
        private LocalDate date;
        private Long salesCount;
        private BigDecimal revenue;
    }

    /**
     * Top selling product summary.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductSummary {
        private Long productId;
        private String productName;
        private Long quantitySold;
        private BigDecimal revenue;
    }

    /**
     * Payment method breakdown.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodSummary {
        private String paymentMethod;
        private Long count;
        private BigDecimal amount;
    }
}

