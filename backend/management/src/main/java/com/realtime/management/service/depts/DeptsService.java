package com.realtime.management.service.depts;

import com.realtime.management.dto.dept.DeptsRequest;
import com.realtime.management.dto.dept.DeptsResponse;
import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Depts;

import java.util.List;

public interface DeptsService {
    DeptsResponse save(DeptsRequest request);
    DeptsResponse update(String deptCd, DeptsRequest request);
    void delete(String deptCd);
    DeptsResponse findById(String deptCd);
    List<Depts> findAll();

}
