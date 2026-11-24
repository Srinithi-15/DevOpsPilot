package com.devopspilot.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateDeploymentRequest {

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotBlank(message = "Version is required")
    @Size(max = 50, message = "Version must not exceed 50 characters")
    private String version;

    @NotBlank(message = "Deployment status is required")
    @Size(max = 50, message = "Deployment status must not exceed 50 characters")
    private String deploymentStatus;

    private String deploymentMessage;

    public CreateDeploymentRequest() {
    }

    public CreateDeploymentRequest(Long serviceId, String version, String deploymentStatus, String deploymentMessage) {
        this.serviceId = serviceId;
        this.version = version;
        this.deploymentStatus = deploymentStatus;
        this.deploymentMessage = deploymentMessage;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDeploymentStatus() {
        return deploymentStatus;
    }

    public void setDeploymentStatus(String deploymentStatus) {
        this.deploymentStatus = deploymentStatus;
    }

    public String getDeploymentMessage() {
        return deploymentMessage;
    }

    public void setDeploymentMessage(String deploymentMessage) {
        this.deploymentMessage = deploymentMessage;
    }
}
