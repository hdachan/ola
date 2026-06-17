"use client";

import { useState } from "react";
import { claimContactInfo } from "@/lib/claim-contact-info";

const telHref = `tel:${claimContactInfo.phone.replace(/[^0-9+]/g, "")}`;
const mailHref = `mailto:${claimContactInfo.email}`;

export default function ClaimContactButtons() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(claimContactInfo.postalAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 권한이 없는 환경 등에서는 그냥 조용히 무시.
      // (주소는 화면에 텍스트로도 같이 보이므로 직접 선택해서 복사할 수 있음)
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

      {/* 팩스는 누른다고 동작이 생기는 항목이 아니라 정보 표시용 */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        대표팩스: {claimContactInfo.fax}
      </div>

      <button
        onClick={copyAddress}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors active:bg-gray-50"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold">우편 접수 주소</span>
          <span className="flex-shrink-0 text-xs font-semibold text-emerald-600">
            {copied ? "복사됨 ✓" : "탭해서 복사"}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-line text-gray-500">
          {claimContactInfo.postalAddress}
        </p>
      </button>
    </div>
  );
}