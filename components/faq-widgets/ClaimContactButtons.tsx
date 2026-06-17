"use client";

import { useState } from "react";
import { claimContactInfo } from "@/lib/claim-contact-info";

const telHref = `tel:${claimContactInfo.phone.replace(/[^0-9+]/g, "")}`;
const mailHref = `mailto:${claimContactInfo.email}`;

export default function ClaimContactButtons() {
  // 어떤 카드를 복사했는지 키로 구분해서, 팩스/주소가 각자 독립적으로 "복사됨"을 표시한다.
  const [copiedKey, setCopiedKey] = useState<"fax" | "address" | null>(null);

  async function copyText(key: "fax" | "address", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // 클립보드 권한이 없는 환경 등에서는 그냥 조용히 무시.
      // (텍스트가 화면에 같이 보이므로 직접 선택해서 복사할 수 있음)
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <a
        href={telHref}
        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-opacity active:opacity-80"
      >
        대표번호로 전화하기 ({claimContactInfo.phone})
      </a>

      <a
        href={mailHref}
        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors active:bg-gray-50"
      >
        이메일로 청구하기
      </a>

      <button
        onClick={() => copyText("fax", claimContactInfo.fax)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors active:bg-gray-50"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold">대표팩스</span>
          <span className="flex-shrink-0 text-xs font-semibold text-emerald-600">
            {copiedKey === "fax" ? "복사됨 ✓" : "탭해서 복사"}
          </span>
        </div>
        <p className="mt-1 text-gray-500">{claimContactInfo.fax}</p>
      </button>

      <button
        onClick={() => copyText("address", claimContactInfo.postalAddress)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors active:bg-gray-50"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold">우편 접수 주소</span>
          <span className="flex-shrink-0 text-xs font-semibold text-emerald-600">
            {copiedKey === "address" ? "복사됨 ✓" : "탭해서 복사"}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-line text-gray-500">
          {claimContactInfo.postalAddress}
        </p>
      </button>
    </div>
  );
}