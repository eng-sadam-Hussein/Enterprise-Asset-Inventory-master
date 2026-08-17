package com.eams.service;

import com.eams.dto.MaintenanceRequestDto;
import com.eams.dto.MaintenanceResponse;
import com.eams.dto.PageResponse;
import com.eams.exception.ResourceNotFoundException;
import com.eams.model.Asset;
import com.eams.model.AssetStatus;
import com.eams.model.Maintenance;
import com.eams.model.MaintenanceStatus;
import com.eams.repo.MaintenanceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final AssetService assetService;
    private final ActivityService activityService;

    public MaintenanceService(MaintenanceRepository maintenanceRepository,
                              AssetService assetService,
                              ActivityService activityService) {
        this.maintenanceRepository = maintenanceRepository;
        this.assetService = assetService;
        this.activityService = activityService;
    }

    public PageResponse<MaintenanceResponse> search(String search, MaintenanceStatus status, Pageable pageable) {
        Page<Maintenance> page = maintenanceRepository.search(search, status, pageable);
        return new PageResponse<>(
                page.getContent().stream().map(MaintenanceResponse::from).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    public MaintenanceResponse getById(Long id) {
        return MaintenanceResponse.from(findMaintenance(id));
    }

    @Transactional
    public MaintenanceResponse create(MaintenanceRequestDto request) {
        Asset asset = assetService.findAsset(request.getAssetId());
        Maintenance m = new Maintenance();
        m.setAsset(asset);
        m.setTitle(request.getTitle());
        m.setDescription(request.getDescription());
        m.setScheduleDate(request.getScheduleDate());
        m.setTechnician(request.getTechnician());
        m.setCost(request.getCost());
        m.setStatus(request.getStatus() != null ? request.getStatus() : MaintenanceStatus.SCHEDULED);
        m.setCreatedBy(currentUsername());
        m = maintenanceRepository.save(m);

        if (m.getStatus() == MaintenanceStatus.IN_PROGRESS) {
            asset.setStatus(AssetStatus.UNDER_MAINTENANCE);
        }

        activityService.log("CREATE", "Maintenance", m.getId(),
                "Created maintenance: " + m.getTitle(), currentUsername());
        return MaintenanceResponse.from(m);
    }

    @Transactional
    public MaintenanceResponse update(Long id, MaintenanceRequestDto request) {
        Maintenance m = findMaintenance(id);
        Asset asset = assetService.findAsset(request.getAssetId());
        m.setAsset(asset);
        m.setTitle(request.getTitle());
        m.setDescription(request.getDescription());
        m.setScheduleDate(request.getScheduleDate());
        m.setTechnician(request.getTechnician());
        m.setCost(request.getCost());
        if (request.getStatus() != null) {
            m.setStatus(request.getStatus());
            applyStatusSideEffects(m, asset);
        }
        m = maintenanceRepository.save(m);
        activityService.log("UPDATE", "Maintenance", m.getId(),
                "Updated maintenance: " + m.getTitle(), currentUsername());
        return MaintenanceResponse.from(m);
    }

    @Transactional
    public MaintenanceResponse updateStatus(Long id, MaintenanceStatus status) {
        Maintenance m = findMaintenance(id);
        m.setStatus(status);
        applyStatusSideEffects(m, m.getAsset());
        m = maintenanceRepository.save(m);
        activityService.log("UPDATE", "Maintenance", m.getId(),
                "Status changed to " + status, currentUsername());
        return MaintenanceResponse.from(m);
    }

    @Transactional
    public void delete(Long id) {
        Maintenance m = findMaintenance(id);
        String title = m.getTitle();
        maintenanceRepository.delete(m);
        activityService.log("DELETE", "Maintenance", id, "Deleted maintenance: " + title, currentUsername());
    }

    private void applyStatusSideEffects(Maintenance m, Asset asset) {
        if (m.getStatus() == MaintenanceStatus.IN_PROGRESS) {
            asset.setStatus(AssetStatus.UNDER_MAINTENANCE);
        } else if (m.getStatus() == MaintenanceStatus.COMPLETED) {
            m.setCompletedDate(LocalDate.now());
            if (asset.getStatus() != AssetStatus.ASSIGNED) {
                asset.setStatus(AssetStatus.AVAILABLE);
            }
        }
    }

    private Maintenance findMaintenance(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with id: " + id));
    }

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "system";
        }
        return auth.getName();
    }
}
