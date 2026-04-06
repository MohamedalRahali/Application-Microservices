package com.foodexpress.user.service;

import com.foodexpress.user.dto.UserRegistrationRequest;
import com.foodexpress.user.dto.UserResponse;
import com.foodexpress.user.model.User;
import com.foodexpress.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    /**
     * Register a new user and sync with database
     */
    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request, String keycloakId) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        // Create and save user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .zipCode(request.getZipCode())
                .keycloakId(keycloakId)
                .role(request.getRole())
                .status(User.UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered: {} with Keycloak ID: {}", savedUser.getUsername(), keycloakId);

        return UserResponse.fromEntity(savedUser);
    }

    /**
     * Get user by ID
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        return UserResponse.fromEntity(user);
    }

    /**
     * Get user by username
     */
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        return UserResponse.fromEntity(user);
    }

    /**
     * Get user by email
     */
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return UserResponse.fromEntity(user);
    }

    /**
     * Get user by Keycloak ID
     */
    public Optional<UserResponse> getUserByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId)
                .map(UserResponse::fromEntity);
    }

    /**
     * Update user profile
     */
    @Transactional
    public UserResponse updateUserProfile(Long id, UserRegistrationRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setZipCode(request.getZipCode());
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        log.info("User profile updated: {}", updatedUser.getUsername());

        return UserResponse.fromEntity(updatedUser);
    }

    /**
     * Get current authenticated user
     */
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
            throw new IllegalStateException("No authenticated user found");
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String keycloakId = jwt.getSubject();

        return getUserByKeycloakId(keycloakId)
                .orElseThrow(() -> new IllegalArgumentException("User not found in database"));
    }

    /**
     * Get user role for authorization
     */
    public User.UserRole getUserRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return user.getRole();
    }

    /**
     * Suspend user account
     */
    @Transactional
    public void suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        user.setStatus(User.UserStatus.SUSPENDED);
        userRepository.save(user);
        log.info("User suspended: {}", user.getUsername());
    }

    /**
     * Activate user account
     */
    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);
        log.info("User activated: {}", user.getUsername());
    }

    /**
     * Verify user account is active
     */
    public boolean isUserActive(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getStatus() == User.UserStatus.ACTIVE)
                .orElse(false);
    }
}
