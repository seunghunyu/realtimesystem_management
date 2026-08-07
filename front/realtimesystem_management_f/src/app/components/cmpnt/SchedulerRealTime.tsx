import React, { useState, useEffect } from 'react';
import { Calendar } from "@carbon/icons-react"; // Calendar 아이콘 추가
import { cmpntService, SchDto } from '../../services/cmpntService';
import { ComponentRequest, ComponentResponse } from "../../services/cmpntType";
const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-5 right-5 z-[100] bg-gray-900 border border-gray-700 text-white px-5 py-3 rounded-xl shadow-2xl text-sm animate-fade-in-up">
    ✅ {message}
  </div>
);
interface SchedulerProps {
  cmpntId?: string;    
  campId?: string;
  fromCmpntId?: string;
  onClose: () => void;
  onSave: (data: ComponentResponse) => void;
}

const today = new Date().toLocaleDateString('sv-SE');

const initialFormState = {
    schNm: '',
    strDt: today,
    endDt: today,
    strTm: '09:00',
    endTm: '18:00',
    schDesc: '',
}

interface FormState {
  schNm: string;
  strDt: string;
  endDt: string;
  strTm: string;
  endTm: string;
  schDesc: string;
}
interface FormErrors {
  schNm?:string;
  strDt?: string;
  endDt?: string;
  strTm?: string;
  endTm?: string;
  schDesc?: string;
}
function validateForm(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.schNm.trim()) e.schNm = "스케줄 명을 입력해주세요.";
  if (!f.strDt) e.strDt = "시작 일자를 선택해주세요.";
  if (!f.endDt) e.endDt = "종료 일자를 선택해주세요.";
  if (!f.strTm) e.strTm = "시작 시간을 입력해주세요.";
  if (!f.endTm) e.endTm = "종료 시간을 입력해주세요.";
  return e;
}

export function SchedulerRealTime({ cmpntId, campId, fromCmpntId, onClose, onSave }: SchedulerProps){
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
      //cmpntId가 전달되어 온 경우에만 API에서 정보를 조회
      if (cmpntId) {
        
        
      }
    }, [cmpntId]);

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async() => {

    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError(null);
    try {
      const cmpntType = 'realtime';
      const payload: ComponentRequest = {
        cmpntId: cmpntId || '',
        cmpntNm: form.schNm.trim(),
        cmpntDesc: form.schDesc.trim(),
        cmpntType: cmpntType,
        campId: campId || '',
        fromCmpntId: fromCmpntId || '',
        schedulerData: {
          schId: cmpntId || '',
          schNm: form.schNm.trim(),
          schDesc: form.schDesc.trim(),
          campId: campId || '',
          strDt: form.strDt,
          endDt: form.endDt,
          strTm: form.strTm,
          endTm: form.endTm,
        }
      };
      // ── REST 요청: POST /api/cmpnt/sch ──────────────────────────
      const result = await cmpntService.saveComponent(cmpntType, payload);
    
      
      if (!result.ok) {
        setApiError(result.message);
        return;
      }

      onSave(result.data);
    } catch (err) {
      setLoading(false);
      setApiError("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-[400px] overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center gap-3">
          <Calendar size={20} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-neutral-50">실시간 스케줄러 등록</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="p-6 space-y-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">시작 일자</label>
              <input
                type="date"
                value={form.strDt}
                onChange={(e) => set('strDt', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
              />
            </div>
            <div className="p-6 space-y-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">종료 일자</label>
              <input
                type="date"
                value={form.endDt}
                onChange={(e) => set('endDt', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
              />
            </div>
        </div>
        {/* 💡 시작 시간 & 종료 시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-6 space-y-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">시작 시간</label>
              <input
                type="time"
                value={form.strTm}
                onChange={(e) => set('strTm', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
              />
            </div>
            <div className="p-6 space-y-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">종료 시간</label>
              <input
                type="time"
                value={form.endTm}
                onChange={(e) => set('endTm', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:ring-1 focus:ring-blue-500 outline-none scheme-dark"
              />
            </div>
        </div>
        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-neutral-300">스케줄 이름</label>
          <input 
            type="text" 
            name="schNm"
            value={form.schNm}
            onChange={(e) => set('schNm', e.target.value)}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-neutral-300">스케줄 설명</label>
          <input 
            type="text" 
            name="schDesc"
            value={form.schDesc}
            onChange={(e) => set('schDesc', e.target.value)}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="px-6 py-4 bg-neutral-800/50 border-t border-neutral-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-sm font-medium transition-colors">취소</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">확인</button>
        </div>
      </div>
    </div>
  );
}
