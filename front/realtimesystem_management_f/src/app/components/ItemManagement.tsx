import { useState, useMemo, useEffect } from "react";
import { itemService } from "../services/itemService";
import {
  Search,
  Filter,
  AddLarge,
  OverflowMenuHorizontal,
  Edit,
  TrashCan,
  ChevronDown,
  ChevronUp,
  Download,
  Renew,
  Close,
  CheckmarkFilled,
  WarningFilled,
} from "@carbon/icons-react";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { sysVarService } from "../services/sysVarService";

// ── types ──────────────────────────────────────────────────────
interface DataItem {
  itemCd?: string;
  itemNm: string;
  itemAlias: string;
  itemType?: string;
  itemDesc?: string;
  cdTblId?: string;
  createdAt: string;
  
}

interface FormState {
  itemCd?: string;
  itemNm: string;
  itemAlias?: string;
  itemType: string;
  itemDesc?: string;
  cdTblId?: string;
}

interface FormErrors {
  itemCd?: string;
  itemNm?: string;
  itemAlias?: string;
  itemType?: string;
  itemDesc?: string;
  cdTblId?: string;
}

interface itemTypes {
  itemTypeCd: string;
  itemTypeNm: string;
}

interface cdTbls {
  cdTblId: string;
  cdTblNm: string;  
}


const EMPTY_FORM: FormState = {
  itemCd: "", itemNm: "", itemAlias: "", itemType: "", itemDesc: "", cdTblId: "",
};

// ── helpers ────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}

function validateForm(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.itemNm.trim()) e.itemNm = "아이템 이름을 입력해주세요.";
  if (!f.itemType.trim()) {
    e.itemType = "아이템 타입을 선택해주세요.";
  }
  
  return e;
}

// ── Field component ────────────────────────────────────────────
function Field({ label, required, error, children }: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-neutral-300 text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-rose-400 text-xs flex items-center gap-1">
          <WarningFilled size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Registration Modal ─────────────────────────────────────────
function RegistrationModal({
  onClose,
  onSubmit,
  itemTypes,
  cdTbls,
}: {
  onClose: () => void;
  onSubmit: (item: DataItem) => void;  
  itemTypes: itemTypes[];
  cdTbls: cdTbls[];
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({
    itemNm: "",
    itemType: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const set = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    if (apiError) setApiError(null);
  };

  const handleSubmit = async () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError(null);

    // ── REST 요청: POST /api/users ──────────────────────────
    const result = await itemService.create({
      itemCd: form.itemCd? form.itemCd : "",
      itemNm: form.itemNm.trim(),
      itemType: form.itemType,
      itemAlias: form.itemAlias? form.itemAlias : "",
      itemDesc: form.itemDesc? form.itemDesc : "",
      cdTblId: form.cdTblId? form.cdTblId : "",
    });
    // ───────────────────────────────────────────────────────

    setLoading(false);

    // 서버가 성공 응답을 보낸 경우 → 서버 데이터 사용
    // 서버가 없거나 실패한 경우 → 낙관적 업데이트(optimistic update)로 로컬에 추가
    const newItem: DataItem =
      result.ok && result.data
        ? {
            itemCd: result.data.itemCd ?? "",
            itemNm: result.data.itemNm ?? "",
            itemType: result.data.itemType,
            itemAlias: result.data.itemAlias ?? "",
            itemDesc: result.data.itemDesc ?? "",
            cdTblId: result.data.cdTblId ?? "",
            createdAt: result.data.createdAt ?? today(),
            
          }
        : {
            itemCd: form.itemCd? form.itemCd : "",
            itemNm: form.itemNm? form.itemNm.trim() : "",
            itemType: form.itemType,
            itemAlias: form.itemAlias? form.itemAlias : "",
            itemDesc: form.itemDesc? form.itemDesc : "",
            cdTblId: form.cdTblId? form.cdTblId : "",
            createdAt: today(),
          };

    if (!result.ok) {
      // 네트워크 오류는 무시하고 낙관적으로 진행 (데모 환경 고려)
      // 실제 4xx/5xx 서버 에러는 사용자에게 노출
      if (result.status > 0) {
        setApiError(result.message);
        return;
      }
    }

    setSubmitted(true);
    setTimeout(() => {
      onSubmit(newItem);
      onClose();
    }, 900);
  };

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* panel */}
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 shrink-0">
          <div>
            <h2 className="text-neutral-50 text-lg font-semibold">아이템 등록</h2>
            <p className="text-neutral-500 text-xs mt-0.5">프로세스에서 사용할 아이템을 등록합니다</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors"
          >
            <Close size={16} />
          </button>
        </div>

        {/* success overlay */}
        {submitted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-900/95 rounded-2xl gap-3">
            <CheckmarkFilled size={48} className="text-green-400" />
            <p className="text-neutral-50 font-semibold text-lg">저장 완료</p>
            <p className="text-neutral-400 text-sm">아이템이 목록에 추가되었습니다.</p>
          </div>
        )}

        {/* form body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 relative" style={{ maxHeight: "60vh" }}>

          <Field label="아이템 명" required error={errors.itemNm}>
            <Input
              value={form.itemNm}
              onChange={e => set("itemNm", e.target.value)}
              placeholder="승인금액"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.itemNm ? "border-rose-500" : ""}`}
            />
          </Field>

          {/* <Field label="아이디" required error={errors.user_id}>
            <Input
              type="email"
              value={form.user_id}
              onChange={e => set("user_id", e.target.value)}
              placeholder="example@company.com"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.user_id ? "border-rose-500" : ""}`}
            />
          </Field> */}

          <Field label="아이템 별명" error={errors.itemAlias}>
            <Input
              value={form.itemAlias}
              onChange={e => set("itemAlias", e.target.value)}
              placeholder="아이템 별명"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.itemAlias ? "border-rose-500" : ""}`}
            />
          </Field>

          <Field label="아이템 타입" required error={errors.itemType}>
            <Select value={form.itemType} onValueChange={v => set("itemType", v)}>
              <SelectTrigger className={`bg-neutral-950 border-neutral-700 text-neutral-50 ${errors.itemType ? "border-rose-500" : ""}`}>
                <SelectValue placeholder="아이템 타입 선택" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map(r => <SelectItem key={r.itemTypeCd} value={r.itemTypeNm}>{r.itemTypeNm}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="아이템 설명" error={errors.itemDesc}>
            <Input
              value={form.itemDesc}
              onChange={e => set("itemDesc", e.target.value)}
              placeholder="아이템 설명"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.itemDesc ? "border-rose-500" : ""}`}
            />
          </Field>

          <Field label="코드 테이블" >
            <Select value={form.cdTblId} onValueChange={v => set("cdTblId", v)}>
              <SelectTrigger className={`bg-neutral-950 border-neutral-700 text-neutral-50 ${errors.cdTblId ? "border-rose-500" : ""}`}>
                <SelectValue placeholder="코드 테이블 선택" />
              </SelectTrigger>
              <SelectContent>
                {cdTbls.map(d => <SelectItem key={d.cdTblId} value={d.cdTblNm}>{d.cdTblNm}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <p className="text-neutral-600 text-xs pt-1">
            <span className="text-rose-400">*</span> 필수 입력 항목 
          </p>

          {apiError && (
            <div className="flex items-start gap-2 bg-rose-950/60 border border-rose-800 rounded-lg px-3 py-2.5">
              <WarningFilled size={14} className="text-rose-400 mt-0.5 shrink-0" />
              <p className="text-rose-300 text-xs leading-relaxed">{apiError}</p>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitted || loading}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-60 flex items-center gap-2 min-w-[130px] justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                처리 중...
              </>
            ) : (
              <>
                <AddLarge size={14} />
                아이템 등록
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main grid ──────────────────────────────────────────────────
type SortField = keyof DataItem;
type SortDirection = "asc" | "desc";

export function ItemManagement() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [cdTbl, setCdTbls] = useState<cdTbls[]>([]);
  const [iType, setItemTypes] = useState<itemTypes[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("itemNm");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    const filtered = items.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.itemNm.toLowerCase().includes(q) ||
        item.itemAlias?.toLowerCase().includes(q) ||
        item.itemDesc?.toLowerCase().includes(q);
      
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [items, searchQuery, statusFilter, departmentFilter, sortField, sortDirection]);

  // const departments = Array.from(new Set(users.map(u => u.dept_nm)));
  // const roles = Array.from(new Set(users.map(u => u.role_cd)));

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedData.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(filteredAndSortedData.map(i => i.itemCd? i.itemCd : "")));
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const deleteSelected = async () => {
    const ids = Array.from(selectedItems);
    // 낙관적 업데이트 먼저
    setItems(prev => prev.filter(i => !selectedItems.has(i.itemCd? i.itemCd : "")));
    setSelectedItems(new Set());
    // REST 요청: DELETE /api/items/:id (병렬)
    await itemService.removeMany(ids);
  };

  
  const deleteItem = async (id: string) => {
     // 낙관적 업데이트 먼저
     setItems(prev => prev.filter(i => i.itemCd !== id));
     setSelectedItems(prev => { const n = new Set(prev); n.delete(id); return n; });
     // REST 요청: DELETE /api/items/:id
     await itemService.remove(id);
   };
  const addItem = (item: DataItem) => {
     setItems(prev => [item, ...prev]);
  };

  const getItems = async () => {
     await itemService.list().then(res => {
       if (res.ok && res.data) {
         console.log("Items:", res.data);
         setItems(res.data);
       } else {
         console.error("Failed to fetch items:");
       }
     });
  };

  const getItemTypes = async () => {
    await sysVarService.get("ITEM_TYPE_LIST").then(res => {
      if (res.ok && res.data) {
        console.log("ITEM_TYPE_LIST:", res.data);
        setItemTypes([]);
        let types:string = res.data.sysDesc;
        let itemTypeList = types.split("*");
        for(let i = 0 ; i<itemTypeList.length; i++){
          let itemType = itemTypeList[i].split(";");
          let itemTypeCd = itemType[0];
          let itemTypeNm = itemType[1];
          setItemTypes(prev => [...prev, {itemTypeCd, itemTypeNm}]);
        }
      } else {
        console.error("Failed to fetch ITEM_TYPE_LIST");
      }
    });
  };

  const getCdTbls = async () => {
    await itemService.listCdTbls().then(res => {
      if (res.ok && res.data) {
        console.log("Code Tables:", res.data);
        //setCdTbls(res.data);
      } else {
        console.error("Failed to fetch code tables:");
      }
    });
  }; 


  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
      : null;

  useEffect( () => {
    getItems(); //아이템 정보
    getItemTypes(); //아이템 타입
    getCdTbls(); //코드 테이블
  }, []); // []로 두면 컴포넌트가 처음 켜질 때 한번만 실행



  return (
    <>
      {showModal && (
        <RegistrationModal
          onClose={() => setShowModal(false)}
          onSubmit={addItem}
          itemTypes={iType}
          cdTbls={cdTbl}
        />
      )}

      <div className="flex-1 h-full bg-neutral-950 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">

          {/* header */}
          <div className="mb-6">
            <h1 className="font-semibold text-3xl text-neutral-50 mb-1">아이템 관리</h1>
            {/* <p className="text-neutral-400 text-sm">사용자 데이터를 관리하고 필터링하세요</p> */}
          </div>

          {/* toolbar */}
          <div className="bg-neutral-900 rounded-xl p-4 mb-5 border border-neutral-800">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* search */}
              <div className="flex-1 max-w-md relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <Input
                  placeholder="아이템 명, 아이템 별명, 아이템 설명으로 검색..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 bg-neutral-950 border-neutral-800 text-neutral-50 placeholder:text-neutral-600 h-9"
                />
              </div>

              {/* filters + actions */}
              <div className="flex gap-2 items-center flex-wrap">
                <button
                  onClick={() => setShowModal(true)}
                  className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <AddLarge size={15} />
                  새로운 항목
                </button>
              </div>
            </div>

            {/* bulk action bar */}
            {selectedItems.size > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-300 text-sm">
                  <span className="font-semibold text-blue-400">{selectedItems.size}개</span> 항목 선택됨
                </span>
                <div className="flex gap-2">
                  <button className="h-8 px-3 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-300 hover:bg-neutral-800 text-sm flex items-center gap-1.5 transition-colors">
                    <Edit size={13} />편집
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="h-8 px-3 rounded-lg border border-rose-800 bg-rose-950 text-rose-400 hover:bg-rose-900 text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <TrashCan size={13} />삭제
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* count */}
          <p className="text-neutral-500 text-sm mb-3">
            총 <span className="text-neutral-300 font-medium">{filteredAndSortedData.length}</span>개
          </p>

          {/* table */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-transparent">
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-neutral-600 bg-neutral-950 accent-blue-500"
                    />
                  </TableHead>
                  {([
                    { field: "itemName" as SortField, label: "아이템 명" },
                    { field: "itemAlias" as SortField, label: "아이템 별명" },
                    { field: "itemDesc" as SortField, label: "아이템 설명" },
                  ]).map(col => (
                    <TableHead
                      key={col.field}
                      className="cursor-pointer select-none text-neutral-400 hover:text-neutral-200 transition-colors"
                      onClick={() => handleSort(col.field)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon field={col.field} />
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-neutral-400">아이템 타입</TableHead>
                  <TableHead className="text-neutral-400">코드 테이블</TableHead>   
                  <TableHead className="text-neutral-400">생성일</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map(item => (
                  <TableRow
                    key={item.itemCd}
                    className="border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.itemCd? item.itemCd : "")}
                        onChange={() => toggleSelectItem(item.itemCd? item.itemCd : "")}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-950 accent-blue-500"
                      />
                    </TableCell>
                    <TableCell className="text-neutral-50 font-medium">{item.itemNm}</TableCell>
                    <TableCell className="text-neutral-400 text-sm">{item.itemAlias}</TableCell>
                    <TableCell className="text-neutral-300 text-sm">{item.itemDesc}</TableCell>
                    <TableCell className="text-neutral-300 text-sm">{item.itemType}</TableCell>
                    <TableCell className="text-neutral-300 text-sm">{item.cdTblId}</TableCell>
                    <TableCell className="text-neutral-500 text-sm">{item.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="size-7 flex items-center justify-center rounded-md hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-neutral-50">
                            <OverflowMenuHorizontal size={14} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit size={13} className="mr-2" />편집
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-400 focus:text-rose-400"
                            onClick={() => deleteItem(item.itemCd? item.itemCd : "")}
                          >
                            <TrashCan size={13} className="mr-2" />삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAndSortedData.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-neutral-500">검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
