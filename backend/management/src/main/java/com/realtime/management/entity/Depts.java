package com.realtime.management.entity;

import com.realtime.management.dto.dept.DeptsRequest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "depts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Depts {
    @Id
    @Column(name = "dept_cd")
    private String deptCd;

    @Column(name = "dept_nm")
    private String deptNm;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 💡 일대다(1:N) 양방향 매핑 (mappedBy 값은 Users 엔티티에 정의한 변수명과 일치해야 함)
    @Builder.Default
    @OneToMany(mappedBy = "depts", cascade = CascadeType.ALL)
    private List<Users> users = new ArrayList<>();

    public void update(String deptNm, DeptsRequest request){
        this.deptNm = deptNm;
    }
}
