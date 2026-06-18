"use client";

import { useState } from "react";

export default function PremiumEstimator() {
  const [yearlyPremium, setYearlyPremium] = useState("");
  const [months, setMonths] = useState(12);

  const amount = Number(yearlyPremium.replace(/[^0-9]/g, ""));
  const monthly = amount > 0 ? Math.ceil(amount / months) : 0;

  return (
    <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
      <label className="mb-2 block text-xs font-semibold text-emerald-700">
        연간 보험료를 넣어보세요
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={yearlyPremium}
        onChange={(e) => setYearlyPremium(e.target.value)}
        placeholder="예: 600000"
        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500"
      />

      <label className="mb-2 mt-3 block text-xs font-semibold text-emerald-700">
        할부 개월 ({months}개월)
      </label>
      <input
        type="range"
        min={1}
        max={12}
        value={months}
        onChange={(e) => setMonths(Number(e.target.value))}
        className="w-full accent-emerald-500"
      />

      {amount > 0 && (
        <div className="mt-3 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-600">
          월 약{" "}
          <span className="font-semibold text-gray-900">
            {monthly.toLocaleString()}원
          </span>{" "}
          납입 (무이자는 5개월까지만 적용돼요)
        </div>
      )}
    </div>
  );
}