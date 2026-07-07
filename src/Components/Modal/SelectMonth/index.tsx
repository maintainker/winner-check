import { useMonthSelectStore } from "@Shared/stores/selectMonth";
import React, { useEffect, useState } from "react";

const MonthSelectModal = () => {
  const { isOpen, currentTarget, onSelect, closeMonthSelect } =
    useMonthSelectStore();

  const safeTarget = currentTarget || `2026-07`;
  const [initialYear, initialMonth] = safeTarget.split("-").map(Number);

  const [activeYear, setActiveYear] = useState(initialYear);

  useEffect(() => {
    if (isOpen) {
      setActiveYear(initialYear);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialYear]);

  if (!isOpen) return null;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeMonthSelect} />

      <div className="relative w-full max-w-[480px] bg-white rounded-t-2xl p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200 flex flex-col">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 flex-shrink-0" />

        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900">조회 기간 선택</h3>
          <button
            onClick={closeMonthSelect}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-between items-center bg-gray-50 border border-gray-100 h-13 px-4 rounded-xl mb-6 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveYear((prev) => prev - 1)}
            className="p-2 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span className="text-base font-bold text-slate-900 tracking-wide">
            {activeYear}년
          </span>

          <button
            type="button"
            onClick={() => setActiveYear((prev) => prev + 1)}
            className="p-2 rounded-lg hover:bg-gray-200 active:scale-95 transition-all cursor-pointer text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {months.map((month) => {
            const isFullySelected =
              activeYear === initialYear && month === initialMonth;

            return (
              <button
                key={month}
                type="button"
                onClick={() => {
                  if (typeof onSelect === "function") {
                    onSelect(activeYear, month);
                  }
                  closeMonthSelect();
                }}
                className={`h-14 rounded-xl font-semibold text-sm transition-all flex items-center justify-center cursor-pointer border ${
                  isFullySelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100 hover:border-gray-200"
                }`}
              >
                {month}월
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthSelectModal;
