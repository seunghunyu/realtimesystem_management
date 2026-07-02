package com.realtime.management.service;

import com.realtime.management.dto.UserRequest;
import com.realtime.management.dto.UserResponse;
import com.realtime.management.entity.User;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService{
    private final UserRepository repository;
    @Override
    public UserResponse save(UserRequest request) {
        if(repository.existsById(request.getUserId())){
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }
        User user = User.builder()
                .userId(request.getUserId())
                .userName(request.getUserName())
                .role(request.getRole())
                .stat(request.getStat())
                .deptCd(request.getDeptCd())
                .createdAt(LocalDateTime.now())
                .build();
        repository.save(user);

        return UserResponse.from(user);
    }

    @Override
    public UserResponse update(String userId, UserRequest request) {

        User user = repository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.update(request.getUserName(), request.getRole(), request.getStat(), request.getDeptCd());

        return UserResponse.from(user);
    }

    @Override
    public void delete(String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        repository.delete(user);
    }

    @Override
    public UserResponse findById(String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserResponse.from(user);
    }
}
