package com.devopspilot.api.repository;

import com.devopspilot.api.entity.DeploymentRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeploymentRecordRepository extends JpaRepository<DeploymentRecordEntity, Long> {

    List<DeploymentRecordEntity> findByServiceIdOrderByDeployedAtDesc(Long serviceId);

    List<DeploymentRecordEntity> findAllByOrderByDeployedAtDesc();
}
