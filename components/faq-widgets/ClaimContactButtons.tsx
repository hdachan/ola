"use client";

import { useState } from "react";
import { Phone, Mail, Printer, MapPin, Copy, Check, ChevronRight } from "lucide-react";
import { claimContactInfo } from "@/lib/claim-contact-info";

const telHref = `tel:${claimContactInfo.phone.replace(/[^0-9+]/g, "")}`;
const mailHref = `mailto:${claimContactInfo.email}`;

export default function ClaimContactButtons() {
  // 어떤 줄을 복사했는지 키로 구분해서, 팩스/주소가 각자 독립적으로 "복사됨"을 표시한다.
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
    <div className="mt-3 space-y-1">
      <a
        href={telHref}
        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 transition-colors active:bg-gray-50"
      >
        <Phone className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <span className="flex-1">
          대표번호로 전화하기 ({claimContactInfo.phone})
        </span>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
      </a>

      <a
        href={mailHref}
        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 transition-colors active:bg-gray-50"
      >
        <Mail className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <span className="flex-1">
          이메일로 청구하기 ({claimContactInfo.email})
        </span>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
      </a>

      <div className="my-1 border-t border-gray-100" />

      <button
        onClick={() => copyText("fax", claimContactInfo.fax)}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors active:bg-gray-50"
      >
        <Printer className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <span className="flex-1">
          대표팩스 ({claimContactInfo.fax})
        </span>
        {copiedKey === "fax" ? (
          <Check className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        ) : (
          <Copy className="h-4 w-4 flex-shrink-0 text-gray-300" />
        )}
      </button>

      <button
        onClick={() => copyText("address", claimContactInfo.postalAddress)}
        className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors active:bg-gray-50"
      >
        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <span>우편 접수 주소</span>
          </div>
          <p className="mt-0.5 whitespace-pre-line text-xs text-gray-500">
            {claimContactInfo.postalAddress}
          </p>
        </div>
        {copiedKey === "address" ? (
          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
        ) : (
          <Copy className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" />
        )}
      </button>

      <p className="px-2 pt-1 text-xs text-gray-400">
        <Copy className="mr-1 inline h-3 w-3" />
        아이콘이 있는 항목은 탭하면 복사돼요
      </p>
    </div>
  );
}