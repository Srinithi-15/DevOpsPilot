package com.devopspilot.api.service;

import com.devopspilot.api.dto.CreateServiceRequest;
import com.devopspilot.api.dto.ServiceRegistryDto;
import com.devopspilot.api.entity.ServiceRegistryEntity;
import com.devopspilot.api.repository.ServiceRegistryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRegistryService {

    private final ServiceRegistryRepository repository;

    public ServiceRegistryService(ServiceRegistryRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ServiceRegistryDto> getAllServices() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceRegistryDto registerService(CreateServiceRequest request) {
        if (repository.existsByServiceName(request.getServiceName())) {
            throw new IllegalArgumentException("Service with name '" + request.getServiceName() + "' already exists");
        }

        ServiceRegistryEntity entity = new ServiceRegistryEntity(
                request.getServiceName(),
                request.getDescription(),
                request.getRepositoryUrl(),
                request.getEnvironment()
        );

        ServiceRegistryEntity saved = repository.save(entity);
        return toDto(saved);
    }

    private ServiceRegistryDto toDto(ServiceRegistryEntity entity) {
        return new ServiceRegistryDto(
                entity.getId(),
                entity.getServiceName(),
                entity.getDescription(),
                entity.getRepositoryUrl(),
                entity.getEnvironment(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
