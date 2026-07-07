package com.realtime.management.service.users;

import com.realtime.management.dto.user.UserRequest;
import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.Depts;
import com.realtime.management.entity.Roles;
import com.realtime.management.entity.Users;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.DeptsRepository;
import com.realtime.management.repository.RolesRepository;
import com.realtime.management.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UsersServiceImpl implements UsersService {
    private final UsersRepository repository;
    private final DeptsRepository deptRepository;
    private final RolesRepository rolesRepository;

    @Override
    public UserResponse save(UserRequest request) {
        if(repository.existsById(request.getUserId())){
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }
        // 2. 부서(Depts)와 권한(Roles) 정보 DB에서 조회하기
        // (만약 없는 코드라면 예외를 던지도록 .orElseThrow() 처리)
        Depts depts = deptRepository.findById(request.getDeptCd())
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPT_NOT_FOUND));

        Roles roles = rolesRepository.findById(request.getRoleCd())
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        Users users = Users.builder()
                .userId(request.getUserId())
                .userName(request.getUserName())
                .stat(request.getStat())
                .address(request.getAddress())
                .createdAt(LocalDateTime.now())
                .roles(roles)
                .depts(depts)
                .password(request.getPassword())
                .build();
        repository.save(users);

        return UserResponse.from(users);
    }

    @Override
    public UserResponse update(String userId, UserRequest request) {

        Users users = repository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Depts depts = deptRepository.findById(request.getDeptCd())
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPT_NOT_FOUND));
        Roles roles = rolesRepository.findById(request.getRoleCd())
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        users.update(request.getUserName(), request.getStat(), request.getPassword(), request.getAddress(), depts, roles);

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

    @Override
    public List<Users> findAll() {
        return repository.findAll();
    }
}
