package com.eams.controller;

import com.eams.dto.MaintenanceRequestDto;
import com.eams.dto.MaintenanceResponse;
import com.eams.dto.MessageResponse;
import com.eams.dto.PageResponse;
import com.eams.model.MaintenanceStatus;
import com.eams.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<MaintenanceResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) MaintenanceStatus status) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(maintenanceService.search(search, status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getById(id));
    }

    @PostMapping
    public ResponseEntity<MaintenanceResponse> create(@Valid @RequestBody MaintenanceRequestDto request) {
        return ResponseEntity.ok(maintenanceService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> update(
            @PathVariable Long id, @Valid @RequestBody MaintenanceRequestDto request) {
        return ResponseEntity.ok(maintenanceService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MaintenanceResponse> updateStatus(
            @PathVariable Long id, @RequestParam MaintenanceStatus status) {
        return ResponseEntity.ok(maintenanceService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        maintenanceService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Maintenance record deleted successfully"));
    }
}
