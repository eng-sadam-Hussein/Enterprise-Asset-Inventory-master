package com.eams.repo;

import com.eams.model.Assignment;
import com.eams.model.AssignmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    @Query("SELECT a FROM Assignment a JOIN a.asset asset WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(a.employeeName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(a.department, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(asset.assetCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR a.status = :status)")
    Page<Assignment> search(
            @Param("search") String search,
            @Param("status") AssignmentStatus status,
            Pageable pageable);

    List<Assignment> findByAssetIdOrderByCreatedAtDesc(Long assetId);
}
