package com.eams.repo;

import com.eams.model.StockItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface StockItemRepository extends JpaRepository<StockItem, Long> {
    Optional<StockItem> findBySku(String sku);
    boolean existsBySku(String sku);

    @Query("SELECT s FROM StockItem s WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(s.itemName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<StockItem> search(@Param("search") String search, Pageable pageable);

    @Query("SELECT s FROM StockItem s WHERE s.quantity <= s.minimumStock")
    List<StockItem> findLowStock();

    @Query("SELECT COUNT(s) FROM StockItem s WHERE s.quantity <= s.minimumStock")
    long countLowStock();
}
