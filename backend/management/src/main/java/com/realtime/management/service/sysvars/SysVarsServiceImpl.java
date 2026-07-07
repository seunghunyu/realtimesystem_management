package com.realtime.management.service.sysvars;

import com.realtime.management.dto.sysvars.SysVarsRequest;
import com.realtime.management.dto.sysvars.SysVarsResponse;
import com.realtime.management.dto.user.UserResponse;

import com.realtime.management.entity.SysVars;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;

import com.realtime.management.repository.SysVarsRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SysVarsServiceImpl implements SysVarsService{

    private final SysVarsRepository repository;

    @Override
    public SysVarsResponse save(SysVarsRequest request) {
        if(repository.existsById(request.getSysCd())){
            throw new BusinessException(ErrorCode.SYSVARS_ALREADY_EXISTS);
        }

        SysVars sysVars = SysVars.builder()
                .sysCd(request.getSysCd())
                .sysNm(request.getSysNm())
                .sysDesc(request.getSysDesc())
                .createdAt(LocalDateTime.now())

                .build();
        repository.save(sysVars);

        return SysVarsResponse.from(sysVars);
    }

    @Override
    public SysVarsResponse update(String sysCd, SysVarsRequest request) {

        SysVars sysVars = repository.findById(sysCd)
                .orElseThrow(() -> new BusinessException(ErrorCode.SYSVARS_NOT_FOUND));

        sysVars.update(request.getSysNm(), request.getSysDesc());

        return SysVarsResponse.from(sysVars);
    }

    @Override
    public void delete(String sysCd) {
        SysVars sysVars = repository.findById(sysCd)
                .orElseThrow(() -> new BusinessException(ErrorCode.SYSVARS_NOT_FOUND));

        repository.delete(sysVars);
    }

    @Override
    public SysVarsResponse findById(String sysCd) {
        SysVars sysVars = repository.findById(sysCd)
                .orElseThrow(() -> new BusinessException(ErrorCode.SYSVARS_NOT_FOUND));
        return SysVarsResponse.from(sysVars);
    }

    @Override
    public List<SysVars> findAll() {
        return repository.findAll();
    }
}
