"use client";

import { useMemo, useState } from "react";
import { faqCategories, faqEntries, type FaqEntry } from "@/lib/faq-entries";
import { faqWidgetRegistry } from "@/lib/faq-widget-registry";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  // 질문 + 답변 둘 다 검색 대상
  const matchedEntries = useMemo(() => {
    if (!isSearching) return faqEntries;
    const lower = trimmedQuery.toLowerCase();
    return faqEntries.filter(
      (entry) =>
        entry.question.toLowerCase().includes(lower) ||
        entry.answer.toLowerCase().includes(lower)
    );
  }, [isSearching, trimmedQuery]);

  // 검색 중이 아닐 때는 카테고리별로 묶어서 보여준다.
  // 검색 중에는 굳이 묶지 않고 매칭된 것만 평평하게 보여줘서 한 번에 훑기 쉽게 한다.
  const groupedByCategory = useMemo(() => {
    return faqCategories
      .map((category) => ({
        category,
        entries: matchedEntries.filter(
          (entry) => entry.category === category.id
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [matchedEntries]);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-gray-900">FAQ</h1>
      <p className="mb-5 text-sm text-gray-500">
        자주 묻는 질문을 검색하거나 펼쳐서 확인해보세요
      </p>

      {/* 검색창 */}
      <div className="relative mb-5">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 나이, 청구서류, 보장"
          className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-10 text-base text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500"
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {groupedByCategory.length === 0 ? (
        <div className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-gray-400 shadow-sm">
          &ldquo;{trimmedQuery}&rdquo;에 대한 검색 결과가 없어요
        </div>
      ) : (
        <div className="space-y-5">
          {groupedByCategory.map(({ category, entries }) => (
            <div key={category.id}>
              <p className="mb-2 px-1 text-xs font-semibold text-emerald-600">
                {category.label}
              </p>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {entries.map((entry) => (
                    <FaqRow
                      key={entry.id}
                      entry={entry}
                      isOpen={openId === entry.id}
                      onToggle={() => toggle(entry.id)}
                    />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqRow({
  entry,
  isOpen,
  onToggle,
}: {
  entry: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // entry.widgets에 지정된 id들을 순서대로 레지스트리에서 찾아 컴포넌트 배열로 만든다.
  // widgets가 없으면 빈 배열이라서 아래에서 기존처럼 텍스트만 보여줌.
  const widgetIds = entry.widgets ?? [];

  return (
    <li>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left active:bg-gray-50"
      >
        <span className="text-[15px] font-medium text-gray-900">
          {entry.question}
        </span>
        <svg
          className={cn(
            "h-4 w-4 flex-shrink-0 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-500">
            {entry.answer}
          </p>
          {/* 위젯이 있는 질문이면 답변 텍스트 아래에 인터랙티브 컴포넌트들을 순서대로 추가로 보여준다 */}
          {widgetIds.length > 0 && (
            <div className="space-y-3">
              {widgetIds.map((widgetId) => {
                const WidgetComponent = faqWidgetRegistry[widgetId];
                if (!WidgetComponent) return null;
                return <WidgetComponent key={widgetId} />;
              })}
            </div>
          )}
        </div>
      )}
    </li>
  );
}