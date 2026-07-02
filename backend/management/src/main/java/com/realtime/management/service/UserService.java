package com.realtime.management.service;

import com.realtime.management.dto.UserRequest;
import com.realtime.management.dto.UserResponse;

public interface UserService {
    UserResponse save(UserRequest request);
    UserResponse update(String userId, UserRequest request);
    UserResponse findById(String userId);
    void delete(String userId);
}
