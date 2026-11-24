package com.devopspilot.api.dto;

import java.time.LocalDateTime;

public class DeploymentRecordDto {

    private Long id;
    private Long serviceId;
    private String version;
    private String deploymentStatus;
    private LocalDateTime deployedAt;
    private String deploymentMessage;

    public DeploymentRecordDto() {
    }

    public DeploymentRecordDto(Long id, Long serviceId, String version, String deploymentStatus, LocalDateTime deployedAt, String deploymentMessage) {
        this.id = id;
        this.serviceId = serviceId;
        this.version = version;
        this.deploymentStatus = deploymentStatus;
        this.deployedAt = deployedAt;
        this.deploymentMessage = deploymentMessage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getDeployedAt() {
        return deployedAt;
    }

    public void setDeployedAt(LocalDateTime deployedAt) {
        this.deployedAt = deployedAt;
    }

    public String getDeploymentMessage() {
        return deploymentMessage;
    }

    public void setDeploymentMessage(String deploymentMessage) {
        this.deploymentMessage = deploymentMessage;
    }
}
