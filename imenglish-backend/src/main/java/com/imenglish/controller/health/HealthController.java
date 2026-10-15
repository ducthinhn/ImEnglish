package com.imenglish.controller.health;

import com.imenglish.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health Check", description = "Endpoints for server health and status monitoring")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check API Health", description = "Returns service health status and current server time")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> status = Map.of(
                "status", "UP",
                "service", "imenglish-backend",
                "version", "1.0.0",
                "timestamp", LocalDateTime.now()
        );
        return ResponseEntity.ok(ApiResponse.ok("Service is healthy and operational", status));
    }
}
