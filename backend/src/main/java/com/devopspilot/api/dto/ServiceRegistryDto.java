package com.devopspilot.api.dto;

import java.time.LocalDateTime;

public class ServiceRegistryDto {

    private Long id;
    private String serviceName;
    private String description;
    private String repositoryUrl;
    private String environment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ServiceRegistryDto() {
    }

    public ServiceRegistryDto(Long id, String serviceName, String description, String repositoryUrl, String environment, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.serviceName = serviceName;
        this.description = description;
        this.repositoryUrl = repositoryUrl;
        this.environment = environment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
