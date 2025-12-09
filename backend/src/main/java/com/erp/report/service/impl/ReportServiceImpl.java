package com.erp.report.service.impl;

import com.erp.report.dto.SalesReportSummary;
import com.erp.report.service.ReportService;
import com.erp.sales.entity.Sale;
import com.erp.sales.repository.SaleRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of ReportService.
 * Handles report generation logic.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final SaleRepository saleRepository;

    @Override
    public SalesReportSummary generateSalesReport(LocalDate startDate, LocalDate endDate) {
        log.info("Generating sales report from {} to {}", startDate, endDate);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        List<Sale> sales = saleRepository.findSalesBetweenDates(start, end);
        List<Sale> completedSales = sales.stream()
                .filter(s -> s.getStatus() == Sale.SaleStatus.COMPLETED)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = completedSales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTax = completedSales.stream()
                .map(Sale::getTaxAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDiscount = completedSales.stream()
                .map(Sale::getDiscountAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgSale = completedSales.isEmpty() ? BigDecimal.ZERO :
                totalRevenue.divide(BigDecimal.valueOf(completedSales.size()), 2, RoundingMode.HALF_UP);

        // Daily summary
        List<SalesReportSummary.DailySalesSummary> dailySummary = buildDailySummary(completedSales);

        // Top products
        List<SalesReportSummary.TopProductSummary> topProducts = buildTopProducts(completedSales);

        // Payment method breakdown
        List<SalesReportSummary.PaymentMethodSummary> paymentBreakdown = buildPaymentBreakdown(completedSales);

        return SalesReportSummary.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalSales((long) completedSales.size())
                .totalRevenue(totalRevenue)
                .totalTax(totalTax)
                .totalDiscount(totalDiscount)
                .averageSaleAmount(avgSale)
                .dailySummary(dailySummary)
                .topProducts(topProducts)
                .paymentMethodBreakdown(paymentBreakdown)
                .build();
    }

    @Override
    public byte[] generateSalesCsvReport(LocalDate startDate, LocalDate endDate) {
        log.info("Generating CSV report from {} to {}", startDate, endDate);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        List<Sale> sales = saleRepository.findSalesBetweenDates(start, end);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("Sale Number,Date,Customer,Items,Subtotal,Tax,Discount,Total,Payment Method,Status");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (Sale sale : sales) {
            writer.printf("%s,%s,%s,%d,%.2f,%.2f,%.2f,%.2f,%s,%s%n",
                    sale.getSaleNumber(),
                    sale.getSaleDate().format(formatter),
                    sale.getCustomerName() != null ? sale.getCustomerName() : "N/A",
                    sale.getItems().size(),
                    sale.getSubtotal(),
                    sale.getTaxAmount(),
                    sale.getDiscountAmount(),
                    sale.getTotalAmount(),
                    sale.getPaymentMethod(),
                    sale.getStatus());
        }

        writer.flush();
        return out.toByteArray();
    }

    @Override
    public byte[] generateSalesPdfReport(LocalDate startDate, LocalDate endDate) {
        log.info("Generating PDF report from {} to {}", startDate, endDate);
        SalesReportSummary summary = generateSalesReport(startDate, endDate);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(out);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {

            // Title
            Paragraph title = new Paragraph("SALES REPORT")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            // Period
            Paragraph period = new Paragraph(String.format("Period: %s to %s", startDate, endDate))
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(period);

            document.add(new Paragraph("\n"));

            // Summary Table
            Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                    .setWidth(UnitValue.createPercentValue(60))
                    .setMarginBottom(20);

            addSummaryRow(summaryTable, "Total Sales", String.valueOf(summary.getTotalSales()));
            addSummaryRow(summaryTable, "Total Revenue", String.format("$%.2f", summary.getTotalRevenue()));
            addSummaryRow(summaryTable, "Total Tax", String.format("$%.2f", summary.getTotalTax()));
            addSummaryRow(summaryTable, "Total Discount", String.format("$%.2f", summary.getTotalDiscount()));
            addSummaryRow(summaryTable, "Average Sale", String.format("$%.2f", summary.getAverageSaleAmount()));

            document.add(summaryTable);

            // Daily Summary Section
            if (summary.getDailySummary() != null && !summary.getDailySummary().isEmpty()) {
                document.add(new Paragraph("Daily Summary").setFontSize(14).setBold());

                Table dailyTable = new Table(UnitValue.createPercentArray(new float[]{2, 1, 2}))
                        .setWidth(UnitValue.createPercentValue(100));

                addTableHeader(dailyTable, "Date", "Sales Count", "Revenue");

                for (SalesReportSummary.DailySalesSummary daily : summary.getDailySummary()) {
                    dailyTable.addCell(new Cell().add(new Paragraph(daily.getDate().toString())));
                    dailyTable.addCell(new Cell().add(new Paragraph(String.valueOf(daily.getSalesCount()))));
                    dailyTable.addCell(new Cell().add(new Paragraph(String.format("$%.2f", daily.getRevenue()))));
                }

                document.add(dailyTable);
                document.add(new Paragraph("\n"));
            }

            // Top Products Section
            if (summary.getTopProducts() != null && !summary.getTopProducts().isEmpty()) {
                document.add(new Paragraph("Top Products").setFontSize(14).setBold());

                Table productsTable = new Table(UnitValue.createPercentArray(new float[]{3, 1, 2}))
                        .setWidth(UnitValue.createPercentValue(100));

                addTableHeader(productsTable, "Product", "Qty Sold", "Revenue");

                for (SalesReportSummary.TopProductSummary product : summary.getTopProducts()) {
                    productsTable.addCell(new Cell().add(new Paragraph(product.getProductName())));
                    productsTable.addCell(new Cell().add(new Paragraph(String.valueOf(product.getQuantitySold()))));
                    productsTable.addCell(new Cell().add(new Paragraph(String.format("$%.2f", product.getRevenue()))));
                }

                document.add(productsTable);
                document.add(new Paragraph("\n"));
            }

            // Payment Method Breakdown
            if (summary.getPaymentMethodBreakdown() != null && !summary.getPaymentMethodBreakdown().isEmpty()) {
                document.add(new Paragraph("Payment Method Breakdown").setFontSize(14).setBold());

                Table paymentTable = new Table(UnitValue.createPercentArray(new float[]{2, 1, 2}))
                        .setWidth(UnitValue.createPercentValue(100));

                addTableHeader(paymentTable, "Payment Method", "Count", "Amount");

                for (SalesReportSummary.PaymentMethodSummary payment : summary.getPaymentMethodBreakdown()) {
                    paymentTable.addCell(new Cell().add(new Paragraph(payment.getPaymentMethod())));
                    paymentTable.addCell(new Cell().add(new Paragraph(String.valueOf(payment.getCount()))));
                    paymentTable.addCell(new Cell().add(new Paragraph(String.format("$%.2f", payment.getAmount()))));
                }

                document.add(paymentTable);
            }

        } catch (Exception e) {
            log.error("Error generating PDF report", e);
            throw new RuntimeException("Failed to generate PDF report", e);
        }

        return out.toByteArray();
    }

    private void addSummaryRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()));
        table.addCell(new Cell().add(new Paragraph(value)));
    }

    private void addTableHeader(Table table, String... headers) {
        for (String header : headers) {
            Cell cell = new Cell()
                    .add(new Paragraph(header).setBold())
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY);
            table.addHeaderCell(cell);
        }
    }

    private List<SalesReportSummary.DailySalesSummary> buildDailySummary(List<Sale> sales) {
        Map<LocalDate, List<Sale>> salesByDate = sales.stream()
                .collect(Collectors.groupingBy(s -> s.getSaleDate().toLocalDate()));

        return salesByDate.entrySet().stream()
                .map(entry -> SalesReportSummary.DailySalesSummary.builder()
                        .date(entry.getKey())
                        .salesCount((long) entry.getValue().size())
                        .revenue(entry.getValue().stream()
                                .map(Sale::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add))
                        .build())
                .sorted(Comparator.comparing(SalesReportSummary.DailySalesSummary::getDate))
                .collect(Collectors.toList());
    }

    private List<SalesReportSummary.TopProductSummary> buildTopProducts(List<Sale> sales) {
        Map<Long, SalesReportSummary.TopProductSummary> productMap = new HashMap<>();

        sales.forEach(sale -> sale.getItems().forEach(item -> {
            Long productId = item.getProduct().getId();
            SalesReportSummary.TopProductSummary existing = productMap.get(productId);
            if (existing == null) {
                productMap.put(productId, SalesReportSummary.TopProductSummary.builder()
                        .productId(productId)
                        .productName(item.getProductName())
                        .quantitySold((long) item.getQuantity())
                        .revenue(item.getLineTotal())
                        .build());
            } else {
                existing.setQuantitySold(existing.getQuantitySold() + item.getQuantity());
                existing.setRevenue(existing.getRevenue().add(item.getLineTotal()));
            }
        }));

        return productMap.values().stream()
                .sorted((a, b) -> b.getQuantitySold().compareTo(a.getQuantitySold()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<SalesReportSummary.PaymentMethodSummary> buildPaymentBreakdown(List<Sale> sales) {
        return sales.stream()
                .collect(Collectors.groupingBy(Sale::getPaymentMethod))
                .entrySet().stream()
                .map(entry -> SalesReportSummary.PaymentMethodSummary.builder()
                        .paymentMethod(entry.getKey().name())
                        .count((long) entry.getValue().size())
                        .amount(entry.getValue().stream()
                                .map(Sale::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add))
                        .build())
                .collect(Collectors.toList());
    }
}

