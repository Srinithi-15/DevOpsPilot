package com.devopspilot.api.service;

import com.devopspilot.api.dto.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class HealthService {

    @Value("${spring.application.name:devopspilot-backend}")
    private String applicationName;

    @Value("${spring.profiles.active:default}")
    private String environment;

    public HealthResponse getHealth() {
        return new HealthResponse(
                "UP",
                applicationName,
                "1.0.0",
                Instant.now(),
                environment
        );
    }
}
