package com.realtime.management.service.users;

import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Depts;
import com.realtime.management.entity.Users;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.DeptsRepository;
import com.realtime.management.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UsersServiceImpl implements UsersService {
    private final UsersRepository repository;
    private final DeptsRepository deptRepository;

    @Override
    public UserResponse save(UserRequest request) {
        if(repository.existsById(request.getUserId())){
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }
        Users users = Users.builder()
                .userId(request.getUserId())
                .userName(request.getUserName())
                .role(request.getRole())
                .stat(request.getStat())
                .deptCd(request.getDeptCd())
                .createdAt(LocalDateTime.now())
                .build();
        repository.save(users);

        return UserResponse.from(users);
    }

    @Override
    public UserResponse update(String userId, UserRequest request) {

        Users users = repository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Depts depts = deptRepository.findById(request.getDeptCd())
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPT_NOT_FOUND)); // (부서 없을 때 예외처리 추가)

        users.update(request.getUserName(), request.getRole(), request.getStat(), depts);

        return UserResponse.from(users);
    }

    @Override
    public void delete(String userId) {
        Users users = repository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        repository.delete(users);
    }

    @Override
    public UserResponse findById(String userId) {
        Users users = repository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserResponse.from(users);
    }
}
