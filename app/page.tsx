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
  { id: "molly-study", label: "가입 안내문 설명" },
];

const VERSION = "v1.0.0";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("faq");

  return (
    <main className="min-h-screen bg-gray-50">
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
                  : "border-b-2 border-transparent text-gray-400 hover:text-gray-600",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        {activeTab === "join-guide" ? (
          <JoinGuide />
        ) : activeTab === "molly-study" ? (
          <MollyStudy />
        ) : (
          <Faq />
        )}
      </div>

      {/* 버전 표시 */}
      <div className="fixed bottom-3 right-3 z-50">
        <span className="text-[10px] text-gray-300 select-none">{VERSION}</span>
      </div>
    </main>
  );
}