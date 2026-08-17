package com.eams.dto;

import com.eams.model.StockTxnType;
import com.eams.model.StockTransaction;
import java.time.LocalDateTime;

public class StockTransactionResponse {

    private Long id;
    private Long stockItemId;
    private String itemName;
    private String sku;
    private StockTxnType type;
    private Integer quantity;
    private String reason;
    private String performedBy;
    private LocalDateTime createdAt;

    public StockTransactionResponse() {
    }

    public static StockTransactionResponse from(StockTransaction txn) {
        StockTransactionResponse r = new StockTransactionResponse();
        r.id = txn.getId();
        r.stockItemId = txn.getStockItem().getId();
        r.itemName = txn.getStockItem().getItemName();
        r.sku = txn.getStockItem().getSku();
        r.type = txn.getType();
        r.quantity = txn.getQuantity();
        r.reason = txn.getReason();
        r.performedBy = txn.getPerformedBy();
        r.createdAt = txn.getCreatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStockItemId() {
        return stockItemId;
    }

    public void setStockItemId(Long stockItemId) {
        this.stockItemId = stockItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public StockTxnType getType() {
        return type;
    }

    public void setType(StockTxnType type) {
        this.type = type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
