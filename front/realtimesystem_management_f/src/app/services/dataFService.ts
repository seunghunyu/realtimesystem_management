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

interface FieldItem {
  fieldNm: string;
  fieldVal: string;
  fieldType: string;
}

export interface DataFormatDto {
  formatId:string;
  formatNm:string;
  formatDesc:string;
  fieldInfos: FieldItem[];
  createdAt: string;
  
}

/** Body sent when registering a new user */
export interface CreateDataFormatPayload {
  formatId:string;
  formatNm:string;
  formatDesc:string;
  fieldInfos: FieldItem[];
  createdAt: string;
}

/** Body sent when updating an existing user — all fields optional */
export type UpdateDataFormatPayload = Partial<
  Omit<CreateDataFormatPayload, "formatNm"> & {
    formatNm: DataFormatDto["formatNm"];
    formatDesc: DataFormatDto["formatDesc"];
    fieldInfos: DataFormatDto["fieldInfos"];
  }
>;

// ── service ──────────────────────────────────────────────────────────────────

export const dataFService = {
  /**
   * 데이터 포맷 목록 조회
   * GET /api/dformat
   */
  list(): Promise<ApiResult<DataFormatDto[]>> {
    return apiClient.get<DataFormatDto[]>("/api/dformat/list");
  },

  /**
   * 단일 포맷 조회
   * GET /api/dformat/:id
   */
  get(id: string): Promise<ApiResult<DataFormatDto>> {
    return apiClient.get<DataFormatDto>(`/api/dformat/${id}`);
  },

  /**
   * 데이터 포맷 생성 
   * POST /api/dformat/save
   *
   * @example
   * const result = await userService.create({ formatId, formatNm, formatDesc, fieldInfo });
   * if (result.ok) console.log(result.data.id);
   * else console.error(result.message);
   */
  create(payload: CreateDataFormatPayload): Promise<ApiResult<DataFormatDto>> {
    return apiClient.post<DataFormatDto>("/api/dformat/save", payload);
  },

  /**
   * 데이터 포맷 수정
   * PATCH /api/users/:id
   *
   * @example
   * const result = await userService.update("DF000001", 
   * { formatNm: "카드이용고객 포맷",fomatDesc:"카드이용고객에대한 payload", fieldInfo[fieldNm:"sido",fieldVal:"서울특별시",fieldType:"STRING"] });
   */
  update(id: string, payload: UpdateDataFormatPayload): Promise<ApiResult<DataFormatDto>> {
    return apiClient.patch<DataFormatDto>(`/api/users/${id}`, payload);
  },

  /**
   * 데이터 포맷 삭제 삭제
   * DELETE /api/dformat/:id
   *
   * @example
   * const result = await userService.remove("abc123");
   * if (!result.ok) alert(result.message);
   */
  remove(id: string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/dformat/${id}`);
  },

  /**
   * 회원 일괄 삭제
   * DELETE /api/dformat/:id  (순차 실행)
   * 모든 결과를 반환하므로 실패한 id만 재처리 가능.
   */
  async removeMany(ids: string[]): Promise<{ id: string; result: ApiResult<void> }[]> {
    return Promise.all(
      ids.map(async (id) => ({ id, result: await dataFService.remove(id) }))
    );
  },
};
