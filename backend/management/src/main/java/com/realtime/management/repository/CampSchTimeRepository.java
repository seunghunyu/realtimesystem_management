package com.realtime.management.repository;

import com.realtime.management.entity.CampSchInfo;
import com.realtime.management.entity.CampSchInfoId;
import com.realtime.management.entity.CampSchTime;
import com.realtime.management.entity.CampSchTimeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampSchTimeRepository extends JpaRepository<CampSchTime, CampSchTimeId> {
    void deleteByIdSchId(String schId);
    List<CampSchTime> findAllByIdSchId(String schId);
}
