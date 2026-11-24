package com.devopspilot.api.controller;

import com.devopspilot.api.dto.CreateDeploymentRequest;
import com.devopspilot.api.dto.DeploymentRecordDto;
import com.devopspilot.api.service.DeploymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DeploymentService deploymentService;

    public DeploymentController(DeploymentService deploymentService) {
        this.deploymentService = deploymentService;
    }

    @GetMapping
    public ResponseEntity<List<DeploymentRecordDto>> getDeployments(
            @RequestParam(name = "serviceId", required = false) Long serviceId) {
        if (serviceId != null) {
            return ResponseEntity.ok(deploymentService.getDeploymentsByServiceId(serviceId));
        }
        return ResponseEntity.ok(deploymentService.getAllDeployments());
    }

    @PostMapping
    public ResponseEntity<DeploymentRecordDto> recordDeployment(@Valid @RequestBody CreateDeploymentRequest request) {
        DeploymentRecordDto created = deploymentService.recordDeployment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
