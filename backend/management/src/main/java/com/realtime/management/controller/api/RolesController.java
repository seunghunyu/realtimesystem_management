package com.realtime.management.controller.api;

import com.realtime.management.dto.roles.RolesRequest;
import com.realtime.management.dto.roles.RolesResponse;
import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Roles;
import com.realtime.management.entity.Users;
import com.realtime.management.service.roles.RolesService;
import com.realtime.management.service.users.UsersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolesController {

    private final RolesService service;

    @PostMapping("/save")
    public RolesResponse save(@Valid @RequestBody RolesRequest request){
        return service.save(request);
    }

    @PutMapping("/{role_cd}")
    public RolesResponse update(@PathVariable String role_cd,
                               @RequestBody RolesRequest request){
        return service.update(role_cd, request);
    }

    @DeleteMapping("/{role_cd}")
    public void delete(@PathVariable String role_cd){
        service.delete(role_cd);
    }

    @GetMapping("/{role_cd}")
    public RolesResponse findById(@PathVariable String role_cd){
        return service.findById(role_cd);
    }

    @GetMapping("/list")
    public List<RolesResponse> findAll(){
        List<Roles> roles = service.findAll();

        return roles.stream()
                .map(RolesResponse::from)
                .toList();
    }

}
