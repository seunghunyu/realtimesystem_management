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

export interface CampDto {
  campId: string;
  campNm: string;
  campDesc: string;
  campBrch1: string;
  campBrch2: string;
  campType: string;
  campStat: string;
}

/** Body sent when registering a new user */
export interface CreateCampPayload {
  campId: string;
  campNm: string;
  campDesc: string;
  campBrch1: string;
  campBrch2: string;
  campType: string;
  campStat: string;
}

/** Body sent when updating an existing user — all fields optional */
export type UpdateCampPayload = Partial<
  Omit<CreateCampPayload, "campId"> & {
    campNm: string;
    campDesc: string;
    campBrch1: string;
    campBrch2: string;
  }
>;

// export interface CampBrch{
//   brchCd: string;
//   brchNm: string;
// }

// export interface CampBrch2{
//   scndBrchCd: string;
//   scndBrchNm: string; 
//   brchCd: string;
// }

export interface CampBrch2{
  scndBrchCd: string;
  scndBrchNm: string;
  useCd: string;
}
export interface CampBrch1{
  brchCd: string;
  brchNm: string;
  useCd: string;
  scndBrchs: CampBrch2[];
}


// ── service ──────────────────────────────────────────────────────────────────

export const campService = {
  /**
   * 캠페인 목록 조회
   * GET /api/camp
   */
  list(): Promise<ApiResult<CampDto[]>> {
    return apiClient.get<CampDto[]>("/api/camp/list");
  },

  /**
   * 캠페인 분류 조회
   * GET /api/camp/brch
   */
  brchList(): Promise<ApiResult<CampBrch1[]>> {
    return apiClient.get<CampBrch1[]>("/api/camp/brch/list");
  },

/**
   * 캠페인 2차 분류 조회
   * GET /api/camp/brch2
   */
  brch2List(): Promise<ApiResult<CampBrch2[]>> {
    return apiClient.get<CampBrch2[]>("/api/camp/brch2/list");
  },


  /**
   * 단일 캠페인 조회
   * GET /api/camp/:id
   */
  get(id: string): Promise<ApiResult<CampDto>> {
    return apiClient.get<CampDto>(`/api/camp/${id}`);
  },

  /**
   * 캠페인 생성
   * POST /api/camp
   *
   * @example
   * const result = await userService.create({ name, email, password, role, department });
   * if (result.ok) console.log(result.data.id);
   * else console.error(result.message);
   */
  create(payload: CreateCampPayload): Promise<ApiResult<CampDto>> {
    return apiClient.post<CampDto>("/api/camp/save", payload);
  },

  /**
   * 회원 정보 수정
   * PATCH /api/users/:id
   *
   * @example
   * const result = await campService.update("C00001", { "campNm" : "캠페인 명 변경" , "campDesc"  : "신규 가입 고객 대상 캠페인" });
   */
  update(id: string, payload: UpdateCampPayload): Promise<ApiResult<CampDto>> {
    return apiClient.patch<CampDto>(`/api/camp/${id}`, payload);
  },

  /**
   * 회원 삭제
   * DELETE /api/camp/:id
   *
   * @example
   * const result = await userService.remove("abc123");
   * if (!result.ok) alert(result.message);
   */
  remove(id: string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/camp/${id}`);
  },

  /**
   * 회원 일괄 삭제
   * DELETE /api/camp/:id  (순차 실행)
   * 모든 결과를 반환하므로 실패한 id만 재처리 가능.
   */
  async removeMany(ids: string[]): Promise<{ id: string; result: ApiResult<void> }[]> {
    return Promise.all(
      ids.map(async (id) => ({ id, result: await campService.remove(id) }))
    );
  },
};
