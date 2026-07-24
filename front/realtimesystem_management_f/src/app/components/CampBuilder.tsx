import { useState, useMemo, useEffect, useCallback } from "react";
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
  Split,       // 🔀 조건 분기
  Email,       // ✉️ 메시지 발송
  Time,        // ⏱️ 대기 시간
  Add,          // ➕ 노드 추가
  Code,           // 💡 데이터 변환
  Clean,           // 💡 데이터 정제
  Play,
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
import { Filtering } from "./cmpnt/Filtering";
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


// ── main grid ──────────────────────────────────────────────────
type SortField = keyof DataItem;
type SortDirection = "asc" | "desc";

export function CampBuilder() {
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
      {
        id: '1',
        type: 'input',
        data: { label: 'START', isConfigured: true, cmpntId: '', },
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
  
  type NodeType = 'start' | 'batch' | 'realtime' | 'dataformat' |'filtering' | 'cleansing' | 'sms' | 'push' ;
  const LABEL_TO_TYPE_MAP: Record<string, NodeType> = {
    'START': 'start', // 혹시 영문으로 표기될 경우를 대비
    '배치 스케줄러': 'batch',
    '실시간 스케줄러': 'realtime',
    '데이터 포맷팅': 'dataformat',
    '필터 조건': 'filtering',
    '중복 제거': 'cleansing',
    'SMS': 'sms',
    'PUSH': 'push',
    // ... 나머지도 추가 ...
  };
    // 우클릭 메뉴 상태 관리
  const [menu, setMenu] = useState<{
    id: string;
    x: number;
    y: number;
    nodePosition: { x: number; y: number };
    nodeType: NodeType;
  } | null>(null);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]); // 👈 'edges'가 여기서 선언되어야 합니다!
  const [componentType, setComponentType] = useState<'batch' | 'realtime' | 'filtering' | 'dataformat' | 'cleansing' | 'push' | 'sms' | null>(null);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false); // 모달 표시 여부
  const [toastMessage, setToastMessage] = useState<string | null>(null); // 알림 메시지
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);


  const ALLOWED_NEXT_NODES: Record<NodeType, { label: string; type: NodeType }[]> = {
    start: [
      { label: '배치 스케줄러', type: 'batch' },
      { label: '실시간 스케줄러', type: 'realtime' }
    ],
    batch: [
      { label: '데이터 포맷팅', type: 'dataformat' }
    ],
    realtime: [
      { label: '데이터 포맷팅', type: 'dataformat' }
    ],
    dataformat: [
      { label: '필터 조건', type: 'filtering' },
      { label: '중복 제거', type: 'cleansing' },
      { label: 'SMS', type: 'sms' },
      { label: 'PUSH', type: 'push' }
    ],
    filtering: [
      { label: '중복 제거', type: 'cleansing' },
      { label: 'SMS', type: 'sms' },
      { label: 'PUSH', type: 'push' }
    ],
    cleansing: [
      { label: 'SMS', type: 'sms' },
      { label: 'PUSH', type: 'push' }
    ],
    sms : [],
    push : [],
    // MESSAGE: [
    //   // { label: '종료', type: 'END' }
    // ],
    // END: [] // 종료 노드 뒤에는 아무것도 올 수 없음
  };

  const nodeIcons = {
    START: <Play size={16} className="text-green-400 group-hover:scale-110 transition-transform" />,
    batch: <Time size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />,
    realtime: <Time size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />,
    dataformat: <Code size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />,
    filtering: <Split size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />,
    cleansing: <Clean size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />,
    sms: <Email size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />,
    push: <Email size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />,
    // ... 나머지도 추가 ...
  };

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
      console.log(node);
      console.log(node.data.label);
      const currentLabel = node.data.label as string;
      const mappedType = LABEL_TO_TYPE_MAP[currentLabel] || 'START';
      console.log(`클릭한 노드 라벨: ${currentLabel}, 매핑된 타입: ${mappedType}`);
      setMenu({
        id: node.id,
        x: event.clientX,
        y: event.clientY,
        nodePosition: node.position,
        nodeType: mappedType,
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
    const savedCmpntId = typeof data === 'string' ? data : data?.cmpntId;
    // A. 해당 노드의 isConfigured 상태를 true(실선)로 업데이트
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: { ...node.data, isConfigured: true, cmpntId: savedCmpntId },
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

  //특정 id의 노드를 삭제
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 노드의 data 객체에 들어갈 타입 예시
  interface CustomNodeData {
    label: string;
    cmpntId?: string; // 💡 저장 후 서버에서 받은 컴포넌트 ID
    isSaved?: boolean; // 💡 저장 완료 여부
  }
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedCmpntId = selectedNode?.data?.cmpntId as string | undefined;

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
              deleteKeyCode={['Delete']}  //키보드로 지울 수 있게 설정
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
                {/* 💡 [수정] 규칙에 따라 동적으로 버튼 생성 */}
                {ALLOWED_NEXT_NODES[menu.nodeType]?.length > 0 ? (
                  // 허용된 후행 노드가 있는 경우
                  ALLOWED_NEXT_NODES[menu.nodeType].map((item) => (
                    <button
                      key={item.type} // 각 아이템의 unique key
                      // 💡 버튼 클릭 시 해당 노드의 label을 전달하여 생성 로직 실행
                      onClick={() => {
                        addNextNode(item.label);
                        setMenu(null); // 메뉴 닫기
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-neutral-800 rounded flex flex-row gap-2.5 transition-colors group"
                    >
                      {/* 아이콘 매핑 (없으면 기본 아이콘 표시) */}
                      {nodeIcons[item.type as keyof typeof nodeIcons] || <Code size={16} />} 
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))
                ) : (
                  // 💡 종료 노드처럼 후행 노드가 아예 없는 경우 표시할 문구
                  <div className="px-2 py-3 text-center text-neutral-500 text-[11px]">
                    추가할 수 있는<br />후행 노드가 없습니다.
                  </div>
                )}
                {/* 💡 [추가] 🗑️ 노드 삭제 버튼 영역 (시작 노드는 삭제 방지 옵션 포함) */}
                {menu.nodeType !== 'start' && ( // START 노드는 지우면 안 되므로 조건 처리
                  <div className="border-t border-neutral-700 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setDeleteTargetId(menu.id);  
                          setMenu(null); // 메뉴 닫기                    
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-red-500/20 text-red-400 rounded flex flex-row gap-2.5 transition-colors group items-center"
                      >
                      {/* Lucide/React-icons 의 Trash 또는 Delete 아이콘 */}
                      <TrashCan size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">노드 삭제</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* 💡 [추가] 노드 삭제 확인 커스텀 모달 */}
            {deleteTargetId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 flex flex-col items-center gap-4 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* 1. 경고/확인 아이콘 */}
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <TrashCan size={32} className="text-red-400" />
                  </div>

                  {/* 2. 질문 문구 */}
                  <p className="text-neutral-200 text-sm font-medium text-center">
                    해당 컴포넌트를 삭제하시겠습니까?
                  </p>

                  {/* 3. "네 / 아니오" 버튼 영역 */}
                  <div className="flex items-center gap-3 w-full mt-2">
                    {/* '아니오' 버튼: 모달만 닫기 */}
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(null)} // 💡 모달 취소
                      className="flex-1 py-2 rounded-lg text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700"
                    >
                      아니오
                    </button>

                    {/* '네' 버튼: 실제 노드 삭제 수행 */}
                    <button
                      type="button"
                      onClick={() => {
                        deleteNode(deleteTargetId); // 💡 노드 삭제 실행
                        setDeleteTargetId(null); // 💡 모달 닫기
                      }}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-neutral-950 bg-red-400 hover:bg-red-300 transition-colors"
                    >
                      네
                    </button>
                  </div>

                </div>
              </div>
            )}
            {/* 모달 및 토스트 표시 부분 동일 */}
            {componentType === 'batch' && (
              <SchedulerBatch 
                cmpntId={selectedCmpntId}
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'realtime' && (
              <SchedulerRealTime 
                cmpntId={selectedCmpntId}
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'dataformat' && (
              <DataFormat 
                cmpntId={selectedCmpntId}
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'cleansing' && (
              <Cleansing 
                cmpntId={selectedCmpntId}
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'filtering' && (
              <Filtering 
                cmpntId={selectedCmpntId}
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'sms' && (
              <SMS 
                cmpntId={selectedCmpntId}
                onClose={() => setComponentType(null)} 
                onSave={handleComponentSave} 
              />
            )}
            {componentType === 'push' && (
              <Push 
                cmpntId={selectedCmpntId}
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
