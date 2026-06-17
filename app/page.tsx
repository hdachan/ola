"use client";

import { useState } from "react";
import Image from "next/image";
import JoinGuide from "@/components/join-guide";
import Faq from "@/components/faq-placeholder";
import { cn } from "@/lib/utils";

type TabId = "join-guide" | "faq";

const tabs: { id: TabId; label: string }[] = [
  { id: "join-guide", label: "가입안내" },
  { id: "faq", label: "FAQ" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("join-guide");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 영역: 로고(중앙) + 그 아래 대분류 탭 */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        {/* 로고. public/ola_logo.png 위치에 파일을 넣으면 바로 보입니다 */}
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

        {/* 상단 대분류 탭. 모바일에서도 누르기 편하도록 큼직하게, 화면 폭에 꽉 차게 배치 */}
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

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        {activeTab === "join-guide" ? <JoinGuide /> : <Faq />}
      </div>
    </main>
  );
}