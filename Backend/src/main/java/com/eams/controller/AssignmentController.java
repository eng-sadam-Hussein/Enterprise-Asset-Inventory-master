package com.eams.controller;

import com.eams.dto.*;
import com.eams.model.AssignmentStatus;
import com.eams.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<AssignmentResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AssignmentStatus status) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(assignmentService.search(search, status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> create(@Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.create(request));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<AssignmentResponse> returnAssignment(
            @PathVariable Long id, @RequestBody(required = false) ReturnAssignmentRequest request) {
        if (request == null) {
            request = new ReturnAssignmentRequest();
        }
        return ResponseEntity.ok(assignmentService.returnAssignment(id, request));
    }

    @GetMapping("/asset/{assetId}/history")
    public ResponseEntity<List<AssignmentResponse>> history(@PathVariable Long assetId) {
        return ResponseEntity.ok(assignmentService.historyByAsset(assetId));
    }
}
