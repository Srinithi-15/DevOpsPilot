package com.devopspilot.api.controller;

import com.devopspilot.api.dto.CreateServiceRequest;
import com.devopspilot.api.dto.ServiceRegistryDto;
import com.devopspilot.api.service.ServiceRegistryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceRegistryController {

    private final ServiceRegistryService serviceRegistryService;

    public ServiceRegistryController(ServiceRegistryService serviceRegistryService) {
        this.serviceRegistryService = serviceRegistryService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceRegistryDto>> getServices() {
        return ResponseEntity.ok(serviceRegistryService.getAllServices());
    }

    @PostMapping
    public ResponseEntity<ServiceRegistryDto> registerService(@Valid @RequestBody CreateServiceRequest request) {
        ServiceRegistryDto created = serviceRegistryService.registerService(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
