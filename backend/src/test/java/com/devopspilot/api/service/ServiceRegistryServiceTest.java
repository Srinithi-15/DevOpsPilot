package com.devopspilot.api.service;

import com.devopspilot.api.dto.CreateServiceRequest;
import com.devopspilot.api.dto.ServiceRegistryDto;
import com.devopspilot.api.entity.ServiceRegistryEntity;
import com.devopspilot.api.repository.ServiceRegistryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ServiceRegistryServiceTest {

    @Mock
    private ServiceRegistryRepository repository;

    @InjectMocks
    private ServiceRegistryService service;

    @Test
    void shouldRegisterNewServiceSuccessfully() {
        CreateServiceRequest request = new CreateServiceRequest(
                "auth-service",
                "Authentication microservice",
                "https://github.com/example/auth",
                "production"
        );

        when(repository.existsByServiceName("auth-service")).thenReturn(false);

        ServiceRegistryEntity savedEntity = new ServiceRegistryEntity(
                request.getServiceName(),
                request.getDescription(),
                request.getRepositoryUrl(),
                request.getEnvironment()
        );
        savedEntity.setId(10L);

        when(repository.save(any(ServiceRegistryEntity.class))).thenReturn(savedEntity);

        ServiceRegistryDto result = service.registerService(request);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("auth-service", result.getServiceName());
        verify(repository).save(any(ServiceRegistryEntity.class));
    }

    @Test
    void shouldReturnAllRegisteredServices() {
        ServiceRegistryEntity entity = new ServiceRegistryEntity("billing-service", "Billing API", null, "staging");
        entity.setId(1L);

        when(repository.findAll()).thenReturn(List.of(entity));

        List<ServiceRegistryDto> services = service.getAllServices();

        assertEquals(1, services.size());
        assertEquals("billing-service", services.getFirst().getServiceName());
    }
}
