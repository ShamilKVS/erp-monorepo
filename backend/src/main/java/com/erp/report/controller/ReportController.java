package com.erp.report.controller;

import com.erp.common.dto.ApiResponse;
import com.erp.report.dto.SalesReportSummary;
import com.erp.report.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * REST Controller for report generation.
 * Provides endpoints for generating and downloading reports.
 */
@RestController
@RequestMapping("/reports/sales")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Report generation APIs")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    @Operation(summary = "Get sales summary", description = "Generate sales report summary for date range")
    public ResponseEntity<ApiResponse<SalesReportSummary>> getSalesReportSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        SalesReportSummary summary = reportService.generateSalesReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/download/csv")
    @Operation(summary = "Download CSV report", description = "Download sales report as CSV file")
    public ResponseEntity<byte[]> downloadSalesCsvReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        byte[] csvContent = reportService.generateSalesCsvReport(startDate, endDate);
        String filename = String.format("sales_report_%s_%s.csv",
                startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
                endDate.format(DateTimeFormatter.BASIC_ISO_DATE));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvContent);
    }

    @GetMapping("/download/pdf")
    @Operation(summary = "Download PDF report", description = "Download sales report as PDF file")
    public ResponseEntity<byte[]> downloadSalesPdfReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        byte[] pdfContent = reportService.generateSalesPdfReport(startDate, endDate);
        String filename = String.format("sales_report_%s_%s.pdf",
                startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
                endDate.format(DateTimeFormatter.BASIC_ISO_DATE));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

}

