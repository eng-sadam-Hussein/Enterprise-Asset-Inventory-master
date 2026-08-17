package com.eams.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardStats {

    private long totalAssets;
    private long availableAssets;
    private long assignedAssets;
    private long underMaintenance;
    private long totalInventoryItems;
    private long lowStockItems;
    private List<ActivityResponse> recentActivities = new ArrayList<>();

    public DashboardStats() {
    }

    public long getTotalAssets() {
        return totalAssets;
    }

    public void setTotalAssets(long totalAssets) {
        this.totalAssets = totalAssets;
    }

    public long getAvailableAssets() {
        return availableAssets;
    }

    public void setAvailableAssets(long availableAssets) {
        this.availableAssets = availableAssets;
    }

    public long getAssignedAssets() {
        return assignedAssets;
    }

    public void setAssignedAssets(long assignedAssets) {
        this.assignedAssets = assignedAssets;
    }

    public long getUnderMaintenance() {
        return underMaintenance;
    }

    public void setUnderMaintenance(long underMaintenance) {
        this.underMaintenance = underMaintenance;
    }

    public long getTotalInventoryItems() {
        return totalInventoryItems;
    }

    public void setTotalInventoryItems(long totalInventoryItems) {
        this.totalInventoryItems = totalInventoryItems;
    }

    public long getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(long lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public List<ActivityResponse> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ActivityResponse> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
