package com.realtime.management.service.sysvars;

import com.realtime.management.dto.sysvars.SysVarsRequest;
import com.realtime.management.dto.sysvars.SysVarsResponse;
import com.realtime.management.entity.SysVars;
import com.realtime.management.entity.Users;

import java.util.List;

public interface SysVarsService {
    SysVarsResponse save(SysVarsRequest request);
    SysVarsResponse update(String sysCd, SysVarsRequest request);
    SysVarsResponse findById(String sysCd);
    void delete(String sysCd);
    List<SysVars> findAll();
}
