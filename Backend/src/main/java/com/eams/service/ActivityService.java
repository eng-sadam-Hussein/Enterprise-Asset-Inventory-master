package com.eams.service;

import com.eams.model.ActivityLog;
import com.eams.repo.ActivityLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public void log(String action, String entityType, Long entityId, String description, String username) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDescription(description);
        log.setUsername(username);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecent() {
        return activityLogRepository.findTop10ByOrderByCreatedAtDesc();
    }
}
