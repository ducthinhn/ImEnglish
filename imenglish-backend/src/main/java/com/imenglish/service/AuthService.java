package com.imenglish.service;

import com.imenglish.dto.request.LoginRequest;
import com.imenglish.dto.request.RefreshTokenRequest;
import com.imenglish.dto.request.RegisterRequest;
import com.imenglish.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);
}
