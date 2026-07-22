package com.realtime.management.repository;

import com.realtime.management.entity.CampSchInfo;
import com.realtime.management.entity.CampSchInfoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampSchInfoRepository extends JpaRepository<CampSchInfo, CampSchInfoId> {
}
