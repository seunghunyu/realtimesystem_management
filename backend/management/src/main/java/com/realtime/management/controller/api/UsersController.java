package com.realtime.management.controller.api;

import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Users;
import com.realtime.management.service.users.UsersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService service;

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
    public UserResponse findById(@PathVariable String userId){
        return service.findById(userId);
    }

    @GetMapping("/list")
    public List<UserResponse> findAll(){
        List<Users> usersList = service.findAll();

        // Stream을 사용하여 Users -> UserResponse로 변환
        return usersList.stream()
                .map(UserResponse::from) // 또는 매퍼 클래스/생성자 활용
                .toList(); // Java 16+ 기준 (하위 버전은 .collect(Collectors.toList()))
    }
}
