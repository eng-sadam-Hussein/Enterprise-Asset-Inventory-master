package com.eams.controller;

import com.eams.dto.*;
import com.eams.service.StockService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<StockItemResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(stockService.search(search, pageable));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<StockItemResponse>> lowStock() {
        return ResponseEntity.ok(stockService.getLowStock());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getById(id));
    }

    @PostMapping
    public ResponseEntity<StockItemResponse> create(@Valid @RequestBody StockItemRequest request) {
        return ResponseEntity.ok(stockService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockItemResponse> update(@PathVariable Long id, @Valid @RequestBody StockItemRequest request) {
        return ResponseEntity.ok(stockService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        stockService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Stock item deleted successfully"));
    }

    @PostMapping("/{id}/stock-in")
    public ResponseEntity<StockTransactionResponse> stockIn(
            @PathVariable Long id, @Valid @RequestBody StockMovementRequest request) {
        return ResponseEntity.ok(stockService.stockIn(id, request));
    }

    @PostMapping("/{id}/stock-out")
    public ResponseEntity<StockTransactionResponse> stockOut(
            @PathVariable Long id, @Valid @RequestBody StockMovementRequest request) {
        return ResponseEntity.ok(stockService.stockOut(id, request));
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<PageResponse<StockTransactionResponse>> transactions(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(stockService.getTransactions(id, pageable));
    }
}
