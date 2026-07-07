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

export interface SysVarDto {
  sysCd: string;
  sysNm: string;
  sysDesc: string;
  createdAt: string;
}

/** Body sent when registering a new system variable */
export interface CreateSysVarPayload {
  sysCd: string;
  sysNm: string;
  sysDesc: string;
}

/** Body sent when updating an existing system variable — all fields optional */
export type UpdateSysVarPayload = Partial<
  Omit<CreateSysVarPayload, "sysCd"> & {
    sysNm: string;
    sysDesc: string;
  }
>;

// ── service ──────────────────────────────────────────────────────────────────

export const sysVarService = {
  /**
   * 시스템 변수 목록 조회
   * GET /api/sysvars
   */
  list(): Promise<ApiResult<SysVarDto[]>> {
    return apiClient.get<SysVarDto[]>("/api/sysvars/list");
  },

  /**
   * 단일 시스템 변수 조회
   * GET /api/sysvars/:id
   */
  get(id: string): Promise<ApiResult<SysVarDto>> {
    return apiClient.get<SysVarDto>(`/api/sysvars/${id}`);
  },

  /**
   * 시스템 변수 생성
   * POST /api/sysvars
   *
   * @example
   * const result = await sysVarService.create({ sysCd, sysNm, sysDesc });
   * if (result.ok) console.log(result.data.sysCd);
   * else console.error(result.message);
   */
  create(payload: CreateSysVarPayload): Promise<ApiResult<SysVarDto>> {
    return apiClient.post<SysVarDto>("/api/sysvars/save", payload);
  },

  /**
   * 시스템 변수 정보 수정
   * PATCH /api/sysvars/:id
   *
   * @example
   * const result = await sysVarService.update("abc123", { sysNm: "새로운 변수명", sysDesc: "새로운 변수 설명" });
   */
  update(id: string, payload: UpdateSysVarPayload): Promise<ApiResult<SysVarDto>> {
    return apiClient.patch<SysVarDto>(`/api/sysvars/${id}`, payload);
  },

  /**
   * 시스템 변수 삭제
   * DELETE /api/sysvars/:id
   *
   * @example
   * const result = await sysVarService.remove("abc123");
   * if (!result.ok) alert(result.message);
   */
  remove(id: string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/sysvars/${id}`);
  },

  /**
   * 시스템 변수 일괄 삭제
   * DELETE /api/sysvars/:id  (순차 실행)
   * 모든 결과를 반환하므로 실패한 id만 재처리 가능.
   */
  async removeMany(ids: string[]): Promise<{ id: string; result: ApiResult<void> }[]> {
    return Promise.all(
      ids.map(async (id) => ({ id, result: await sysVarService.remove(id) }))
    );
  },
};
