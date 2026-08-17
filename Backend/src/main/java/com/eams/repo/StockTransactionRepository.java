package com.eams.repo;

import com.eams.model.StockTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    Page<StockTransaction> findByStockItemIdOrderByCreatedAtDesc(Long stockItemId, Pageable pageable);
}
