package com.devopspilot.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateServiceRequest {

    @NotBlank(message = "Service name is required")
    @Size(max = 100, message = "Service name must not exceed 100 characters")
    private String serviceName;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    @Size(max = 255, message = "Repository URL must not exceed 255 characters")
    private String repositoryUrl;

    @NotBlank(message = "Environment is required")
    @Size(max = 50, message = "Environment must not exceed 50 characters")
    private String environment;

    public CreateServiceRequest() {
    }

    public CreateServiceRequest(String serviceName, String description, String repositoryUrl, String environment) {
        this.serviceName = serviceName;
        this.description = description;
        this.repositoryUrl = repositoryUrl;
        this.environment = environment;
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
}
