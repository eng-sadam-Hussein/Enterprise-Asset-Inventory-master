package com.eams.dto;

import com.eams.model.ActivityLog;
import java.time.LocalDateTime;

public class ActivityResponse {

    private Long id;
    private String action;
    private String entityType;
    private Long entityId;
    private String description;
    private String username;
    private LocalDateTime createdAt;

    public ActivityResponse() {
    }

    public static ActivityResponse from(ActivityLog log) {
        ActivityResponse r = new ActivityResponse();
        r.id = log.getId();
        r.action = log.getAction();
        r.entityType = log.getEntityType();
        r.entityId = log.getEntityId();
        r.description = log.getDescription();
        r.username = log.getUsername();
        r.createdAt = log.getCreatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
