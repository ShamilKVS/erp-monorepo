package com.erp.sales.controller;

import com.erp.auth.entity.User;
import com.erp.auth.repository.UserRepository;
import com.erp.common.dto.ApiResponse;
import com.erp.common.dto.PagedResponse;
import com.erp.sales.dto.SaleRequest;
import com.erp.sales.dto.SaleResponse;
import com.erp.sales.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * REST Controller for sales management.
 * Provides endpoints for creating and listing sales.
 */
@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
@Tag(name = "Sales", description = "Sales management APIs")
public class SaleController {

    private final SaleService saleService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create sale", description = "Create a new sale transaction")
    public ResponseEntity<ApiResponse<SaleResponse>> createSale(
            @Valid @RequestBody SaleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        SaleResponse sale = saleService.createSale(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sale created successfully", sale));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sale by ID", description = "Retrieve a sale by its ID")
    public ResponseEntity<ApiResponse<SaleResponse>> getSaleById(@PathVariable Long id) {
        SaleResponse sale = saleService.getSaleById(id);
        return ResponseEntity.ok(ApiResponse.success(sale));
    }

    @GetMapping("/number/{saleNumber}")
    @Operation(summary = "Get sale by number", description = "Retrieve a sale by its sale number")
    public ResponseEntity<ApiResponse<SaleResponse>> getSaleBySaleNumber(
            @PathVariable String saleNumber) {
        SaleResponse sale = saleService.getSaleBySaleNumber(saleNumber);
        return ResponseEntity.ok(ApiResponse.success(sale));
    }

    @GetMapping
    @Operation(summary = "Get all sales", description = "Retrieve all sales with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<SaleResponse>>> getAllSales(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "saleDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        Page<SaleResponse> sales = saleService.getAllSales(PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.from(sales)));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get sales by date range", description = "Retrieve sales within a date range")
    public ResponseEntity<ApiResponse<PagedResponse<SaleResponse>>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SaleResponse> sales = saleService.getSalesByDateRange(startDate, endDate, 
                PageRequest.of(page, size, Sort.by("saleDate").descending()));
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.from(sales)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel sale", description = "Cancel an existing sale")
    public ResponseEntity<ApiResponse<SaleResponse>> cancelSale(@PathVariable Long id) {
        SaleResponse sale = saleService.cancelSale(id);
        return ResponseEntity.ok(ApiResponse.success("Sale cancelled successfully", sale));
    }
}

