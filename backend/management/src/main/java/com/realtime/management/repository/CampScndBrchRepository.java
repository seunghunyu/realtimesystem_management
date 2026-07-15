package com.realtime.management.repository;

import com.realtime.management.entity.CampScndBrch;
import com.realtime.management.entity.CampScndBrchId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampScndBrchRepository extends JpaRepository<CampScndBrch, CampScndBrchId> {
    List<CampScndBrch> findById_BrchCd(String brchCd);
}
