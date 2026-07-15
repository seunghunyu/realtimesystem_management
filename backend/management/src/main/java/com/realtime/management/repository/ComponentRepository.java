package com.realtime.management.repository;

import com.realtime.management.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentRepository extends JpaRepository<Component, String> {
}
