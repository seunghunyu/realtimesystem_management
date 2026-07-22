package com.realtime.management.repository;

import com.realtime.management.entity.Cmpnt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentRepository extends JpaRepository<Cmpnt, String> {
}
