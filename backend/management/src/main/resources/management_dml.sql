-- 1.depts
insert into depts (dept_cd, dept_nm) values('A0001', 'Product LAB');
insert into depts (dept_cd, dept_nm) values('A0002', 'Product DESIGN');
insert into depts (dept_cd, dept_nm) values('A0003', 'Marketing');
insert into depts (dept_cd, dept_nm) values('A0004', 'Analytics');
insert into depts (dept_cd, dept_nm) values('A0005', 'HR');

-- 2.roles
insert into roles (role_cd, role_nm) values('R0000', '관리자');
insert into roles (role_cd, role_nm) values('R0001', '개발자');
insert into roles (role_cd, role_nm) values('R0002', '디자이너');
insert into roles (role_cd, role_nm) values('R0003', '마케터');
insert into roles (role_cd, role_nm) values('R0004', 'PM');
insert into roles (role_cd, role_nm) values('R0005', '데이터 분석가');
insert into roles (role_cd, role_nm) values('R0006', 'UX 디자이너');

-- 3.camp_brch
insert into camp_brch values('A01','조기정착','1');
insert into camp_brch values('A02','구매활성화','1');
insert into camp_brch values('A03','고객관리','1');
insert into camp_brch values('A04','이탈방지','1');

-- 4.camp_scnd_brch
insert into camp_scnd_brch values('A0101','신규고객유치', 'A01', '1');
insert into camp_scnd_brch values('A0102','신규회원조기정착유도', 'A01', '1');
insert into camp_scnd_brch values('A0103','신상품구매', 'A01', '1');
insert into camp_scnd_brch values('A0104','교차구매', 'A01', '1');
insert into camp_scnd_brch values('A0105','상위구매(up-selling)', 'A01', '1');

insert into camp_scnd_brch values('A0201','Upselling', 'A02', '1');
insert into camp_scnd_brch values('A0202','신상품활성화', 'A02', '1');
insert into camp_scnd_brch values('A0203','고객 활성화', 'A02', '1');
insert into camp_scnd_brch values('A0204','고객 활성화', 'A02', '1');
insert into camp_scnd_brch values('A0205','우수고객 관리', 'A02', '1');

insert into camp_scnd_brch values('A0301','Loyalty제고', 'A03', '1');
insert into camp_scnd_brch values('A0302','고객생애주기관리', 'A03', '1');
insert into camp_scnd_brch values('A0303','고객Care', 'A03', '1');
insert into camp_scnd_brch values('A0304','고객정보획득', 'A03', '1');

insert into camp_scnd_brch values('A0401','Wake-Up', 'A04', '1');
insert into camp_scnd_brch values('A0402','Retention', 'A04', '1');

