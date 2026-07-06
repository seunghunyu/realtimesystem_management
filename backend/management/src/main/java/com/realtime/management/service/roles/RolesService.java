package com.realtime.management.service.roles;


import com.realtime.management.dto.roles.RolesRequest;
import com.realtime.management.dto.roles.RolesResponse;
import com.realtime.management.entity.Roles;

import java.util.List;

public interface RolesService {
    RolesResponse save(RolesRequest request);
    RolesResponse update(String role_cd, RolesRequest request);
    void delete(String role_cd);
    RolesResponse findById(String role_cd);
    List<Roles> findAll();

}
