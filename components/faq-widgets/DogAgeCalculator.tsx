"use client";

import { useState } from "react";

// 생후 60일(만 61일차) ~ 12세(만 나이 기준, 생일 전날까지) 가입 가능 룰을 그대로 계산식으로 옮긴 것.
// 실제 가입 규정이 바뀌면 이 함수만 수정하면 됨 (faq-entries.ts나 faq-placeholder.tsx는 건드릴 필요 없음).
//
// 날짜 비교는 시:분:초를 다 떼어내고 "그날 자정(UTC)" 값끼리만 비교한다.
// new Date()를 그대로 빼면 현재 시각의 시/분/초가 섞여서 경계일에 하루씩 어긋나는 문제가 생긴다.
function toUtcMidnight(year: number, month: number, day: number) {
  return Date.UTC(year, month, day);
}

function calcEligibility(birthDateStr: string) {
  const birth = new Date(birthDateStr);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  const todayUtc = toUtcMidnight(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const birthUtc = toUtcMidnight(
    birth.getUTCFullYear(),
    birth.getUTCMonth(),
    birth.getUTCDate()
  );

  // 생일 당일을 0일째로 본다 (4/17 출생이면 4/17은 0일, 4/18은 1일...).
  // "61일이 지난 시점"이라는 문구는 생후 61일째부터 가능하다는 뜻이므로 diffDays >= 61이 기준.
  const diffDays = Math.round((todayUtc - birthUtc) / (1000 * 60 * 60 * 24));

  // 만 나이는 생일 "당일" 0시부터 올라간다 (생일 전날까지는 이전 나이).
  let age = now.getFullYear() - birth.getUTCFullYear();
  const birthdayPassedThisYear =
    now.getMonth() > birth.getUTCMonth() ||
    (now.getMonth() === birth.getUTCMonth() && now.getDate() >= birth.getUTCDate());
  if (!birthdayPassedThisYear) age -= 1;

  // "12세까지 가입가능 / 13번째 생일 전날까지 가능"이므로
  // 만 12세는 포함해서 가능, 만 13세가 되는 생일 당일부터 불가능.
  const tooYoung = diffDays < 61;
  const tooOld = age >= 13;

  return { diffDays, age, eligible: !tooYoung && !tooOld, tooYoung, tooOld };
}

export default function DogAgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const result = birthDate ? calcEligibility(birthDate) : null;

  return (
    <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
      <label className="mb-2 block text-xs font-semibold text-emerald-700">
        우리 아이 생일을 넣어보세요
      </label>
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500"
      />

      {result && (
        <div className="mt-3 rounded-lg bg-white px-3 py-2.5 text-sm">
          <p className="text-gray-600">
            생후 <span className="font-semibold text-gray-900">{result.diffDays}일</span>{" "}
            · 만 <span className="font-semibold text-gray-900">{result.age}세</span>
          </p>
          {result.eligible ? (
            <p className="mt-1 font-semibold text-emerald-600">
              ✓ 지금 가입 가능해요
            </p>
          ) : result.tooYoung ? (
            <p className="mt-1 font-semibold text-amber-600">
              아직 가입 가능 일수(61일)가 안 됐어요. {61 - result.diffDays}일 후에 가입 가능해요.
            </p>
          ) : (
            <p className="mt-1 font-semibold text-rose-500">
              만 13세가 되어서 가입이 어려워요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}