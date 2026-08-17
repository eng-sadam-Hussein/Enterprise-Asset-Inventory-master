package com.eams.service;

import com.eams.dto.*;
import com.eams.exception.BadRequestException;
import com.eams.exception.ConflictException;
import com.eams.exception.ResourceNotFoundException;
import com.eams.model.StockItem;
import com.eams.model.StockTransaction;
import com.eams.model.StockTxnType;
import com.eams.repo.StockItemRepository;
import com.eams.repo.StockTransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final StockItemRepository stockItemRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final ActivityService activityService;

    public StockService(StockItemRepository stockItemRepository,
                        StockTransactionRepository stockTransactionRepository,
                        ActivityService activityService) {
        this.stockItemRepository = stockItemRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.activityService = activityService;
    }

    public PageResponse<StockItemResponse> search(String search, Pageable pageable) {
        Page<StockItem> page = stockItemRepository.search(search, pageable);
        return toPageResponse(page);
    }

    public StockItemResponse getById(Long id) {
        return StockItemResponse.from(findItem(id));
    }

    @Transactional
    public StockItemResponse create(StockItemRequest request) {
        if (stockItemRepository.existsBySku(request.getSku())) {
            throw new ConflictException("SKU already exists: " + request.getSku());
        }
        StockItem item = new StockItem();
        applyRequest(item, request);
        item = stockItemRepository.save(item);
        activityService.log("CREATE", "StockItem", item.getId(), "Created stock item " + item.getSku(), currentUsername());
        return StockItemResponse.from(item);
    }

    @Transactional
    public StockItemResponse update(Long id, StockItemRequest request) {
        StockItem item = findItem(id);
        if (!item.getSku().equals(request.getSku()) && stockItemRepository.existsBySku(request.getSku())) {
            throw new ConflictException("SKU already exists: " + request.getSku());
        }
        applyRequest(item, request);
        item = stockItemRepository.save(item);
        activityService.log("UPDATE", "StockItem", item.getId(), "Updated stock item " + item.getSku(), currentUsername());
        return StockItemResponse.from(item);
    }

    @Transactional
    public void delete(Long id) {
        StockItem item = findItem(id);
        String sku = item.getSku();
        stockItemRepository.delete(item);
        activityService.log("DELETE", "StockItem", id, "Deleted stock item " + sku, currentUsername());
    }

    @Transactional
    public StockTransactionResponse stockIn(Long id, StockMovementRequest request) {
        StockItem item = findItem(id);
        item.setQuantity(item.getQuantity() + request.getQuantity());
        stockItemRepository.save(item);

        StockTransaction txn = new StockTransaction();
        txn.setStockItem(item);
        txn.setType(StockTxnType.IN);
        txn.setQuantity(request.getQuantity());
        txn.setReason(request.getReason());
        txn.setPerformedBy(currentUsername());
        txn = stockTransactionRepository.save(txn);

        activityService.log("STOCK_IN", "StockItem", item.getId(),
                "Stock in " + request.getQuantity() + " for " + item.getSku(), currentUsername());
        return StockTransactionResponse.from(txn);
    }

    @Transactional
    public StockTransactionResponse stockOut(Long id, StockMovementRequest request) {
        StockItem item = findItem(id);
        int newQty = item.getQuantity() - request.getQuantity();
        if (newQty < 0) {
            throw new BadRequestException("Insufficient stock. Available: " + item.getQuantity());
        }
        item.setQuantity(newQty);
        stockItemRepository.save(item);

        StockTransaction txn = new StockTransaction();
        txn.setStockItem(item);
        txn.setType(StockTxnType.OUT);
        txn.setQuantity(request.getQuantity());
        txn.setReason(request.getReason());
        txn.setPerformedBy(currentUsername());
        txn = stockTransactionRepository.save(txn);

        activityService.log("STOCK_OUT", "StockItem", item.getId(),
                "Stock out " + request.getQuantity() + " for " + item.getSku(), currentUsername());
        return StockTransactionResponse.from(txn);
    }

    public List<StockItemResponse> getLowStock() {
        return stockItemRepository.findLowStock().stream()
                .map(StockItemResponse::from)
                .collect(Collectors.toList());
    }

    public PageResponse<StockTransactionResponse> getTransactions(Long id, Pageable pageable) {
        findItem(id);
        Page<StockTransaction> page = stockTransactionRepository.findByStockItemIdOrderByCreatedAtDesc(id, pageable);
        return new PageResponse<>(
                page.getContent().stream().map(StockTransactionResponse::from).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    private StockItem findItem(Long id) {
        return stockItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found with id: " + id));
    }

    private void applyRequest(StockItem item, StockItemRequest request) {
        item.setItemName(request.getItemName());
        item.setSku(request.getSku());
        item.setQuantity(request.getQuantity());
        item.setMinimumStock(request.getMinimumStock());
        item.setLocation(request.getLocation());
        item.setDescription(request.getDescription());
    }

    private PageResponse<StockItemResponse> toPageResponse(Page<StockItem> page) {
        return new PageResponse<>(
                page.getContent().stream().map(StockItemResponse::from).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "system";
        }
        return auth.getName();
    }
}
