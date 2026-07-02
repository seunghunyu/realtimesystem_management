package com.realtime.management.service.users;

import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;

public interface UsersService {
    UserResponse save(UserRequest request);
    UserResponse update(String userId, UserRequest request);
    UserResponse findById(String userId);
    void delete(String userId);
}
