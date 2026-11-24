package com.devopspilot.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deployment_records")
public class DeploymentRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "version", nullable = false, length = 50)
    private String version;

    @Column(name = "deployment_status", nullable = false, length = 50)
    private String deploymentStatus;

    @Column(name = "deployed_at", nullable = false, updatable = false)
    private LocalDateTime deployedAt;

    @Column(name = "deployment_message", columnDefinition = "TEXT")
    private String deploymentMessage;

    public DeploymentRecordEntity() {
    }

    public DeploymentRecordEntity(Long serviceId, String version, String deploymentStatus, String deploymentMessage) {
        this.serviceId = serviceId;
        this.version = version;
        this.deploymentStatus = deploymentStatus;
        this.deploymentMessage = deploymentMessage;
    }

    @PrePersist
    protected void onCreate() {
        this.deployedAt = LocalDateTime.now();
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
