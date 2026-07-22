package com.realtime.management.controller.api;


import com.realtime.management.dto.sysvars.SysVarsRequest;
import com.realtime.management.dto.sysvars.SysVarsResponse;
import com.realtime.management.entity.SysVars;
import com.realtime.management.service.sysvars.SysVarsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 시스템 변수 관련된 모든 API
 */
@RestController
@RequestMapping("/api/sysvars")
@RequiredArgsConstructor
public class SysVarsController {
    private final SysVarsService service;

    @PostMapping("/save")
    public SysVarsResponse save(@Valid @RequestBody SysVarsRequest request){
        return service.save(request);
    }

    @PutMapping("/{sys_cd}")
    public SysVarsResponse update(@PathVariable String sys_cd,
                                @RequestBody SysVarsRequest request){
        return service.update(sys_cd, request);
    }

    @DeleteMapping("/{sys_cd}")
    public void delete(@PathVariable String sys_cd){
        service.delete(sys_cd);
    }

    @GetMapping("/{sys_cd}")
    public SysVarsResponse findById(@PathVariable String sys_cd){
        return service.findById(sys_cd);
    }

    @GetMapping("/list")
    public List<SysVarsResponse> findAll(){
        List<SysVars> roles = service.findAll();

        return roles.stream()
                .map(SysVarsResponse::from)
                .toList();
    }
}
