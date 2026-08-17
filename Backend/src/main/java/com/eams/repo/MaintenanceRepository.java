package com.eams.repo;

import com.eams.model.Maintenance;
import com.eams.model.MaintenanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    @Query("SELECT m FROM Maintenance m JOIN m.asset asset WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(m.technician, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(asset.assetCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR m.status = :status)")
    Page<Maintenance> search(
            @Param("search") String search,
            @Param("status") MaintenanceStatus status,
            Pageable pageable);
}
