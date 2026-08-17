package com.eams.dto;

import com.eams.model.Assignment;
import com.eams.model.AssignmentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssignmentResponse {

    private Long id;
    private Long assetId;
    private String assetCode;
    private String assetName;
    private String employeeName;
    private String department;
    private LocalDate assignmentDate;
    private LocalDate returnDate;
    private AssignmentStatus status;
    private String notes;
    private String assignedBy;
    private LocalDateTime createdAt;

    public AssignmentResponse() {
    }

    public static AssignmentResponse from(Assignment a) {
        AssignmentResponse r = new AssignmentResponse();
        r.id = a.getId();
        r.assetId = a.getAsset().getId();
        r.assetCode = a.getAsset().getAssetCode();
        r.assetName = a.getAsset().getName();
        r.employeeName = a.getEmployeeName();
        r.department = a.getDepartment();
        r.assignmentDate = a.getAssignmentDate();
        r.returnDate = a.getReturnDate();
        r.status = a.getStatus();
        r.notes = a.getNotes();
        r.assignedBy = a.getAssignedBy();
        r.createdAt = a.getCreatedAt();
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

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDate getAssignmentDate() {
        return assignmentDate;
    }

    public void setAssignmentDate(LocalDate assignmentDate) {
        this.assignmentDate = assignmentDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public AssignmentStatus getStatus() {
        return status;
    }

    public void setStatus(AssignmentStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
