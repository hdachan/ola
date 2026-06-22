// app/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import JoinGuide from "@/components/join-guide";
import Faq from "@/components/faq-placeholder";
import MollyStudy from "@/components/molly-study";
import { cn } from "@/lib/utils";

type TabId = "join-guide" | "faq" | "molly-study";

const tabs: { id: TabId; label: string }[] = [
  { id: "faq", label: "FAQ" },
  { id: "join-guide", label: "상담챗봇" },
  { id: "molly-study", label: "가입 화면 및 약관" },
];
const NOTICE = `이 내용은 약관을 준용하여 도호가 제작한 상담 보조자료일 뿐이며
고객이나 계약자 혹은 외부에 배포하거나 게시할 수 없습니다.
관련 내용은 언제나 변경 및 업데이트 될 수 있습니다.`;

const VERSION = "v1.0.0";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("faq");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="flex justify-center py-3">
          <Image
            src="/ola_logo.png"
            alt="OLA 로고"
            width={120}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </div>

        <div className="mx-auto flex max-w-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 px-4 py-3.5 text-sm font-semibold transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "border-b-2 border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        {activeTab === "join-guide" ? (
          <JoinGuide />
        ) : activeTab === "molly-study" ? (
          <MollyStudy />
        ) : (
          <Faq />
        )}
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-2xl px-4 pb-8 pt-4">
        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-[10px] leading-relaxed text-gray-400 whitespace-pre-line">
            {NOTICE}
          </p>

          <p className="mt-2 text-center text-[10px] text-gray-300">
            {VERSION}
          </p>
        </div>
      </footer>
    </main>
  );
}