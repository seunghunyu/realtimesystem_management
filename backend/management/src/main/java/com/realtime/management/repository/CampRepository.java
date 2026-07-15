package com.realtime.management.repository;

import com.realtime.management.entity.Camp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CampRepository extends JpaRepository<Camp, String> {
    @Query("SELECT MAX(c.campId) FROM Camp c WHERE c.campId LIKE 'C%'")
    String findMaxCampId();
}
