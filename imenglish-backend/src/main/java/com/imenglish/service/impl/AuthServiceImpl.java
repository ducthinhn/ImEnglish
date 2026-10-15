package com.imenglish.service.impl;

import com.imenglish.dto.request.LoginRequest;
import com.imenglish.dto.request.RefreshTokenRequest;
import com.imenglish.dto.request.RegisterRequest;
import com.imenglish.dto.response.AuthResponse;
import com.imenglish.dto.response.UserResponse;
import com.imenglish.entity.RefreshToken;
import com.imenglish.entity.Role;
import com.imenglish.entity.User;
import com.imenglish.entity.UserStats;
import com.imenglish.enums.EnglishLevel;
import com.imenglish.enums.OAuthProvider;
import com.imenglish.exception.AppException;
import com.imenglish.exception.ResourceNotFoundException;
import com.imenglish.exception.UnauthorizedException;
import com.imenglish.mapper.UserMapper;
import com.imenglish.repository.RefreshTokenRepository;
import com.imenglish.repository.RoleRepository;
import com.imenglish.repository.UserRepository;
import com.imenglish.repository.UserStatsRepository;
import com.imenglish.security.jwt.JwtTokenProvider;
import com.imenglish.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserStatsRepository userStatsRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email is already registered", HttpStatus.CONFLICT);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException("Username is already taken", HttpStatus.CONFLICT);
        }

        Role defaultRole = roleRepository.findById("ROLE_USER")
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .id("ROLE_USER")
                                .name("Standard User")
                                .description("Default role for registered learners")
                                .build()
                ));

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .username(request.getUsername().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .englishLevel(request.getEnglishLevel() != null ? request.getEnglishLevel() : EnglishLevel.A1)
                .learningGoal(request.getLearningGoal())
                .nativeLanguage("vi")
                .timezone("Asia/Ho_Chi_Minh")
                .oauthProvider(OAuthProvider.LOCAL)
                .isActive(true)
                .isEmailVerified(false)
                .roles(new HashSet<>(Collections.singletonList(defaultRole)))
                .build();

        User savedUser = userRepository.save(user);

        // Initialize user statistics
        UserStats userStats = UserStats.builder()
                .user(savedUser)
                .build();
        userStatsRepository.save(userStats);

        return createAuthResponse(savedUser);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new AppException("Your account has been deactivated. Please contact support.", HttpStatus.FORBIDDEN);
        }

        return createAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String tokenHash = tokenProvider.hashToken(request.getRefreshToken());

        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (Boolean.TRUE.equals(storedToken.getIsRevoked())) {
            // Compromise detected: revoke all user refresh tokens
            refreshTokenRepository.revokeAllUserTokens(storedToken.getUser());
            log.warn("Detected use of revoked refresh token for user {}. All tokens revoked.", storedToken.getUser().getEmail());
            throw new UnauthorizedException("Refresh token has been revoked");
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            storedToken.setIsRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new UnauthorizedException("Refresh token has expired");
        }

        // Revoke the used token (Token Rotation)
        storedToken.setIsRevoked(true);
        refreshTokenRepository.save(storedToken);

        // Issue new token pair
        return createAuthResponse(storedToken.getUser());
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request) {
        String tokenHash = tokenProvider.hashToken(request.getRefreshToken());
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.setIsRevoked(true);
            refreshTokenRepository.save(token);
            log.info("Revoked refresh token for user {}", token.getUser().getEmail());
        });
    }

    private AuthResponse createAuthResponse(User user) {
        String accessToken = tokenProvider.generateAccessToken(user);
        String rawRefreshToken = tokenProvider.generateRefreshToken();
        String hashedRefreshToken = tokenProvider.hashToken(rawRefreshToken);

        LocalDateTime expiresAt = LocalDateTime.now().plusNanos(tokenProvider.getRefreshExpirationMs() * 1_000_000);

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .tokenHash(hashedRefreshToken)
                .expiresAt(expiresAt)
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        UserResponse userResponse = userMapper.toResponse(user);

        return AuthResponse.builder()
                .tokenType("Bearer")
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .user(userResponse)
                .build();
    }
}
