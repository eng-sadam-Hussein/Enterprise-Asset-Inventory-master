package com.eams.repo;

import com.eams.model.Asset;
import com.eams.model.AssetCategory;
import com.eams.model.AssetStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetCode(String assetCode);
    long countByStatus(AssetStatus status);

    @Query("SELECT a FROM Asset a WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.assetCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(a.serialNumber, '')) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:category IS NULL OR a.category = :category)")
    Page<Asset> search(
            @Param("search") String search,
            @Param("status") AssetStatus status,
            @Param("category") AssetCategory category,
            Pageable pageable);
}
