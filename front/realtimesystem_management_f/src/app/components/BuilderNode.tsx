import { memo } from 'react';
import { Position, NodeProps } from '@xyflow/react';
 import { 
  PlayFilled,
  Split,       // 🔀 조건 분기
  Email,       // ✉️ 메시지 발송
  Time,        // ⏱️ 대기 시간
  Add,          // ➕ 노드 추가
  Code,           // 💡 데이터 변환
  Clean,           // 💡 데이터 정제
  Unknown
} from "@carbon/icons-react";
import BuilderHandle from './BuilderHandle';
 
const NODE_CONFIG: Record<string, { icon: any; color: string }> = {
  'START': { icon: PlayFilled, color: 'text-emerald-500' },
  '스케줄러': { icon: Time, color: 'text-amber-500' },
  '필터 조건 설정': { icon: Split, color: 'text-purple-500' },
  '메시지 발송': { icon: Email, color: 'text-blue-500' },
  '데이터 포맷팅': { icon: Code, color: 'text-emerald-500' },
  '중복제거': { icon: Clean, color: 'text-emerald-500' },
};
const BuilderNode = ({ data }: NodeProps) => {
  const label = (data?.label as string) || '';
    // data.isConfigured 상태에 따라 점선/실선 스타일 결정
  const isConfigured = data?.isConfigured ?? true; 
  // 💡 label명에 맞는 아이콘 설정 가져오기 (없으면 Unknown 기본값)
  const config = NODE_CONFIG[label] || { icon: Unknown, color: 'text-gray-400' };
  const IconComponent = config.icon;  
  return (
    <div
      className={`w-36 px-4 py-2.5 bg-white rounded-xl shadow-md text-center relative focus:outline-none select-none transition-all ${
        isConfigured
          ? 'border border-gray-200 border-solid'   /* 💡 START 노드 및 저장 완료 노드: 회색 실선 테두리 */
          : 'border-2 border-blue-500 border-dashed' /* 💡 미설정 신규 노드: 파란 점선 테두리 */
      }`}
    >
      {/* 왼쪽 연결점 (Target) */}
      <BuilderHandle
        type="target"
        position={Position.Left}
        connectionCount={1}
        className="!w-2.5 !h-2.5 !bg-gray-300 border-2 !border-white"
      />
      {/* <span className="text-xs font-bold text-gray-800">{data.label as string}</span> */}
      <div className="flex items-center justify-center gap-2">
        <IconComponent size={16} className={`${config.color} shrink-0`} />
        <span className="text-xs font-bold text-gray-800 truncate">
          {label}
        </span>
      </div>
      {/* 오른쪽 연결점 (Source) */}
      <BuilderHandle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-pink-400 border-2 !border-white"
      />
    </div>
  );
};
 
export default memo(BuilderNode);