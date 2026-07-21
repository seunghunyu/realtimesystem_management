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
export function SchedulerRealTime({ onClose, onSave }: SchedulerProps){
  const [scheduleName, setScheduleName] = useState('매주 월요일 발송');

  const handleSave = () => {
    // 저장 로직 (예: API 호출)
    onSave({ name: scheduleName });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-[400px] overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center gap-3">
          <Calendar size={20} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-neutral-50">스케줄러 등록</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-neutral-300">스케줄 이름</label>
          <input 
            type="text" 
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-neutral-300">스케줄 시간</label>
          <input 
            type="text" 
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-neutral-300">스케줄 설명</label>
          <textarea 
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
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
