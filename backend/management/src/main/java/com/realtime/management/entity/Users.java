package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor  //빌더가 내부적으로 쓸 전체 생성자 자동 생성
@AllArgsConstructor //JPA나 프레임워크가 필요로 하는 기본 생성자 자동 생성
@Builder //기본 생성자 방식 처럼 인자의 순서를 맞출 필요가 없음 User.builder().name("홍길동").email("hong@gmail.com").build();
public class Users {
    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "stat")
    private String stat;

//    @Column(name = "dept_cd")
//    private String deptCd;
//
//    @Column(name = "role_cd")
//    private String roleCd;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 💡 다대일(N:1) 매핑 설정 (외래키 관리 주체)
    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 설정으로 성능 최적화
    @JoinColumn(name = "dept_cd")     // 데이터베이스의 실제 FK 컬럼명
    private Depts depts;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 설정으로 성능 최적화
    @JoinColumn(name = "role_cd")     // 데이터베이스의 실제 FK 컬럼명
    private Roles roles;

    public void update(String userName, String stat, Depts depts, Roles roles){
        this.userName = userName;
        this.stat = stat;
        this.depts = depts;
        this.roles = roles;
    }
}
