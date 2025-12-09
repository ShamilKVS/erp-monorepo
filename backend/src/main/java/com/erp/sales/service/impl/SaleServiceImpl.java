package com.erp.sales.service.impl;

import com.erp.auth.entity.User;
import com.erp.auth.repository.UserRepository;
import com.erp.common.exception.BadRequestException;
import com.erp.common.exception.ResourceNotFoundException;
import com.erp.product.entity.Product;
import com.erp.product.repository.ProductRepository;
import com.erp.sales.dto.SaleItemRequest;
import com.erp.sales.dto.SaleRequest;
import com.erp.sales.dto.SaleResponse;
import com.erp.sales.entity.Sale;
import com.erp.sales.entity.SaleItem;
import com.erp.sales.repository.SaleRepository;
import com.erp.sales.service.SaleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of SaleService.
 * Handles business logic for sales management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public SaleResponse createSale(SaleRequest request, Long userId) {
        log.info("Creating new sale for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Sale sale = Sale.builder()
                .saleNumber(generateSaleNumber())
                .user(user)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .paymentMethod(request.getPaymentMethod())
                .taxAmount(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO)
                .discountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO)
                .notes(request.getNotes())
                .saleDate(LocalDateTime.now())
                .status(Sale.SaleStatus.COMPLETED)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;

        for (SaleItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

            if (!product.getIsActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is not available");
            }

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            SaleItem saleItem = SaleItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .productSku(product.getSku())
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .discountPercent(itemRequest.getDiscountPercent() != null ? 
                            itemRequest.getDiscountPercent() : BigDecimal.ZERO)
                    .build();

            saleItem.calculateLineTotal();
            sale.addItem(saleItem);
            subtotal = subtotal.add(saleItem.getLineTotal());

            // Reduce stock
            product.reduceStock(itemRequest.getQuantity());
            productRepository.save(product);
        }

        sale.setSubtotal(subtotal);
        sale.setTotalAmount(subtotal.add(sale.getTaxAmount()).subtract(sale.getDiscountAmount()));

        Sale savedSale = saleRepository.save(sale);
        log.info("Sale created successfully with number: {}", savedSale.getSaleNumber());

        return SaleResponse.fromEntity(savedSale);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale", "id", id));
        return SaleResponse.fromEntity(sale);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse getSaleBySaleNumber(String saleNumber) {
        Sale sale = saleRepository.findBySaleNumber(saleNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Sale", "saleNumber", saleNumber));
        return SaleResponse.fromEntity(sale);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleResponse> getAllSales(Pageable pageable) {
        return saleRepository.findAll(pageable).map(SaleResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleResponse> getSalesByUserId(Long userId, Pageable pageable) {
        return saleRepository.findByUserId(userId, pageable).map(SaleResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> getSalesByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return saleRepository.findSalesBetweenDates(start, end).stream()
                .map(SaleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleResponse> getSalesByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return saleRepository.findSalesBetweenDates(start, end, pageable).map(SaleResponse::fromEntity);
    }

    @Override
    public SaleResponse cancelSale(Long id) {
        log.info("Cancelling sale with ID: {}", id);
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale", "id", id));

        if (sale.getStatus() == Sale.SaleStatus.CANCELLED) {
            throw new BadRequestException("Sale is already cancelled");
        }

        sale.setStatus(Sale.SaleStatus.CANCELLED);
        Sale savedSale = saleRepository.save(sale);
        log.info("Sale cancelled successfully with ID: {}", id);

        return SaleResponse.fromEntity(savedSale);
    }

    private String generateSaleNumber() {
        String prefix = "SL" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String lastNumber = saleRepository.findLastSaleNumber().orElse(prefix + "0000");
        int sequence = 1;
        if (lastNumber.startsWith(prefix)) {
            sequence = Integer.parseInt(lastNumber.substring(prefix.length())) + 1;
        }
        return prefix + String.format("%04d", sequence);
    }
}

