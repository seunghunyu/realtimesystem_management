import { useState, useMemo, useEffect } from "react";
import { campService } from "../services/campService";
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



// ── types ──────────────────────────────────────────────────────
interface DataItem {
  campId: string;
  campNm: string;
  campDesc: string;
  campBrch1: string;
  campBrch2: string;
  campType: string;
  campStat: string;
}

// interface CampBrch{
//   brchCd: string;
//   brchNm: string;
// }

// interface CampBrch2{
//   scndBrchCd: string;
//   scndBrchNm: string;
//   brchCd: string;
// }

interface CampBrch2{
  scndBrchCd: string;
  scndBrchNm: string;
  useCd: string;
}
interface CampBrch1{
  brchCd: string;
  brchNm: string;
  useCd: string;
  scndBrchs: CampBrch2[];
}


interface FormState {
  campId: string;
  campNm: string;
  campDesc: string;
  campBrch1: string;
  campBrch2: string;
  campType: string;
  campStat: string;
}

interface FormErrors {
  campId?: string;
  campNm?: string;
  campDesc?: string;
  campBrch1?: string;
  campBrch2?: string;
  campType?: string;
  campStat?: string;
}

interface CampManagementProps {
  onNavigateToBuilder?: () => void; // Optional로 지정하여 안전 장치를 둡니다.
}

// ── initial data ───────────────────────────────────────────────
const EMPTY_FORM: FormState = {
  campId: "", campNm: "", campDesc: "", campBrch1: "",
  campBrch2: "", campType: "", campStat: "",
};

// ── helpers ────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}

function validateForm(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.campNm.trim()) e.campNm = "캠페인 명을 입력해주세요.";
  if (!f.campBrch1.trim()) e.campBrch1 = "캠페인 분류를 선택해주세요.";
  if (!f.campBrch2) e.campBrch2 = "캠페인 2차 분류를 선택해주세요.";
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
  campBrch1,
  campBrch2,
  onNavigateToBuilder
}: {
  onClose: () => void;
  onSubmit: (item: DataItem) => void;
  campBrch1: CampBrch1[];
  campBrch2: CampBrch2[];
  onNavigateToBuilder?: () => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filteredSubBranches, setFilteredSubBranches] = useState<CampBrch2[]>([]);



  const set = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    if (apiError) setApiError(null);
  };
  const handleMainBranchChange = (selectedBrchCd: string) => {
    // 1) 대분류 선택값 폼 상태 저장 (React Form 라이브러리 설정 등)
    //set("campBrch", selectedBrchCd); 
    set("campBrch1", selectedBrchCd);
    // 2) 소분류 선택값은 대분류가 바뀌었으므로 초기화
    set("campBrch2", ""); 
    
    if (!selectedBrchCd) {
      setFilteredSubBranches([]);
      return;
    }

    // 3) API 호출 대신, 이미 들고 있는 데이터 Pool에서 해당 대분류 객체를 찾음
    const selectedBranch = campBrch1.find(b => b.brchCd === selectedBrchCd);
    
    if (selectedBranch) {
      // 찾은 대분류 내부의 subBranches 리스트를 소분류 State에 즉시 주입 (화면 자동 갱신)
      setFilteredSubBranches(selectedBranch.scndBrchs || []);
    } else {
      setFilteredSubBranches([]);
    }
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
    const result = await campService.create({
      campId: form.campId,
      campNm: form.campNm,
      campDesc: form.campDesc,
      campBrch1: form.campBrch1,
      campBrch2: form.campBrch2,
      campStat: form.campStat,
      campType: form.campType,
    });
    // ───────────────────────────────────────────────────────

    setLoading(false);

    // 서버가 성공 응답을 보낸 경우 → 서버 데이터 사용
    // 서버가 없거나 실패한 경우 → 낙관적 업데이트(optimistic update)로 로컬에 추가
    const newItem: DataItem =
      result.ok && result.data
        ? {
            campId: result.data.campId,
            campNm: result.data.campNm,
            campDesc: result.data.campDesc,
            campBrch1: result.data.campBrch1,
            campBrch2: result.data.campBrch2,
            campStat: result.data.campStat ?? "100",
            campType: result.data.campType ?? "real",
          }
        : {
            campId: form.campId,
            campNm: form.campNm,
            campDesc: "100",
            campBrch1: form.campBrch1,
            campBrch2: form.campBrch2,
            campStat: form.campStat,
            campType: form.campType,
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
    onSubmit(newItem);
    // 등록 후 화면이 안닫히도록 주석 
    // setTimeout(() => {
    //   onSubmit(newItem);
    //   onClose();
    // }, 900);
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
            <h2 className="text-neutral-50 text-lg font-semibold">캠페인 등록</h2>
            <p className="text-neutral-500 text-xs mt-0.5">캠페인을 등록합니다</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors"
          >
            <Close size={16} />
          </button>
        </div>

        {/* success overlay */}
        {/* {submitted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-900/95 rounded-2xl gap-3">
            <CheckmarkFilled size={48} className="text-green-400" />
            <p className="text-neutral-50 font-semibold text-lg">캠페인 등록 완료!</p>
            <p className="text-neutral-400 text-sm">캠페인 목록에 추가되었습니다.</p>
          </div>
        )} */}
        {submitted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-900/95 rounded-2xl gap-4 p-6">
            {/* 1. 완료 상태 아이콘 및 문구 */}
            <CheckmarkFilled size={48} className="text-green-400" />
            <div className="text-center space-y-1">
              <p className="text-neutral-50 font-semibold text-lg">캠페인 등록 완료!</p>
              <p className="text-neutral-400 text-sm">캠페인 목록에 추가되었습니다.</p>
            </div>

            {/* 2. 추가된 질문 문구 */}
            <p className="text-neutral-200 text-sm font-medium mt-2">
              설계 화면으로 이동하시겠습니까?
            </p>

            {/* 3. "네 / 아니오" 버튼 영역 */}
            <div className="flex items-center gap-3 w-full max-w-[240px] mt-2">
              {/* '아니오' 버튼: 모달을 닫고 캠페인 목록에 그대로 머뭄 */}
              <button
                type="button"
                onClick={onClose} // 💡 부모에게 모달을 닫으라고 요청 (목록 화면 그대로 유지)
                className="flex-1 py-2 rounded-lg text-sm font-medium text-neutral-400 bg-neutral-800 hover:bg-neutral-750 active:bg-neutral-800 transition-colors border border-neutral-700"
              >
                아니오
              </button>

              {/* '네' 버튼: 설계 화면(CampBuilder)으로 즉시 이동 */}
              <button
                type="button"
                onClick={() => {
                  onClose(); // 💡 먼저 모달 창을 닫아줍니다.
                  onNavigateToBuilder?.(); //함수 존재할때만 뷰 전환
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-neutral-950 bg-green-400 hover:bg-green-300 active:bg-green-500 transition-colors font-semibold"
              >
                네
              </button>
            </div>
          </div>
        )}
        {/* form body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 relative" style={{ maxHeight: "60vh" }}>
          {/* 대분류 Select */}
        <Field label="캠페인 분류" required error={errors.campBrch1}>
          <Select 
            value={form.campBrch1} 
            onValueChange={(v) => handleMainBranchChange(v)} // 💡 이 부분에서 커스텀 핸들러 함수 호출!
          >
            <SelectTrigger className={`bg-neutral-950 border-neutral-700 text-neutral-50 ${errors.campBrch1 ? "border-rose-500" : ""}`}>
              <SelectValue placeholder="분류 선택" />
            </SelectTrigger>
            <SelectContent>
              {/* 백엔드에서 통째로 긁어온 대분류 풀(Pool)을 그려줍니다. */}
              {campBrch1.map(r => (
                <SelectItem key={r.brchCd} value={r.brchCd}>{r.brchNm}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* 소분류 Select */}
        <Field label="캠페인 소분류" required error={errors.campBrch2}>
          <Select 
            value={form.campBrch2} 
            onValueChange={(v) => set("campBrch2", v)} // 소분류 선택 값 설정
            disabled={filteredSubBranches.length === 0} // 대분류를 고르기 전이거나 하위 소분류가 없으면 콤보박스 비활성화
          >
            <SelectTrigger className={`bg-neutral-950 border-neutral-700 text-neutral-50 ${errors.campBrch2 ? "border-rose-500" : ""}`}>
              <SelectValue placeholder="소분류 선택" />
            </SelectTrigger>
            <SelectContent>
              {/* 💡 기존의 전체 목록(campBrch2) 대신 필터링 완료된 데이터(filteredSubBranches)를 돌려줍니다! */}
              {filteredSubBranches.map(d => (
                <SelectItem key={d.scndBrchCd} value={d.scndBrchCd}>{d.scndBrchNm}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

          <Field label="캠페인 명" required error={errors.campNm}>
            <Input
              value={form.campNm}
              onChange={e => set("campNm", e.target.value)}
              placeholder="카드이용 고객 승인 감지 캠페인"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.campNm ? "border-rose-500" : ""}`}
            />
          </Field>

          <Field label="캠페인 설명" required error={errors.campDesc}>
            <textarea
              value={form.campDesc}
              onChange={e => set("campDesc", e.target.value)}
              placeholder="카드승인 고객 대상으로 승인금액 20만원 이상 고객에게 이벤트 관련 APP PUSH 발송"
              className={`w-full h-32 p-3 bg-neutral-950 border border-neutral-700 rounded text-sm text-neutral-50 font-mono placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none resize-none ${errors.campDesc ? "border-rose-500" : ""}`}
            />
          </Field>

          <p className="text-neutral-600 text-xs pt-1">
            <span className="text-rose-400">*</span> 필수 입력 항목 / 등록 후 상태는 <span className="text-yellow-500">설계중</span>으로 설정됩니다.
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
                캠페인 등록
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

export function CampManagement({ onNavigateToBuilder }: CampManagementProps) {
  const [camp, setCamp] = useState<DataItem[]>([]);
  const [campBrch1, setCampBrch] = useState<CampBrch1[]>([]);
  const [campBrch2, setCampBrch2] = useState<CampBrch2[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("campNm");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    const filtered = camp.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.campNm.toLowerCase().includes(q) ||
        item.campId.toLowerCase().includes(q) || item.campDesc.toLowerCase().includes(q);;
      const matchesStatus = statusFilter === "all" || item.campStat === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [camp, searchQuery, statusFilter, departmentFilter, sortField, sortDirection]);

  // const departments = Array.from(new Set(users.map(u => u.dept_nm)));
  // const roles = Array.from(new Set(users.map(u => u.role_cd)));

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedData.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(filteredAndSortedData.map(i => i.campId)));
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
    setCamp(prev => prev.filter(u => !selectedItems.has(u.campId)));
    setSelectedItems(new Set());
    // REST 요청: DELETE /api/users/:id (병렬)
    await campService.removeMany(ids);
  };

  const deleteCamp = async (id: string) => {
    // 낙관적 업데이트 먼저
    setCamp(prev => prev.filter(u => u.campId !== id));
    setSelectedItems(prev => { const n = new Set(prev); n.delete(id); return n; });
    // REST 요청: DELETE /api/users/:id
    await campService.remove(id);
  };

  const addCamp = (item: DataItem) => {
    setCamp(prev => [item, ...prev]);
  };

  const getCamp = async () => {
    await campService.list().then(res => {
      if (res.ok && res.data) {
        console.log("Camp:", res.data);
        setCamp(res.data);
      } else {
        console.error("Failed to fetch users:");
      }
    });
  };

  const getCampBrch = async () => {
    await campService.brchList().then(res => {
      if (res.ok && res.data) {
        console.log("CampBrch:", res.data);
        setCampBrch(res.data);
      } else {
        console.error("Failed to fetch roles:");
      }
    });
  };

  // const getCampBrch2 = async () => {
  //   await campService.brch2List().then(res => {
  //     if (res.ok && res.data) {
  //       console.log("CampBrch2:", res.data);
  //       setCampBrch2(res.data);
  //     } else {
  //       console.error("Failed to fetch departments:");
  //     }
  //   });
  // };
  
  
// 100 설계 중
// 200 설계 완료
// 250 승인 요청
// 260 반려
// 300 테스트 수행 중
// 310 수행 중
// 400 수행 완료 
// 500 중지
  const getStatusBadge = (campStat: string) => {
    switch (campStat) {
      case "100":  return <Badge className="bg-green-600 hover:bg-green-700 text-xs">설계 중</Badge>;
      case "200":return <Badge className="bg-neutral-600 hover:bg-neutral-700 text-xs">설계 완료</Badge>;
      case "250":return <Badge className="bg-neutral-600 hover:bg-neutral-700 text-xs">승인 요청</Badge>;
      case "260":return <Badge className="bg-neutral-600 hover:bg-neutral-700 text-xs">반려</Badge>;
      case "300": return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-xs">테스트 수행 중</Badge>;
      case "310": return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-xs">수행 중</Badge>;
      case "400": return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-xs">수행 완료</Badge>;
      case "500": return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-xs">중지</Badge>;
      default:        return <Badge className="text-xs">{campStat}</Badge>;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
      : null;

  useEffect( () => {
    getCampBrch(); //캠페인 분류 정보
    // getCampBrch2(); //캠페인 2차 분류 정보
    getCamp(); //캠페인 정보
  }, []); // []로 두면 컴포넌트가 처음 켜질 때 한번만 실행



  return (
    <>
      {showModal && (
        <RegistrationModal
          onClose={() => setShowModal(false)}
          onSubmit={addCamp}
          campBrch1={campBrch1} 
          campBrch2={campBrch2}
          onNavigateToBuilder={onNavigateToBuilder}
        />
      )}

      <div className="flex-1 h-full bg-neutral-950 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">

          {/* header */}
          <div className="mb-6">
            <h1 className="font-semibold text-3xl text-neutral-50 mb-1">캠페인 관리</h1>
            {/* <p className="text-neutral-400 text-sm">사용자 데이터를 관리하고 필터링하세요</p> */}
          </div>

          {/* toolbar */}
          <div className="bg-neutral-900 rounded-xl p-4 mb-5 border border-neutral-800">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* search */}
              <div className="flex-1 max-w-md relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <Input
                  placeholder="캠페인 명, 캠페인 설명으로 검색..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 bg-neutral-950 border-neutral-800 text-neutral-50 placeholder:text-neutral-600 h-9"
                />
              </div>

              {/* filters + actions */}
              <div className="flex gap-2 items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-neutral-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 w-[130px] bg-neutral-950 border-neutral-800 text-neutral-50 text-sm">
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 상태</SelectItem>
                      <SelectItem value="100">설계 중</SelectItem>
                      <SelectItem value="200">설계 완료</SelectItem>
                      <SelectItem value="250">승인 요청</SelectItem>
                      <SelectItem value="260">반려</SelectItem>
                      <SelectItem value="300">테스트 수행 중</SelectItem>
                      <SelectItem value="310">수행 중</SelectItem>
                      <SelectItem value="400">수행 완료</SelectItem>
                      <SelectItem value="500">중지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="h-9 w-[150px] bg-neutral-950 border-neutral-800 text-neutral-50 text-sm">
                    <SelectValue placeholder="캠페인 분류" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 분류</SelectItem>
                    {campBrch1.map(d => <SelectItem key={d.brchCd} value={d.brchNm}>{d.brchNm}</SelectItem>)}
                  </SelectContent>
                </Select>

                <button
                  onClick={() => setShowModal(true)}
                  className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <AddLarge size={15} />
                  캠페인 등록
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
            총 <span className="text-neutral-300 font-medium">{filteredAndSortedData.length}</span>명
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
                    { field: "campNm" as SortField, label: "캠페인 명" },
                    { field: "campDesc" as SortField, label: "캠페인 설명" },
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
                  <TableHead className="text-neutral-400">상태</TableHead>
                  <TableHead
                    className="cursor-pointer select-none text-neutral-400 hover:text-neutral-200 transition-colors"
                    onClick={() => handleSort("campBrch1")}
                  >
                    <div className="flex items-center gap-1">분류<SortIcon field="campBrch1" /></div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none text-neutral-400 hover:text-neutral-200 transition-colors"
                    onClick={() => handleSort("campBrch2")}
                  >
                    <div className="flex items-center gap-1">소분류<SortIcon field="campBrch2" /></div>
                  </TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map(item => (
                  <TableRow
                    key={item.campId}
                    className="border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.campId)}
                        onChange={() => toggleSelectItem(item.campId)}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-950 accent-blue-500"
                      />
                    </TableCell>
                    <TableCell className="text-neutral-50 font-medium">{item.campNm}</TableCell>
                    <TableCell className="text-neutral-400 text-sm">{item.campId}</TableCell>
                    <TableCell>{getStatusBadge(item.campStat)}</TableCell>
                    <TableCell className="text-neutral-300 text-sm">{item.campBrch1}</TableCell>
                    <TableCell className="text-neutral-300 text-sm">{item.campBrch2}</TableCell>
                    {/* <TableCell className="text-neutral-500 text-sm">{item.createdAt}</TableCell> */}
                    {/* <TableCell className="text-neutral-500 text-sm">{item.lastActive}</TableCell> */}
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
                            onClick={() => deleteCamp(item.campId)}
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
