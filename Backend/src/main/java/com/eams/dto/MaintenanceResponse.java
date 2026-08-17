package com.eams.dto;

import com.eams.model.Maintenance;
import com.eams.model.MaintenanceStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MaintenanceResponse {

    private Long id;
    private Long assetId;
    private String assetCode;
    private String assetName;
    private String title;
    private String description;
    private LocalDate scheduleDate;
    private String technician;
    private BigDecimal cost;
    private MaintenanceStatus status;
    private LocalDate completedDate;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MaintenanceResponse() {
    }

    public static MaintenanceResponse from(Maintenance m) {
        MaintenanceResponse r = new MaintenanceResponse();
        r.id = m.getId();
        r.assetId = m.getAsset().getId();
        r.assetCode = m.getAsset().getAssetCode();
        r.assetName = m.getAsset().getName();
        r.title = m.getTitle();
        r.description = m.getDescription();
        r.scheduleDate = m.getScheduleDate();
        r.technician = m.getTechnician();
        r.cost = m.getCost();
        r.status = m.getStatus();
        r.completedDate = m.getCompletedDate();
        r.createdBy = m.getCreatedBy();
        r.createdAt = m.getCreatedAt();
        r.updatedAt = m.getUpdatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }

    public String getAssetCode() {
        return assetCode;
    }

    public void setAssetCode(String assetCode) {
        this.assetCode = assetCode;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public String getTechnician() {
        return technician;
    }

    public void setTechnician(String technician) {
        this.technician = technician;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public MaintenanceStatus getStatus() {
        return status;
    }

    public void setStatus(MaintenanceStatus status) {
        this.status = status;
    }

    public LocalDate getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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
