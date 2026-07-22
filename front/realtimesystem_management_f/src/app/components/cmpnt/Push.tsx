import React, { useState, useCallback } from 'react';
import {Calendar } from "@carbon/icons-react"; // Calendar 아이콘 추가

const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-5 right-5 z-[100] bg-gray-900 border border-gray-700 text-white px-5 py-3 rounded-xl shadow-2xl text-sm animate-fade-in-up">
    ✅ {message}
  </div>
);
interface SchedulerProps {
  onClose: () => void;
  onSave: (data: { name: string }) => void;
}

const initialFormState = {
    schNm: '',
    strDt: '',
    endDt: '',
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

export function Push({ onClose, onSave }: SchedulerProps){
  const [form, setForm] = useState(initialFormState);  
  
  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // 저장 로직 (예: API 호출)
    // onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-[400px] overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center gap-3">
          <Calendar size={20} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-neutral-50">Push 발송 정보 등록</h2>
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
