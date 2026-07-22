import { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Split,       // 🔀 조건 분기
  Email,       // ✉️ 메시지 발송
  Time,        // ⏱️ 대기 시간
  Add,          // ➕ 노드 추가
  Code,           // 💡 데이터 변환
  Clean           // 💡 데이터 정제
} from "@carbon/icons-react";
import {
  Background,
  ReactFlow,
  addEdge,
  Position,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge
} from '@xyflow/react';
import '../../styles/builder.css';
import BuilderNode from './BuilderNode';

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
import { deptService, roleService } from "../services/codevalService";
import { SchedulerRealTime } from "./cmpnt/SchedulerRealTime";
import { SchedulerBatch } from "./cmpnt/SchedulerBatch";
import { DataFormat } from "./cmpnt/DataFormat";
import { Filtering } from "./cmpnt/Filter";
import { Push } from "./cmpnt/Push";
import { SMS } from "./cmpnt/SMS";
import { Cleansing } from "./cmpnt/Cleansing";
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
  campBrch2
}: {
  onClose: () => void;
  onSubmit: (item: DataItem) => void;
  campBrch1: CampBrch1[];
  campBrch2: CampBrch2[];
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
        {submitted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-900/95 rounded-2xl gap-3">
            <CheckmarkFilled size={48} className="text-green-400" />
            <p className="text-neutral-50 font-semibold text-lg">캠페인 등록 완료!</p>
            <p className="text-neutral-400 text-sm">캠페인 목록에 추가되었습니다.</p>
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

export function CampBuilder() {
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
      {
        id: '1',
        type: 'input',
        data: { label: 'START', isConfigured: true },
        position: { x: 50, y: 150 },
        sourcePosition: Position.Right,
      },
      // {
      //   id: '2',
      //   type: 'custom',
      //   data: {},
      //   position: { x: 250, y: 50 },
      // },
      // {
      //   id: '3',
      //   type: 'input',
      //   data: { label: 'Node 2' },
      //   position: { x: 0, y: 100 },
      //   sourcePosition: Position.Right,
      // },
    ]);
  // 우클릭 메뉴 상태 관리
  const [menu, setMenu] = useState<{
    id: string;
    x: number;
    y: number;
    nodePosition: { x: number; y: number };
  } | null>(null);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]); // 👈 'edges'가 여기서 선언되어야 합니다!
  const [componentType, setComponentType] = useState<'batch' | 'realtime' | 'filtering' | 'dataformat' | 'cleansing' | 'push' | 'sms' | null>(null);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false); // 모달 표시 여부
  const [toastMessage, setToastMessage] = useState<string | null>(null); // 알림 메시지
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect( () => {
    
  }, []); // []로 두면 컴포넌트가 처음 켜질 때 한번만 실행

  const nodeTypes = {
    custom: BuilderNode,
  };
 
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 💡 2. 노드 우클릭 이벤트 핸들러
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault(); // 기본 브라우저 우클릭 메뉴 막기
      setMenu({
        id: node.id,
        x: event.clientX,
        y: event.clientY,
        nodePosition: node.position,
      });
    },
    []
  );
  // 캔버스 클릭 시 메뉴 닫기
  const onPaneClick = useCallback(() => setMenu(null), []);

  // 💡 3. 후행 노드 자동 생성 및 연결 함수
  const addNextNode = (nodeTypeLabel: string) => {
    if (!menu) return;

    const newNodeId = `node-${Date.now()}`;
    // 부모 노드의 오른쪽에 배치 (x + 200)
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position: {
        x: menu.nodePosition.x + 220,
        y: menu.nodePosition.y,
      },
      data: { label: nodeTypeLabel, isConfigured: false },
    };

    // 부모 노드와 새 노드를 자동으로 연결하는 Edge 생성
    const newEdge: Edge = {
      id: `edge-${menu.id}-${newNodeId}`,
      source: menu.id,
      target: newNodeId,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, 
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setMenu(null); // 메뉴 닫기
  };

  // 💡 3. 알림 표시 함수
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000); // 3초 후 할림 제거
  };

  // 💡 4. 모달 저장 버튼 클릭 시 호출되는 함수
  const handleComponentSave = (data: any) => {
    if (!selectedNodeId) return;

    console.log('스케줄러 저장 데이터:', data);
    // A. 해당 노드의 isConfigured 상태를 true(실선)로 업데이트
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: { ...node.data, isConfigured: true },
          };
        }
        return node;
      })
    );

    // B. 해당 노드로 연결된 Edge 스타일을 파란 실선으로 변경
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.target === selectedNodeId) {
          return {
            ...edge,
            style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: 'none' },
          };
        }
        return edge;
      })
    );

    setShowSchedulerModal(false);
    setSelectedNodeId(null);
    showToast('저장되었습니다.'); // 알림 표시
  }; 

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    // 생성된 노드의 label(이름)이 "스케줄러"인 경우에만 모달 열기
    if (node.data.label === "배치 스케줄러") {
      // 필요하다면 클릭한 노드의 ID를 상태로 저장해둘 수도 있습니다.
      setSelectedNodeId(node.id);
      setComponentType('batch'); 
    }else if(node.data.label === "실시간 스케줄러") {
      // 필요하다면 클릭한 노드의 ID를 상태로 저장해둘 수도 있습니다.
      setSelectedNodeId(node.id);
      setComponentType('realtime'); 
    }
  }, []);

  return (
    <>
      
      <div className="flex-1 h-full bg-neutral-950 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">

          {/* header */}
          <div className="mb-6">
            <h1 className="font-semibold text-3xl text-neutral-50 mb-1">캠페인 설계</h1>
            <p className="text-neutral-400 text-sm">노드를 연결해 캠페인을 설계 하세요.</p>
          </div>

          {/* toolbar */}
          <div className="bg-neutral-900 rounded-xl p-4 mb-5 border border-neutral-800">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              
              {/* filters + actions */}
              <div className="flex gap-2 items-center flex-wrap">
                
                <button
                  // onClick={() => setShowModal(true)}
                  // onClick={() => }
                  className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <AddLarge size={15} />
                  설계 완료
                </button>
              </div>
            </div>

          </div>
          {/* react flow chart 노드 그리기*/}
          {/* 💡 1. react flow 전용 감싸는 div 추가 (높이 명시!) */}
          <div className="w-full h-[650px] min-h-[500px] bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden"
            onClick={onPaneClick}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeContextMenu={onNodeContextMenu}
              onNodeDoubleClick={onNodeDoubleClick}
              // fitView
              // 💡 fitView를 끄고 defaultViewport를 설정하면 시작 노드가 맨 왼쪽에 딱 고정됩니다!
              defaultViewport={{ x: 20, y: 100, zoom: 1 }}
              colorMode="system"
            >
              <Background gap={16} size={1} bgColor="#0a0a0a"/>
            </ReactFlow>    
            {/* 💡 4. 마우스 우클릭 커스텀 팝업 메뉴 */}
            {menu && (
              <div
                style={{ top: menu.y, left: menu.x }}
                className="fixed z-50 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl p-1 w-40 text-xs text-neutral-200"
              >
                <div className="px-2 py-1.5 text-[10px] text-neutral-400 font-semibold border-b flex flex-row gap-2.5 border-neutral-800">
                  <Add size={14} className="text-neutral-400" />
                  <span>후행 노드 추가</span>
                </div>
                <button
                  onClick={() => addNextNode('실시간 스케줄러')}
                  className="w-full text-left px-2 py-1.5 hover:bg-neutral-800 rounded flex flex-row gap-2.5 transition-colors"
                >
                  <Time size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">실시간 스케줄러</span>
                </button>
                <button
                  onClick={() => addNextNode('배치 스케줄러')}
                  className="w-full text-left px-2 py-1.5 hover:bg-neutral-800 rounded flex flex-row gap-2.5 transition-colors"
                >
                  <Time size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">배치 스케줄러</span>
                </button>
                <button
                  onClick={() => addNextNode('데이터 포맷팅')}
                  className="w-full text-left px-2 py-1.5 hover:bg-neutral-800 rounded flex flex-row gap-2.5 transition-colors"
                >
                  <Code size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">데이터 포맷팅</span>
                </button>
                <button
                  onClick={() => addNextNode('필터조건')}
                  className="w-full text-left px-2 py-1.5 hover:bg-neutral-800 rounded flex flex-row gap-2.5 transition-colors"
                >
                  <Split size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">필터 조건 설정</span>
                </button>
                <button
                  onClick={() => addNextNode('중복제거')}
                  className="w-full text-left px-2 py-1.5 hover:bg-neutral-800 rounded flex flex-row gap-2.5 items-center transition-colors"
                >
                  <Clean size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">중복제거</span>
                </button>
                <button
                  onClick={() => addNextNode('메시지')}
                  className="w-full text-left px-2 py-1.5 hover:bg-neutral-800 rounded flex flex-row gap-2.5 items-center transition-colors"
                >
                  <Email size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">메시지 발송</span>
                </button>
                
              </div>
            )}
            {/* 모달 및 토스트 표시 부분 동일 */}
            {componentType === 'batch' && (
              <SchedulerBatch 
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'realtime' && (
              <SchedulerRealTime 
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'dataformat' && (
              <DataFormat 
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'cleansing' && (
              <Cleansing 
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'filtering' && (
              <Filtering 
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'sms' && (
              <SMS 
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'push' && (
              <Push 
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
