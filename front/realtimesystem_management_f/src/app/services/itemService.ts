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

export interface ItemDto {
  itemCd: string;
  itemNm: string;
  itemAlias: string;
  itemType: string;
  itemDesc: string;
  cdTblId: string;
  createdAt: string;
}

export interface ItemTypeDto {
  itemTypeCd: string;
  itemTypeNm: string;
}

export interface cdTblDto {
  cdTblId: string;
  cdTblNm: string;
}

/** Body sent when registering a new system variable */
export interface CreateItemPayload {
  itemCd: string;
  itemNm: string;
  itemAlias: string;
  itemType: string;
  itemDesc: string;
  cdTblId: string;
}

/** Body sent when updating an existing system variable — all fields optional */
export type UpdateItemPayload = Partial<
  Omit<CreateItemPayload, "itemCd"> & {
    itemNm: string;
    itemAlias: string;
    itemType: string;
    itemDesc: string;
    cdTblId: string;
  }
>;

// ── service ──────────────────────────────────────────────────────────────────

export const itemService = {
  /**
   * 아이템 목록 조회
   * GET /api/items
   */
  list(): Promise<ApiResult<ItemDto[]>> {
    return apiClient.get<ItemDto[]>("/api/items/list");
  },

  /**
   * 아이템 타입 목록 조회
   * GET /api/items/types
   */
  listItemTypes(): Promise<ApiResult<ItemTypeDto[]>> {
    return apiClient.get<ItemTypeDto[]>("/api/items/types");
  },

  /**
   * 아이템 코드 테이블 목록 조회
   * GET /api/items/cdTbls
   */
  listCdTbls(): Promise<ApiResult<cdTblDto[]>> {
    return apiClient.get<cdTblDto[]>("/api/items/cdtbls");
  },

  /**
   * 단일 아이템 조회
   * GET /api/items/:id
   */
  get(id: string): Promise<ApiResult<ItemDto>> {
    return apiClient.get<ItemDto>(`/api/items/${id}`);
  },

  /**
   * 아이템 생성
   * POST /api/items
   *
   * @example
   * const result = await itemService.create({ itemCd, itemNm, itemDesc });
   * if (result.ok) console.log(result.data.itemCd);
   * else console.error(result.message);
   */
  create(payload: CreateItemPayload): Promise<ApiResult<ItemDto>> {
    return apiClient.post<ItemDto>("/api/items/save", payload);
  },

  /**
   * 아이템 정보 수정
   * PATCH /api/items/:id
   *
   * @example
   * const result = await itemService.update("abc123", { itemNm: "새로운 아이템명", itemDesc: "새로운 아이템 설명" });
   */
  update(id: string, payload: UpdateItemPayload): Promise<ApiResult<ItemDto>> {
    return apiClient.patch<ItemDto>(`/api/items/${id}`, payload);
  },

  /**
   * 아이템 삭제
   * DELETE /api/items/:id
   *
   * @example
   * const result = await itemService.remove("abc123");
   * if (!result.ok) alert(result.message);
   */
  remove(id: string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/items/${id}`);
  },

  /**
   * 아이템 일괄 삭제
   * DELETE /api/items/:id  (순차 실행)
   * 모든 결과를 반환하므로 실패한 id만 재처리 가능.
   */
  async removeMany(ids: string[]): Promise<{ id: string; result: ApiResult<void> }[]> {
    return Promise.all(
      ids.map(async (id) => ({ id, result: await itemService.remove(id) }))
    );
  },
};
