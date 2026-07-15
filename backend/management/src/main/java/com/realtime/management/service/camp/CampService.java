package com.realtime.management.service.camp;

import com.realtime.management.dto.camp.CampBrchResponse;
import com.realtime.management.dto.camp.CampRequest;
import com.realtime.management.dto.camp.CampResponse;
import com.realtime.management.dto.camp.HierarchyBrchResponse;
import com.realtime.management.entity.Camp;
import com.realtime.management.entity.CampBrch;

import java.util.List;

public interface CampService {
    CampResponse save(CampRequest request);
    CampResponse update(CampRequest request);
    void delete(String campId);
    CampResponse findById(String campId);
    List<Camp> findAll();

    //분류
    List<CampBrch> campBrchFindAll();
    List<HierarchyBrchResponse> getBrchTree();
}
