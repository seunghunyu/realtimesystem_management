package com.realtime.management.service.roles;

import com.realtime.management.dto.dept.DeptsRequest;
import com.realtime.management.dto.dept.DeptsResponse;
import com.realtime.management.dto.roles.RolesRequest;
import com.realtime.management.dto.roles.RolesResponse;
import com.realtime.management.entity.Depts;
import com.realtime.management.entity.Roles;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.DeptsRepository;
import com.realtime.management.repository.RolesRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RolesServiceImpl implements RolesService {
    private final RolesRepository rolesRepository;

    @Override
    public RolesResponse save(RolesRequest request) {
        if(rolesRepository.existsById(request.getRoleCd())){
            throw new BusinessException(ErrorCode.ROLE_ALREADY_EXISTS);
        }
        Roles roles = Roles.builder()
                .roleCd(request.getRoleCd())
                .roleNm(request.getRoleNm())
                .createdAt(LocalDateTime.now())
                .build();
        rolesRepository.save(roles);

        return RolesResponse.from(roles);
    }

    @Override
    public RolesResponse update(String roleCd, RolesRequest request) {


        Roles roles = rolesRepository.findById(request.getRoleCd())
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND)); // (역할 없을 때 예외처리 추가)

        roles.update(roles.getRoleCd(), request);

        return RolesResponse.from(roles);
    }

    @Override
    public void delete(String roleCd) {
        Roles roles = rolesRepository.findById(roleCd)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        rolesRepository.delete(roles);
    }

    @Override
    public RolesResponse findById(String roleCd) {
        Roles roles = rolesRepository.findById(roleCd)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));
        return RolesResponse.from(roles);
    }

    @Override
    public List<Roles> findAll() {
        return rolesRepository.findAll();
    }
}
