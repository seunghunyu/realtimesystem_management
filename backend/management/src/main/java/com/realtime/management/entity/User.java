package com.realtime.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor  //빌더가 내부적으로 쓸 전체 생성자 자동 생성
@AllArgsConstructor //JPA나 프레임워크가 필요로 하는 기본 생성자 자동 생성
@Builder //기본 생성자 방식 처럼 인자의 순서를 맞출 필요가 없음 User.builder().name("홍길동").email("hong@gmail.com").build();
public class User {
    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_name")
    private String userName;

    private String role;

    @Column(name = "stat")
    private String stat;

    @Column(name = "dept_cd")
    private String deptCd;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public void update(String userName, String role, String stat, String deptCd){
        this.userName = userName;
        this.role = role;
        this.stat = stat;
        this.deptCd = deptCd;
    }
}
