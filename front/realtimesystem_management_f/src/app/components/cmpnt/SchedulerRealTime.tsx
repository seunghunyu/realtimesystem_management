import React, { useState, useEffect } from 'react';
import { Calendar, CheckmarkFilled, Close } from "@carbon/icons-react"; // Calendar 아이콘 추가
import { cmpntService, SchDto } from '../../services/cmpntService';
import { ComponentRequest, ComponentResponse } from "../../services/cmpntType";
import { campService } from '../../services/campService';
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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
      //cmpntId가 전달되어 온 경우에만 API에서 정보를 조회
      console.log("cmpntId:" +  cmpntId);
      console.log("campId:" +  campId);
      console.log("fromCmpntId:" +  fromCmpntId);
      if (cmpntId) {
        const fetchCmpntData = async () => {
          try {
              const requestPayload: ComponentRequest = {
                cmpntId: cmpntId,
                cmpntType: 'scheduler',
              };

              // 1. API 호출 (type 파라미터는 해당 폼의 컴포넌트 구분에 맞게 전달 - 예: 'scheduler')
              const result = await cmpntService.getSchInfo(requestPayload);
              if(!result.ok){
                console.error("컴포넌트 데이터 조회 실패:", result.message);
                return;
              }

              // 2. 응답 데이터를 기반으로 form 상태 채우기
              if (result.data) {
                setForm({
                  schNm: result.data.schedulerData.schNm || '',
                  schDesc: result.data.schedulerData.schDesc || '',
                  strDt: result.data.schedulerData.strDt || '',
                  endDt: result.data.schedulerData.endDt || '',
                  strTm: result.data.schedulerData.strTm || '',
                  endTm: result.data.schedulerData.endTm || '',
                });
              }
            } catch (error) {
              console.error("컴포넌트 데이터 조회 실패:", error);
            }
       };
       fetchCmpntData();    
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
      const cmpntType = 'scheduler';
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
          objKind : 'realtime'
        }
      };
      
      // ── REST 요청: POST /api/cmpnt/sch ──────────────────────────
      const result = await cmpntService.saveComponent(cmpntType, payload);

      
      setLoading(false);
      
      if (!result.ok) {
        setApiError(result.message);
        return;
      }
      // 💡 1. 저장 성공 오버레이 활성화
      setSubmitted(true);
      // 💡 2. 1초 대기 (완료 연출 확인)
      await new Promise((resolve) => setTimeout(resolve, 900));

      onSave(result.data);
      onClose();

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
          <button onClick={handleSave} 
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">확인</button>
        </div>
        {/* 💡 등록 완료 성공 오버레이 */}
        {submitted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-900/95 rounded-2xl gap-3 animate-fade-in">
            <CheckmarkFilled size={48} className="text-green-400 animate-bounce" />
            <p className="text-neutral-50 font-semibold text-lg">등록 완료!</p>
            <p className="text-neutral-400 text-xs">스케줄러 정보가 성공적으로 저장되었습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
