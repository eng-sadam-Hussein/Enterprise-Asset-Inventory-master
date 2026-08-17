package com.eams.service;

import com.eams.dto.ActivityResponse;
import com.eams.dto.DashboardStats;
import com.eams.model.AssetStatus;
import com.eams.repo.AssetRepository;
import com.eams.repo.StockItemRepository;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AssetRepository assetRepository;
    private final StockItemRepository stockItemRepository;
    private final ActivityService activityService;

    public DashboardService(AssetRepository assetRepository,
                            StockItemRepository stockItemRepository,
                            ActivityService activityService) {
        this.assetRepository = assetRepository;
        this.stockItemRepository = stockItemRepository;
        this.activityService = activityService;
    }

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalAssets(assetRepository.count());
        stats.setAvailableAssets(assetRepository.countByStatus(AssetStatus.AVAILABLE));
        stats.setAssignedAssets(assetRepository.countByStatus(AssetStatus.ASSIGNED));
        stats.setUnderMaintenance(assetRepository.countByStatus(AssetStatus.UNDER_MAINTENANCE));
        stats.setTotalInventoryItems(stockItemRepository.count());
        stats.setLowStockItems(stockItemRepository.countLowStock());
        stats.setRecentActivities(
                activityService.getRecent().stream()
                        .map(ActivityResponse::from)
                        .collect(Collectors.toList())
        );
        return stats;
    }
}
