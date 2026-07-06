package com.realtime.management.repository;

import com.realtime.management.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolesRepository extends JpaRepository<Roles, String> {
}
