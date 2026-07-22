-- 1. 부서 테이블 (depts)
CREATE TABLE depts (
    dept_cd    VARCHAR(50) NOT NULL,
    dept_nm    VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_depts PRIMARY KEY (dept_cd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 권한 테이블 (roles)
CREATE TABLE roles (
    role_cd    VARCHAR(50) NOT NULL,
    role_nm    VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_roles PRIMARY KEY (role_cd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 시스템 관리 테이블 (sys_mng)
CREATE TABLE sys_mng (
    sys_cd     VARCHAR(50) NOT NULL,
    sys_nm     VARCHAR(100),
    sys_desc   VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sys_mng PRIMARY KEY (sys_cd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 공통 코드 마스터 테이블 (item_cd_tbl_info)
CREATE TABLE item_cd_tbl_info (
    cd_tbl_id  VARCHAR(50) NOT NULL,
    cd_tbl_nm  VARCHAR(100),
    cd_tbl_desc VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_item_cd_tbl_info PRIMARY KEY (cd_tbl_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 데이터 포맷 마스터 테이블 (data_format_info)
CREATE TABLE data_format_info (
    format_id   VARCHAR(50) NOT NULL,
    format_nm   VARCHAR(100),
    format_desc VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_data_format_info PRIMARY KEY (format_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 사용자 테이블 (users)
CREATE TABLE users (
    user_id    VARCHAR(50) NOT NULL,
    user_name  VARCHAR(50),
    role_cd    VARCHAR(50),
    stat       VARCHAR(20),
    dept_cd    VARCHAR(50),
    password   VARCHAR(255),
    address    VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT fk_users_role_cd FOREIGN KEY (role_cd) REFERENCES roles (role_cd),
    CONSTRAINT fk_users_dept_cd FOREIGN KEY (dept_cd) REFERENCES depts (dept_cd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. 아이템 마스터 테이블 (items)
CREATE TABLE items (
    item_id    VARCHAR(50) NOT NULL,
    item_nm    VARCHAR(100),
    item_alias VARCHAR(100),
    item_type  VARCHAR(50),
    item_desc  VARCHAR(255),
    cd_tbl_id  VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_items PRIMARY KEY (item_id),
    CONSTRAINT fk_items_cd_tbl_id FOREIGN KEY (cd_tbl_id) REFERENCES item_cd_tbl_info (cd_tbl_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. 공통 코드 상세 맵핑 테이블 (item_cd_tbl_map)
CREATE TABLE item_cd_tbl_map (
    cd_tbl_id  VARCHAR(50) NOT NULL,
    cd_id      VARCHAR(50) NOT NULL,
    cd_nm      VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_item_cd_tbl_map PRIMARY KEY (cd_tbl_id, cd_id),
    CONSTRAINT fk_tbl_map_cd_tbl_id FOREIGN KEY (cd_tbl_id) REFERENCES item_cd_tbl_info (cd_tbl_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. 데이터 포맷 상세 항목 테이블 (data_format_item)
CREATE TABLE data_format_item (
    format_id  VARCHAR(50) NOT NULL,
    field_nm   VARCHAR(50) NOT NULL,
    field_val  VARCHAR(100),
    field_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_data_format_item PRIMARY KEY (format_id, field_nm),
    CONSTRAINT fk_format_item_id FOREIGN KEY (format_id) REFERENCES data_format_info (format_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10.필터 조건 테이블
create table filter_condition(
	filter_id varchar(48) not null,
	filter_nm varchar(128) not null,
	filter_desc varchar(256),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_filter_condition PRIMARY KEY (filter_id)
);

-- 11.필터 조건 정보
create table filter_condition_info(
	filter_id varchar(48) not null,
	seq integer not null,
	info varchar(4000) not null,
	CONSTRAINT pk_filter_condition_info PRIMARY KEY (filter_id, seq)
);


-- 12. 캠페인 기본정보 테이블
create table camp (
	camp_id varchar(48) not null,
	camp_nm varchar(128) not null,
	camp_desc varchar(128),
	camp_brch1 varchar(48), -- 1차 분류
	camp_brch2 varchar(48), -- 2차 분류
	camp_type varchar(24) default 'real', -- batch, real
	camp_stat varchar(24) default '100',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_camp PRIMARY KEY (camp_id)
);

-- 13. 컴포넌트 정보 테이블
create table component(
	cmpnt_id varchar(48) not null,
	cmpnt_nm varchar(128),
	cmpnt_desc varchar(256),
	camp_id varchar(48) not null,
	cmpnt_type varchar(24),
	from_cmpnt_id varchar(48) not null,
	CONSTRAINT pk_component PRIMARY KEY (cmpnt_id, camp_id)
);

-- 14. 컴포넌트별 데이터 포맷
create table camp_data_format(
	cmpnt_id varchar(48) not null,
	camp_id varchar(48) not null,
	format_id VARCHAR(255) not null,
	CONSTRAINT pk_camp_data_format PRIMARY KEY (cmpnt_id, camp_id, format_id)
);

-- 15. 컴포넌트별 필터 조건
create table camp_filter_condition(
	cmpnt_id varchar(48) not null,
	camp_id varchar(48) not null,
	filter_id varchar(128) not null,
	CONSTRAINT pk_camp_filter_condition PRIMARY KEY (cmpnt_id, camp_id, filter_id)
)

-- 16. 캠페인 1차 분류
create table camp_brch(
	brch_cd varchar(12) not null,
	brch_nm varchar(48) not null,
	use_cd varchar(1) not null,
	CONSTRAINT pk_camp_brch PRIMARY KEY (brch_cd)
);

-- 17. 캠페인 2차 분류
create table camp_scnd_brch(
	scnd_brch_cd varchar(12) not null,
	scnd_brch_nm varchar(48) not null,
	brch_cd varchar(128) not null,
	use_cd varchar(1) not null,
	CONSTRAINT pk_camp_scnd_brch PRIMARY KEY (scnd_brch_cd, brch_cd)
);

-- 18. 스케줄 정보
create table camp_sch_info(
	sch_id varchar(12) not null,
	sch_nm varchar(48) not null,
	camp_id varchar(48) not null,
	obj_kind varchar(12) not null default 'realtime',
	str_dt varchar(12) not null,
	end_dt varchar(12) not null,
	str_tm varchar(12),
	end_tm varchar(12),
	CONSTRAINT pk_camp_sch_info PRIMARY KEY (sch_id, camp_id)
);

-- 19. 스케줄 시간 정보
create table camp_sch_time(
	sch_id varchar(12) not null,
	sch_time varchar(12) not null,
	CONSTRAINT pk_camp_sch_info PRIMARY KEY (sch_id, sch_time)
);