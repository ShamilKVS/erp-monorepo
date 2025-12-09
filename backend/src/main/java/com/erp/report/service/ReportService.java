package com.erp.report.service;

import com.erp.report.dto.SalesReportSummary;

import java.time.LocalDate;

/**
 * Service interface for report generation.
 * Defines operations for generating various reports.
 */
public interface ReportService {

    /**
     * Generates a sales report summary for the given date range.
     *
     * @param startDate Start date of the report period
     * @param endDate   End date of the report period
     * @return Sales report summary
     */
    SalesReportSummary generateSalesReport(LocalDate startDate, LocalDate endDate);

    /**
     * Generates a CSV report for sales within the date range.
     *
     * @param startDate Start date of the report period
     * @param endDate   End date of the report period
     * @return CSV content as byte array
     */
    byte[] generateSalesCsvReport(LocalDate startDate, LocalDate endDate);

    /**
     * Generates a PDF report for sales within the date range.
     *
     * @param startDate Start date of the report period
     * @param endDate   End date of the report period
     * @return PDF content as byte array
     */
    byte[] generateSalesPdfReport(LocalDate startDate, LocalDate endDate);
}

