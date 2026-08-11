package com.realtime.management.service.camp;

import com.realtime.management.dto.camp.*;
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

    //디자인 정보 저장
    CampDesignDto getCampDesign(String campId);
    void saveCampDesign(String campId, CampDesignDto designDto);
    void updateCampDesign(String campId, CampDesignDto designDto);
    void deleteCampDesign(String campId);
}
