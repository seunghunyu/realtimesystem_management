// ── User Service ─────────────────────────────────────────────────────────────
// Wraps all /api/users endpoints.
// Every method returns ApiResult<T> — callers check `.ok` before using `.data`.
//
// Endpoints assumed on the server:
//   POST   /api/users            → create user
//   PATCH  /api/users/:id        → partial update
//   DELETE /api/users/:id        → delete user
//   GET    /api/users            → list users  (bonus — not wired in UI yet)
//   GET    /api/users/:id        → single user (bonus)

import { apiClient, type ApiResult } from "../lib/apiClient";

// ── payload / response types ─────────────────────────────────────────────────

export interface roleDto {
  role_cd: string;
  role_nm: string;
}

export interface deptDto {
  dept_cd: string;
  dept_nm: string;
}

/** Body sent when registering a new role */
export interface CreateRolePayload {
  role_cd: string;
  role_nm: string;
}

/** Body sent when registering a new dept */
export interface CreateDeptPayload {
  dept_cd: string;
  dept_nm: string;
}

/** Body sent when updating an existing user — all fields optional */
export type UpdateUserPayload = Partial<
  Omit<CreateDeptPayload, "dept_nm"> & {
    dept_nm: deptDto["dept_nm"];
  }
>;

// ── service ──────────────────────────────────────────────────────────────────

export const roleService = {
  /**
   * 사용자 목록 조회
   * GET /api/users
   */
  list(): Promise<ApiResult<roleDto[]>> {
    return apiClient.get<roleDto[]>("/api/roles/list");
  },

  /**
   * 단일 사용자 조회
   * GET /api/roles/:role_cd
   */
  get(role_cd: string): Promise<ApiResult<roleDto>> {
    return apiClient.get<roleDto>(`/api/roles/${role_cd}`);
  },

  /**
   * 회원가입 (사용자 생성)
   * POST /api/users
   *
   * @example
   * const result = await userService.create({ name, email, password, role, department });
   * if (result.ok) console.log(result.data.id);
   * else console.error(result.message);
   */
  create(payload: CreateRolePayload): Promise<ApiResult<roleDto>> {
    return apiClient.post<roleDto>("/api/roles", payload);
  },

  /**
   * 회원 정보 수정
   * PATCH /api/roles/:role_cd
   *
   * @example
   * const result = await roleService.update("role_cd", { role_nm: "새로운 역할 이름" });
   */
  update(role_cd: string, payload: Partial<roleDto>): Promise<ApiResult<roleDto>> {
    return apiClient.patch<roleDto>(`/api/roles/${role_cd}`, payload);
  },

  /**
   * 회원 삭제
   * DELETE /api/roles/:role_cd
   *
   * @example
   * const result = await roleService.remove("role_cd");
   * if (!result.ok) alert(result.message);
   */
  remove(role_cd: string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/roles/${role_cd}`);
  },

  /**
   * 회원 일괄 삭제
   * DELETE /api/roles/:role_cd  (순차 실행)
   * 모든 결과를 반환하므로 실패한 role_cd만 재처리 가능.
   */
  async removeMany(rols_cds: string[]): Promise<{ role_cd: string; result: ApiResult<void> }[]> {
    return Promise.all(
      rols_cds.map(async (role_cd) => ({ role_cd: role_cd, result: await roleService.remove(role_cd) }))
    );
  },
};

export const deptService = {
  /**
   * 사용자 목록 조회
   * GET /api/users
   */
  list(): Promise<ApiResult<deptDto[]>> {
    return apiClient.get<deptDto[]>("/api/depts/list");
  },

  /**
   * 단일 사용자 조회
   * GET /api/depts/:dept_cd
   */
  get(dept_cd: string): Promise<ApiResult<deptDto>> {
    return apiClient.get<deptDto>(`/api/depts/${dept_cd}`);
  },

  /**
   * 회원가입 (사용자 생성)
   * POST /api/depts
   *
   * @example
   * const result = await deptService.create({ dept_cd, dept_nm });
   * if (result.ok) console.log(result.data.id);
   * else console.error(result.message);
   */
  create(payload: CreateDeptPayload): Promise<ApiResult<deptDto>> {
    return apiClient.post<deptDto>("/api/depts", payload);
  },

  /**
   * 회원 정보 수정
   * PATCH /api/depts/:dept_cd
   *
   * @example
   * const result = await deptService.update("dept_cd", { dept_nm: "새로운 부서 이름" });
   */
  update(dept_cd: string, payload: Partial<deptDto>): Promise<ApiResult<deptDto>> {
    return apiClient.patch<deptDto>(`/api/depts/${dept_cd}`, payload);
  },

  /**
   * 회원 삭제
   * DELETE /api/depts/:dept_cd
   *
   * @example
   * const result = await deptService.remove("dept_cd");
   * if (!result.ok) alert(result.message);
   */
  remove(dept_cd: string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/depts/${dept_cd}`);
  },

  /**
   * 회원 일괄 삭제
   * DELETE /api/depts/:dept_cd  (순차 실행)
   * 모든 결과를 반환하므로 실패한 dept_cd만 재처리 가능.
   */
  async removeMany(dept_cds: string[]): Promise<{ dept_cd: string; result: ApiResult<void> }[]> {
    return Promise.all(
      dept_cds.map(async (dept_cd) => ({ dept_cd, result: await deptService.remove(dept_cd) }))
    );
  },
};