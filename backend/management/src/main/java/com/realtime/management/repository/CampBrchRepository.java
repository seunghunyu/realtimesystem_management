package com.realtime.management.repository;

import com.realtime.management.entity.CampBrch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CampBrchRepository extends JpaRepository<CampBrch, String> {
    @Query("select distinct c from CampBrch c left join fetch c.scndBrchList")
    List<CampBrch> findAllWithSubBranches();
}
