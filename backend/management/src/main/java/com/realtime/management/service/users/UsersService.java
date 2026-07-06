package com.realtime.management.service.users;

import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Users;

import java.util.List;

public interface UsersService {
    UserResponse save(UserRequest request);
    UserResponse update(String userId, UserRequest request);
    UserResponse findById(String userId);
    void delete(String userId);
    List<Users> findAll();
}
