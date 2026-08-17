package com.eams.service;

import com.eams.dto.*;
import com.eams.exception.BadRequestException;
import com.eams.exception.ConflictException;
import com.eams.exception.ResourceNotFoundException;
import com.eams.model.Role;
import com.eams.model.User;
import com.eams.repo.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityService activityService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ActivityService activityService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityService = activityService;
    }

    public PageResponse<UserResponse> search(String search, String role, Pageable pageable) {
        String q = search == null ? "" : search.trim();
        Role roleFilter = null;
        if (role != null && !role.isBlank()) {
            roleFilter = parseRole(role);
        }

        Page<User> page;
        if (roleFilter != null) {
            page = userRepository.searchByRole(q, roleFilter, pageable);
        } else {
            page = userRepository.search(q, pageable);
        }

        return new PageResponse<>(
                page.getContent().stream().map(UserResponse::from).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    public UserResponse getById(Long id) {
        return UserResponse.from(findUser(id));
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new ConflictException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setDepartment(blankToNull(request.getDepartment()));
        user.setProfileImage(blankToNull(request.getProfileImage()));
        user.setRole(parseRole(request.getRole()));

        user = userRepository.save(user);
        activityService.log("CREATE", "USER", user.getId(),
                "Created user: " + user.getUsername(), currentUsername());
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = findUser(id);
        String email = request.getEmail().trim().toLowerCase();

        if (!user.getEmail().equalsIgnoreCase(email) && userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }

        Role newRole = parseRole(request.getRole());
        if (user.getRole() == Role.ADMIN && newRole != Role.ADMIN) {
            ensureNotLastAdmin(user.getId());
        }

        user.setEmail(email);
        user.setFullName(request.getFullName().trim());
        user.setDepartment(blankToNull(request.getDepartment()));
        user.setProfileImage(blankToNull(request.getProfileImage()));
        user.setRole(newRole);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);
        activityService.log("UPDATE", "USER", user.getId(),
                "Updated user: " + user.getUsername(), currentUsername());
        return UserResponse.from(user);
    }

    @Transactional
    public void delete(Long id) {
        User user = findUser(id);

        if (user.getUsername().equals(currentUsername())) {
            throw new BadRequestException("You cannot delete your own account");
        }
        if (user.getRole() == Role.ADMIN) {
            ensureNotLastAdmin(user.getId());
        }

        userRepository.delete(user);
        activityService.log("DELETE", "USER", id,
                "Deleted user: " + user.getUsername(), currentUsername());
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    private void ensureNotLastAdmin(Long excludeId) {
        long adminCount = userRepository.countByRole(Role.ADMIN);
        if (adminCount <= 1) {
            throw new BadRequestException("Cannot remove or demote the last admin user");
        }
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid role. Use ADMIN or USER");
        }
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return "system";
        }
        return auth.getName();
    }
}
