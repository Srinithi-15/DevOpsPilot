package com.devopspilot.api.service;

import com.devopspilot.api.dto.CreateDeploymentRequest;
import com.devopspilot.api.dto.DeploymentRecordDto;
import com.devopspilot.api.entity.DeploymentRecordEntity;
import com.devopspilot.api.repository.DeploymentRecordRepository;
import com.devopspilot.api.repository.ServiceRegistryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeploymentService {

    private final DeploymentRecordRepository deploymentRepository;
    private final ServiceRegistryRepository serviceRepository;

    public DeploymentService(DeploymentRecordRepository deploymentRepository, ServiceRegistryRepository serviceRepository) {
        this.deploymentRepository = deploymentRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public List<DeploymentRecordDto> getAllDeployments() {
        return deploymentRepository.findAllByOrderByDeployedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeploymentRecordDto> getDeploymentsByServiceId(Long serviceId) {
        return deploymentRepository.findByServiceIdOrderByDeployedAtDesc(serviceId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeploymentRecordDto recordDeployment(CreateDeploymentRequest request) {
        if (!serviceRepository.existsById(request.getServiceId())) {
            throw new IllegalArgumentException("Service with id " + request.getServiceId() + " does not exist");
        }

        DeploymentRecordEntity entity = new DeploymentRecordEntity(
                request.getServiceId(),
                request.getVersion(),
                request.getDeploymentStatus(),
                request.getDeploymentMessage()
        );

        DeploymentRecordEntity saved = deploymentRepository.save(entity);
        return toDto(saved);
    }

    private DeploymentRecordDto toDto(DeploymentRecordEntity entity) {
        return new DeploymentRecordDto(
                entity.getId(),
                entity.getServiceId(),
                entity.getVersion(),
                entity.getDeploymentStatus(),
                entity.getDeployedAt(),
                entity.getDeploymentMessage()
        );
    }
}
