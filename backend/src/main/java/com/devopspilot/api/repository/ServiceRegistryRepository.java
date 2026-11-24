package com.devopspilot.api.repository;

import com.devopspilot.api.entity.ServiceRegistryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRegistryRepository extends JpaRepository<ServiceRegistryEntity, Long> {

    Optional<ServiceRegistryEntity> findByServiceName(String serviceName);

    boolean existsByServiceName(String serviceName);
}
