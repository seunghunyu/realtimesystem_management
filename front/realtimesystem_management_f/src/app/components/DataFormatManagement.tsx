import { useState, useMemo } from "react";
import { userService } from "../services/userService";
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
  user_id: string;
  user_name: string;
  stat: "active" | "inactive" | "pending";
  role_cd: string;
  dept_nm: string;
  joinDate: string;
  lastActive: string;
  address?: string;
}

interface FormState {
  user_id : string;
  user_name: string;
  password: string;
  confirmPassword: string;
  address: string;
  role_cd: string;
  dept_nm: string;
}

interface FormErrors {
  user_id?: string;
  user_name?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  role_cd?: string;
  dept_nm?: string;
}

// ── initial data ───────────────────────────────────────────────
const INITIAL_DATA: DataItem[] = [
  { user_id: "kim.chulsoo@company.com", user_name: "김철수",  stat: "active", role_cd: "개발자", dept_nm: "엔지니어링", joinDate: "2024-01-15", lastActive: "2분 전" },
  { user_id: "lee.younghee@company.com", user_name: "이영희",  stat: "active", role_cd: "디자이너", dept_nm: "디자인", joinDate: "2024-02-20", lastActive: "5분 전" },
  { user_id: "park.jimin@company.com", user_name: "박지민",  stat: "pending", role_cd: "마케터", dept_nm: "마케팅", joinDate: "2024-03-10", lastActive: "1시간 전" },
];

const ROLES = ["개발자", "디자이너", "마케터", "프로젝트 매니저", "데이터 분석가", "UX 디자이너", "제품 매니저", "기타"];
const DEPARTMENTS = ["엔지니어링", "디자인", "마케팅", "애널리틱스", "제품", "기타"];

const EMPTY_FORM: FormState = {
  user_name: "", user_id: "", password: "", confirmPassword: "",
  address: "", role_cd: "", dept_nm: "",
};

// ── helpers ────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}

function validateForm(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.user_name.trim()) e.user_name = "이름을 입력해주세요.";
  if (!f.user_id.trim()) {
    e.user_id = "이메일을 입력해주세요.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.user_id)) {
    e.user_id = "올바른 이메일 형식이 아닙니다.";
  }
  if (!f.password) {
    e.password = "비밀번호를 입력해주세요.";
  } else if (f.password.length < 8) {
    e.password = "비밀번호는 8자 이상이어야 합니다.";
  }
  if (!f.confirmPassword) {
    e.confirmPassword = "비밀번호 확인을 입력해주세요.";
  } else if (f.password !== f.confirmPassword) {
    e.confirmPassword = "비밀번호가 일치하지 않습니다.";
  }
  if (!f.address.trim()) e.address = "주소를 입력해주세요.";
  if (!f.role_cd) e.role_cd = "역할을 선택해주세요.";
  if (!f.dept_nm) e.dept_nm = "부서를 선택해주세요.";
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
}: {
  onClose: () => void;
  onSubmit: (item: DataItem) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
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
    const result = await userService.create({
      user_id: form.user_id.trim(),
      user_name: form.user_name.trim(),
      password: form.password,
      role_cd: form.role_cd,
      dept_nm: form.dept_nm,
      address: form.address.trim(),
    });
    // ───────────────────────────────────────────────────────

    setLoading(false);

    // 서버가 성공 응답을 보낸 경우 → 서버 데이터 사용
    // 서버가 없거나 실패한 경우 → 낙관적 업데이트(optimistic update)로 로컬에 추가
    const newItem: DataItem =
      result.ok && result.data
        ? {
            user_id: result.data.user_id,
            user_name: result.data.user_name,
            stat: result.data.stat ?? "pending",
            role_cd: result.data.role_cd,
            dept_nm: result.data.dept_nm,
            address: result.data.address,
            joinDate: result.data.joinDate ?? today(),
            lastActive: result.data.lastActive ?? "방금 전",
          }
        : {
            user_id: form.user_id.trim(),
            user_name: form.user_name.trim(),
            stat: "pending",
            role_cd: form.role_cd,
            dept_nm: form.dept_nm,
            address: form.address.trim(),
            joinDate: today(),
            lastActive: "방금 전",
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
            <h2 className="text-neutral-50 text-lg font-semibold">회원가입 신청</h2>
            <p className="text-neutral-500 text-xs mt-0.5">새로운 사용자를 등록합니다</p>
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
            <p className="text-neutral-50 font-semibold text-lg">등록 완료!</p>
            <p className="text-neutral-400 text-sm">사용자 목록에 추가되었습니다.</p>
          </div>
        )}

        {/* form body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 relative" style={{ maxHeight: "60vh" }}>

          <Field label="이름" required error={errors.user_name}>
            <Input
              value={form.user_name}
              onChange={e => set("user_name", e.target.value)}
              placeholder="홍길동"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.user_name ? "border-rose-500" : ""}`}
            />
          </Field>

          <Field label="아이디" required error={errors.user_id}>
            <Input
              type="email"
              value={form.user_id}
              onChange={e => set("user_id", e.target.value)}
              placeholder="example@company.com"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.user_id ? "border-rose-500" : ""}`}
            />
          </Field>

          <Field label="비밀번호" required error={errors.password}>
            <Input
              type="password"
              value={form.password}
              onChange={e => set("password", e.target.value)}
              placeholder="8자 이상"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.password ? "border-rose-500" : ""}`}
            />
          </Field>

          <Field label="비밀번호 확인" required error={errors.confirmPassword}>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={e => set("confirmPassword", e.target.value)}
              placeholder="비밀번호 재입력"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.confirmPassword ? "border-rose-500" : ""}`}
            />
          </Field>

          {/* password strength */}
          {form.password && (
            <div className="flex items-center gap-2 -mt-1">
              {[1, 2, 3, 4].map(i => {
                const strength = Math.min(
                  4,
                  (form.password.length >= 8 ? 1 : 0) +
                  (/[A-Z]/.test(form.password) ? 1 : 0) +
                  (/[0-9]/.test(form.password) ? 1 : 0) +
                  (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0)
                );
                const colors = ["bg-rose-500", "bg-amber-500", "bg-yellow-400", "bg-green-400"];
                return (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? colors[strength - 1] : "bg-neutral-800"}`}
                  />
                );
              })}
              <span className="text-xs text-neutral-500 shrink-0">
                {["", "취약", "보통", "강함", "매우 강함"][
                  Math.min(4, (form.password.length >= 8 ? 1 : 0) +
                  (/[A-Z]/.test(form.password) ? 1 : 0) +
                  (/[0-9]/.test(form.password) ? 1 : 0) +
                  (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0))
                ]}
              </span>
            </div>
          )}

          {/* address */}
          <Field label="주소" required error={errors.address}>
            <Input
              value={form.address}
              onChange={e => set("address", e.target.value)}
              placeholder="서울특별시 강남구 테헤란로 123"
              className={`bg-neutral-950 border-neutral-700 text-neutral-50 placeholder:text-neutral-600 focus:border-blue-500 ${errors.address ? "border-rose-500" : ""}`}
            />
          </Field>

          <Field label="역할" required error={errors.role_cd}>
            <Select value={form.role_cd} onValueChange={v => set("role_cd", v)}>
              <SelectTrigger className={`bg-neutral-950 border-neutral-700 text-neutral-50 ${errors.role_cd ? "border-rose-500" : ""}`}>
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="부서" required error={errors.dept_nm}>
            <Select value={form.dept_nm} onValueChange={v => set("dept_nm", v)}>
              <SelectTrigger className={`bg-neutral-950 border-neutral-700 text-neutral-50 ${errors.dept_nm ? "border-rose-500" : ""}`}>
                <SelectValue placeholder="부서 선택" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <p className="text-neutral-600 text-xs pt-1">
            <span className="text-rose-400">*</span> 필수 입력 항목 / 가입 후 상태는 <span className="text-yellow-500">대기중</span>으로 설정됩니다.
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
                회원가입 신청
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

export function DataFormatManagement() {
  const [users, setUsers] = useState<DataItem[]>(INITIAL_DATA);
  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("user_name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    const filtered = users.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.user_name.toLowerCase().includes(q) ||
        item.user_id.toLowerCase().includes(q) ||
        item.role_cd.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || item.stat === statusFilter;
      const matchesDept = departmentFilter === "all" || item.dept_nm === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });

    filtered.sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [users, searchQuery, statusFilter, departmentFilter, sortField, sortDirection]);

  const departments = Array.from(new Set(users.map(u => u.dept_nm)));

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedData.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(filteredAndSortedData.map(i => i.user_id)));
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
    setUsers(prev => prev.filter(u => !selectedItems.has(u.user_id)));
    setSelectedItems(new Set());
    // REST 요청: DELETE /api/users/:id (병렬)
    await userService.removeMany(ids);
  };

  const deleteUser = async (id: string) => {
    // 낙관적 업데이트 먼저
    setUsers(prev => prev.filter(u => u.user_id !== id));
    setSelectedItems(prev => { const n = new Set(prev); n.delete(id); return n; });
    // REST 요청: DELETE /api/users/:id
    await userService.remove(id);
  };

  const addUser = (item: DataItem) => {
    setUsers(prev => [item, ...prev]);
  };

  const getStatusBadge = (stat: string) => {
    switch (stat) {
      case "active":  return <Badge className="bg-green-600 hover:bg-green-700 text-xs">활성</Badge>;
      case "inactive":return <Badge className="bg-neutral-600 hover:bg-neutral-700 text-xs">비활성</Badge>;
      case "pending": return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-xs">대기중</Badge>;
      default:        return <Badge className="text-xs">{stat}</Badge>;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
      : null;

  return (
    <>
      {showModal && (
        <RegistrationModal
          onClose={() => setShowModal(false)}
          onSubmit={addUser}
        />
      )}

      <div className="flex-1 h-full bg-neutral-950 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">

          {/* header */}
          <div className="mb-6">
            <h1 className="font-semibold text-3xl text-neutral-50 mb-1">데이터 Format 관리</h1>
            {/* <p className="text-neutral-400 text-sm">사용자 데이터를 관리하고 필터링하세요</p> */}
          </div>

          {/* toolbar */}
          <div className="bg-neutral-900 rounded-xl p-4 mb-5 border border-neutral-800">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* search */}
              <div className="flex-1 max-w-md relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <Input
                  placeholder="이름, 이메일, 역할로 검색..."
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
                      <SelectItem value="active">활성</SelectItem>
                      <SelectItem value="inactive">비활성</SelectItem>
                      <SelectItem value="pending">대기중</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="h-9 w-[150px] bg-neutral-950 border-neutral-800 text-neutral-50 text-sm">
                    <SelectValue placeholder="부서" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 부서</SelectItem>
                    {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>

                <button
                  onClick={() => setShowModal(true)}
                  className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <AddLarge size={15} />
                  새로운 항목
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-9 px-3 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-900 transition-colors flex items-center">
                      <OverflowMenuHorizontal size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download size={14} className="mr-2" />내보내기
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUsers(INITIAL_DATA)}>
                      <Renew size={14} className="mr-2" />초기화
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    { field: "name" as SortField, label: "이름" },
                    { field: "email" as SortField, label: "이메일" },
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
                    onClick={() => handleSort("role_cd")}
                  >
                    <div className="flex items-center gap-1">역할<SortIcon field="role_cd" /></div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none text-neutral-400 hover:text-neutral-200 transition-colors"
                    onClick={() => handleSort("dept_nm")}
                  >
                    <div className="flex items-center gap-1">부서<SortIcon field="dept_nm" /></div>
                  </TableHead>
                  <TableHead className="text-neutral-400">가입일</TableHead>
                  <TableHead className="text-neutral-400">최근 활동</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map(item => (
                  <TableRow
                    key={item.user_id}
                    className="border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.user_id)}
                        onChange={() => toggleSelectItem(item.user_id)}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-950 accent-blue-500"
                      />
                    </TableCell>
                    <TableCell className="text-neutral-50 font-medium">{item.user_name}</TableCell>
                    <TableCell className="text-neutral-400 text-sm">{item.user_id}</TableCell>
                    <TableCell>{getStatusBadge(item.stat)}</TableCell>
                    <TableCell className="text-neutral-300 text-sm">{item.role_cd}</TableCell>
                    <TableCell className="text-neutral-300 text-sm">{item.dept_nm}</TableCell>
                    <TableCell className="text-neutral-500 text-sm">{item.joinDate}</TableCell>
                    <TableCell className="text-neutral-500 text-sm">{item.lastActive}</TableCell>
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
                            onClick={() => deleteUser(item.user_id)}
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
