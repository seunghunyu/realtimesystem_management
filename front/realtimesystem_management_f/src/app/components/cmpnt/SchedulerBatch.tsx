import React, { useState, useEffect } from 'react';
import { Calendar, Add, Close } from "@carbon/icons-react";

const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-5 right-5 z-[100] bg-gray-900 border border-gray-700 text-white px-5 py-3 rounded-xl shadow-2xl text-sm animate-fade-in-up">
    ✅ {message}
  </div>
);

interface SchedulerProps {
  cmpntId?: string;  
  onClose: () => void;
  onSave: (data: FormState) => void;
}

interface FormState {
  schNm: string;
  strDt: string;
  endDt: string;
  strTm: string;
  endTm: string;
  tmpTime: string;
  times: string[];
  schDesc: string;
}

const initialFormState: FormState = {
  schNm: '',
  strDt: '',
  endDt: '',
  strTm: '09:00',
  endTm: '18:00',
  tmpTime: '',
  times: [],
  schDesc: '',
};

export function SchedulerBatch({ cmpntId, onClose, onSave }: SchedulerProps) {
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    //cmpntId가 전달되어 온 경우에만 API에서 정보를 조회
    if (cmpntId) {
      
      
    }
  }, [cmpntId]);

  // 💡 제네릭으로 K와 FormState[K] 타입 자동 추론
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 💡 시간 추가 핸들러 (+)
  const handleAddTime = () => {
    if (!form.tmpTime || form.times.includes(form.tmpTime)) return;

    setForm((prev) => ({
      ...prev,
      times: [...prev.times, prev.tmpTime].sort(),
      tmpTime: '', // 추가 후 임시 입력칸 초기화
    }));
  };

  // 💡 시간 삭제 핸들러 (x)
  const handleRemoveTime = (targetTime: string) => {
    const newTimes = form.times.filter((t) => t !== targetTime);
    set('times', newTimes);
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-[440px] max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center gap-3 shrink-0">
          <Calendar size={20} className="text-amber-400" />
          <h2 className="text-base font-semibold text-neutral-50">배치 스케줄러 등록</h2>
        </div>

        {/* 스크롤 가능한 본문 영역 */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {/* 스케줄 이름 */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">스케줄 이름</label>
            <input 
              type="text" 
              value={form.schNm}
              onChange={(e) => set('schNm', e.target.value)}
              placeholder="스케줄명을 입력하세요"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* 스케줄 설명 */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">스케줄 설명</label>
            <input 
              type="text" 
              value={form.schDesc}
              onChange={(e) => set('schDesc', e.target.value)}
              placeholder="설명을 입력하세요"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* 시작 일자 & 종료 일자 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">시작 일자</label>
              <input
                type="date"
                value={form.strDt}
                onChange={(e) => set('strDt', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">종료 일자</label>
              <input
                type="date"
                value={form.endDt}
                onChange={(e) => set('endDt', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
              />
            </div>
          </div>

          {/* 배치 시간 선택 & 추가 [+] 영역 */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">배치 시간 추가</label>
            <div className="flex gap-2">
              <input
                type="time"
                value={form.tmpTime}
                onChange={(e) => set('tmpTime', e.target.value)}
                className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
              />
              <button
                type="button"
                onClick={handleAddTime}
                className="px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors"
                title="시간 추가"
              >
                <Add size={18} />
              </button>
            </div>
          </div>

          {/* 추가된 시간 목록 */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 mb-1.5">
              등록된 시간 목록 ({form.times.length}개)
            </label>
            
            {form.times.length === 0 ? (
              <div className="p-3 bg-neutral-800/40 border border-dashed border-neutral-800 rounded-lg text-center text-xs text-neutral-500">
                추가된 시간이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {form.times.map((time) => (
                  <div
                    key={time}
                    className="flex items-center justify-between px-3 py-1.5 bg-neutral-800 border border-neutral-700/80 rounded-lg group hover:border-neutral-600 transition-colors"
                  >
                    <span className="text-xs font-mono text-neutral-200">{time}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      className="text-neutral-500 hover:text-red-400 p-0.5 rounded transition-colors"
                      title="삭제"
                    >
                      <Close size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-3.5 bg-neutral-800/50 border-t border-neutral-800 flex justify-end gap-2.5 shrink-0">
          <button 
            onClick={onClose} 
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium hover:bg-neutral-700 transition-colors"
          >
            취소
          </button>
          <button 
            onClick={handleSave} 
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
}