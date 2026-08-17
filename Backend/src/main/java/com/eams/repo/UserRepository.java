package com.eams.repo;

import com.eams.model.Role;
import com.eams.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long countByRole(Role role);

    @Query("""
            SELECT u FROM User u WHERE
            LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(COALESCE(u.department, '')) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<User> search(@Param("search") String search, Pageable pageable);

    @Query("""
            SELECT u FROM User u WHERE u.role = :role AND (
            LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(COALESCE(u.department, '')) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<User> searchByRole(@Param("search") String search, @Param("role") Role role, Pageable pageable);
}
