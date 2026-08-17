package com.eams.dto;

import com.eams.model.Asset;
import com.eams.model.AssetCategory;
import com.eams.model.AssetStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssetResponse {

    private Long id;
    private String assetCode;
    private String name;
    private String serialNumber;
    private AssetCategory category;
    private LocalDate purchaseDate;
    private BigDecimal purchaseCost;
    private LocalDate warrantyExpiry;
    private String location;
    private AssetStatus status;
    private String imageUrl;
    private String qrCodeData;
    private String barcodeData;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AssetResponse() {
    }

    public static AssetResponse from(Asset asset) {
        AssetResponse r = new AssetResponse();
        r.id = asset.getId();
        r.assetCode = asset.getAssetCode();
        r.name = asset.getName();
        r.serialNumber = asset.getSerialNumber();
        r.category = asset.getCategory();
        r.purchaseDate = asset.getPurchaseDate();
        r.purchaseCost = asset.getPurchaseCost();
        r.warrantyExpiry = asset.getWarrantyExpiry();
        r.location = asset.getLocation();
        r.status = asset.getStatus();
        r.imageUrl = asset.getImageUrl();
        r.qrCodeData = asset.getQrCodeData();
        r.barcodeData = asset.getBarcodeData();
        r.notes = asset.getNotes();
        r.createdAt = asset.getCreatedAt();
        r.updatedAt = asset.getUpdatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssetCode() {
        return assetCode;
    }

    public void setAssetCode(String assetCode) {
        this.assetCode = assetCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public AssetCategory getCategory() {
        return category;
    }

    public void setCategory(AssetCategory category) {
        this.category = category;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public BigDecimal getPurchaseCost() {
        return purchaseCost;
    }

    public void setPurchaseCost(BigDecimal purchaseCost) {
        this.purchaseCost = purchaseCost;
    }

    public LocalDate getWarrantyExpiry() {
        return warrantyExpiry;
    }

    public void setWarrantyExpiry(LocalDate warrantyExpiry) {
        this.warrantyExpiry = warrantyExpiry;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getQrCodeData() {
        return qrCodeData;
    }

    public void setQrCodeData(String qrCodeData) {
        this.qrCodeData = qrCodeData;
    }

    public String getBarcodeData() {
        return barcodeData;
    }

    public void setBarcodeData(String barcodeData) {
        this.barcodeData = barcodeData;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
