package com.realtime.management.controller.api;

import com.realtime.management.dto.dept.DeptsRequest;
import com.realtime.management.dto.dept.DeptsResponse;
import com.realtime.management.dto.roles.RolesResponse;
import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Depts;
import com.realtime.management.entity.Roles;
import com.realtime.management.service.depts.DeptsService;
import com.realtime.management.service.users.UsersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 부서 관련된 모든 API
 */
@RestController
@RequestMapping("/api/depts")
@RequiredArgsConstructor
public class DeptsController {

    private final DeptsService service;

    @PostMapping("/save")
    public DeptsResponse save(@Valid @RequestBody DeptsRequest request){
        return service.save(request);
    }

    @PutMapping("/{dept_cd}")
    public DeptsResponse update(@PathVariable String dept_cd,
                                @RequestBody DeptsRequest request){
        return service.update(dept_cd, request);
    }

    @DeleteMapping("/{dept_cd}")
    public void delete(@PathVariable String dept_cd){
        service.delete(dept_cd);
    }

    @GetMapping("/{dept_cd}")
    public DeptsResponse findById(@PathVariable String dept_cd){
        return service.findById(dept_cd);
    }

    @GetMapping("/list")
    public List<DeptsResponse> findAll(){
        List<Depts> depts = service.findAll();

        return depts.stream()
                .map(DeptsResponse::from)
                .toList();
    }

}
