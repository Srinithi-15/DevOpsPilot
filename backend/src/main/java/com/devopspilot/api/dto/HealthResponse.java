package com.devopspilot.api.dto;

import java.time.Instant;

public class HealthResponse {

    private String status;
    private String application;
    private String version;
    private Instant timestamp;
    private String environment;

    public HealthResponse() {
    }

    public HealthResponse(String status, String application, String version, Instant timestamp, String environment) {
        this.status = status;
        this.application = application;
        this.version = version;
        this.timestamp = timestamp;
        this.environment = environment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }
}
