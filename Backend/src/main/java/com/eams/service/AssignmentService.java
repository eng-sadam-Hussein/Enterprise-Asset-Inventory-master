package com.eams.service;

import com.eams.dto.*;
import com.eams.exception.BadRequestException;
import com.eams.exception.ResourceNotFoundException;
import com.eams.model.*;
import com.eams.repo.AssignmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssetService assetService;
    private final ActivityService activityService;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             AssetService assetService,
                             ActivityService activityService) {
        this.assignmentRepository = assignmentRepository;
        this.assetService = assetService;
        this.activityService = activityService;
    }

    public PageResponse<AssignmentResponse> search(String search, AssignmentStatus status, Pageable pageable) {
        Page<Assignment> page = assignmentRepository.search(search, status, pageable);
        return new PageResponse<>(
                page.getContent().stream().map(AssignmentResponse::from).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    public AssignmentResponse getById(Long id) {
        return AssignmentResponse.from(findAssignment(id));
    }

    @Transactional
    public AssignmentResponse create(AssignmentRequest request) {
        Asset asset = assetService.findAsset(request.getAssetId());
        if (asset.getStatus() == AssetStatus.ASSIGNED) {
            throw new BadRequestException("Asset is already assigned");
        }
        if (asset.getStatus() == AssetStatus.RETIRED) {
            throw new BadRequestException("Cannot assign a retired asset");
        }

        Assignment assignment = new Assignment();
        assignment.setAsset(asset);
        assignment.setEmployeeName(request.getEmployeeName());
        assignment.setDepartment(request.getDepartment());
        assignment.setAssignmentDate(request.getAssignmentDate() != null ? request.getAssignmentDate() : LocalDate.now());
        assignment.setStatus(AssignmentStatus.ACTIVE);
        assignment.setNotes(request.getNotes());
        assignment.setAssignedBy(currentUsername());
        assignment = assignmentRepository.save(assignment);

        asset.setStatus(AssetStatus.ASSIGNED);

        activityService.log("CREATE", "Assignment", assignment.getId(),
                "Assigned " + asset.getAssetCode() + " to " + request.getEmployeeName(), currentUsername());
        return AssignmentResponse.from(assignment);
    }

    @Transactional
    public AssignmentResponse returnAssignment(Long id, ReturnAssignmentRequest request) {
        Assignment assignment = findAssignment(id);
        if (assignment.getStatus() == AssignmentStatus.RETURNED) {
            throw new BadRequestException("Assignment already returned");
        }
        assignment.setStatus(AssignmentStatus.RETURNED);
        assignment.setReturnDate(request.getReturnDate() != null ? request.getReturnDate() : LocalDate.now());
        if (request.getNotes() != null) {
            assignment.setNotes(request.getNotes());
        }
        assignment = assignmentRepository.save(assignment);

        Asset asset = assignment.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);

        activityService.log("UPDATE", "Assignment", assignment.getId(),
                "Returned " + asset.getAssetCode(), currentUsername());
        return AssignmentResponse.from(assignment);
    }

    public List<AssignmentResponse> historyByAsset(Long assetId) {
        assetService.findAsset(assetId);
        return assignmentRepository.findByAssetIdOrderByCreatedAtDesc(assetId).stream()
                .map(AssignmentResponse::from)
                .collect(Collectors.toList());
    }

    private Assignment findAssignment(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
    }

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "system";
        }
        return auth.getName();
    }
}
