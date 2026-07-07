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

export interface UserDto {
  userId: string;
  userName: string;
  stat: "active" | "inactive" | "pending";
  roleCd: string;
  roleNm: string;
  deptCd: string;
  deptNm: string;
  address?: string;
  createdAt: string;
  lastActive: string;
}

/** Body sent when registering a new user */
export interface CreateUserPayload {
  userId: string;
  userName: string;
  /** plain-text; the server must hash it */
  password: string;
  roleCd: string;
  roleNm: string;
  deptCd: string;
  deptNm: string;
  address?: string;
}

/** Body sent when updating an existing user — all fields optional */
export type UpdateUserPayload = Partial<
  Omit<CreateUserPayload, "password"> & {
    stat: UserDto["stat"];
    newPassword: string;
  }
>;

// ── service ──────────────────────────────────────────────────────────────────

export const userService = {
  /**
   * 사용자 목록 조회
   * GET /api/users
   */
  list(): Promise<ApiResult<UserDto[]>> {
    return apiClient.get<UserDto[]>("/api/users/list");
  },

  /**
   * 단일 사용자 조회
   * GET /api/users/:id
   */
  get(id: string): Promise<ApiResult<UserDto>> {
    return apiClient.get<UserDto>(`/api/users/${id}`);
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
  create(payload: CreateUserPayload): Promise<ApiResult<UserDto>> {
    return apiClient.post<UserDto>("/api/users/save", payload);
  },

  /**
   * 회원 정보 수정
   * PATCH /api/users/:id
   *
   * @example
   * const result = await userService.update("abc123", { role: "디자이너" });
   */
  update(id: string, payload: UpdateUserPayload): Promise<ApiResult<UserDto>> {
    return apiClient.patch<UserDto>(`/api/users/${id}`, payload);
  },

  /**
   * 회원 삭제
   * DELETE /api/users/:id
   *
   * @example
   * const result = await userService.remove("abc123");
   * if (!result.ok) alert(result.message);
   */
  remove(id: string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/users/${id}`);
  },

  /**
   * 회원 일괄 삭제
   * DELETE /api/users/:id  (순차 실행)
   * 모든 결과를 반환하므로 실패한 id만 재처리 가능.
   */
  async removeMany(ids: string[]): Promise<{ id: string; result: ApiResult<void> }[]> {
    return Promise.all(
      ids.map(async (id) => ({ id, result: await userService.remove(id) }))
    );
  },
};
