package com.realtime.management.entity;

import com.realtime.management.dto.dept.DeptsRequest;
import com.realtime.management.dto.roles.RolesRequest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Roles {
    @Id
    @Column(name = "role_cd")
    private String roleCd;

    @Column(name = "role_nm")
    private String roleNm;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 💡 일대다(1:N) 양방향 매핑 (mappedBy 값은 Users 엔티티에 정의한 변수명과 일치해야 함)
    @Builder.Default
    @OneToMany(mappedBy = "roles", cascade = CascadeType.ALL)
    private List<Users> roles = new ArrayList<>();
    public void update(String roleNm, RolesRequest request){
        this.roleNm = roleNm;
    }
}
