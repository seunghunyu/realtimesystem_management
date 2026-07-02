package com.realtime.management.controller;

import com.realtime.management.dto.UserRequest;
import com.realtime.management.dto.UserResponse;
import com.realtime.management.entity.User;
import com.realtime.management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("/save")
    public UserResponse save(@Valid @RequestBody UserRequest request){
        return service.save(request);
    }

    @PutMapping("/{userId}")
    public UserResponse update(@PathVariable String userId,
                               @RequestBody UserRequest request){
        return service.update(userId, request);
    }

    @DeleteMapping("/{userId}")
    public void delete(@PathVariable String userId){
        service.delete(userId);
    }

    @GetMapping("/{userId}")
    public UserResponse save(@PathVariable String userId){
        return service.findById(userId);
    }

}
