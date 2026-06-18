"use client";

import { useMemo, useRef, useState } from "react";
import {
  faqCategories,
  faqEntries,
  type FaqCategoryId,
  type FaqEntry,
} from "@/lib/faq-entries";
import { faqWidgetRegistry } from "@/lib/faq-widget-registry";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  // null이면 "전체" 상태. 검색을 시작하면 카테고리 선택은 의미가 없어지므로
  // 검색어가 있는 동안은 이 값과 무관하게 항상 전체에서 검색한다.
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId | null>(
    null
  );
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  // 질문 + 답변 둘 다 검색 대상. 검색 중에는 카테고리 필터를 적용하지 않고
  // 전체에서 찾아야 원하는 결과를 놓치지 않는다.
  const matchedEntries = useMemo(() => {
    if (!isSearching) return faqEntries;
    const lower = trimmedQuery.toLowerCase();
    return faqEntries.filter(
      (entry) =>
        entry.question.toLowerCase().includes(lower) ||
        entry.answer.toLowerCase().includes(lower)
    );
  }, [isSearching, trimmedQuery]);

  // 검색 중이 아닐 때만 카테고리 버튼으로 고른 대분류로 좁힌다.
  const categoryFilteredEntries = useMemo(() => {
    if (isSearching || !activeCategory) return matchedEntries;
    return matchedEntries.filter((entry) => entry.category === activeCategory);
  }, [matchedEntries, isSearching, activeCategory]);

  // 검색 중이 아닐 때는 카테고리별로 묶어서 보여준다.
  // 검색 중에는 굳이 묶지 않고 매칭된 것만 평평하게 보여줘서 한 번에 훑기 쉽게 한다.
  const groupedByCategory = useMemo(() => {
    return faqCategories
      .map((category) => ({
        category,
        entries: categoryFilteredEntries.filter(
          (entry) => entry.category === category.id
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [categoryFilteredEntries]);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function selectCategory(id: FaqCategoryId | null) {
    setActiveCategory((prev) => (prev === id ? null : id));
  }

  // PC에서는 가로 드래그가 불편하므로 좌우 화살표 버튼으로 스크롤을 이동시켜준다.
  // 모바일은 터치 스와이프가 이미 되니 화살표는 sm 이상 화면에서만 보이게 한다.
  function scrollCategories(direction: "left" | "right") {
    const el = categoryScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-gray-900">FAQ</h1>
      <p className="mb-5 text-sm text-gray-500">
        자주 묻는 질문을 검색하거나 펼쳐서 확인해보세요
      </p>

      {/* 검색창 */}
      <div className="relative mb-4">
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

      {/* 대분류 버튼: 검색 중에는 카테고리 필터가 의미 없으므로 숨긴다.
          PC(마우스 환경)에서는 가로 드래그가 불편하므로 좌우 화살표 버튼을 같이 둔다. */}
      {!isSearching && (
        <div className="relative mb-5 flex items-center gap-1">
          <button
            onClick={() => scrollCategories("left")}
            aria-label="카테고리 왼쪽으로 이동"
            className="hidden shrink-0 items-center justify-center rounded-full bg-white p-1.5 text-gray-400 shadow-sm transition-colors hover:text-gray-600 sm:flex"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            ref={categoryScrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              onClick={() => selectCategory(null)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === null
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-500 shadow-sm active:bg-gray-50"
              )}
            >
              전체
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory === category.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-gray-500 shadow-sm active:bg-gray-50"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCategories("right")}
            aria-label="카테고리 오른쪽으로 이동"
            className="hidden shrink-0 items-center justify-center rounded-full bg-white p-1.5 text-gray-400 shadow-sm transition-colors hover:text-gray-600 sm:flex"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {groupedByCategory.length === 0 ? (
        <div className="rounded-2xl bg-white px-5 py-10 text-center text-sm text-gray-400 shadow-sm">
          {isSearching
            ? `\u201c${trimmedQuery}\u201d에 대한 검색 결과가 없어요`
            : "해당 분류에 등록된 질문이 없어요"}
        </div>
      ) : (
        <div className="space-y-5">
          {groupedByCategory.map(({ category, entries }) => (
            <div key={category.id}>
              {/* 카테고리를 하나만 골라서 보고 있을 때는 카테고리명 자체가 이미
                  버튼으로 드러나 있으므로 중복으로 또 적지 않는다. */}
              {(isSearching || activeCategory === null) && (
                <p className="mb-2 px-1 text-xs font-semibold text-emerald-600">
                  {category.label}
                </p>
              )}
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {entries.map((entry, idx) => {
                    // 검색 중에는 subgroup 묶음이 흩어져서 더 헷갈릴 수 있으므로
                    // 검색 중이 아닐 때만 소제목을 보여준다.
                    // 바로 이전 항목과 subgroup이 다를 때만(=새 묶음이 시작될 때만) 소제목을 표시.
                    const prevEntry = entries[idx - 1];
                    const showSubgroupLabel =
                      !isSearching &&
                      entry.subgroup &&
                      entry.subgroup !== prevEntry?.subgroup;

                    return (
                      <li key={entry.id}>
                        {showSubgroupLabel && (
                          <p className="bg-gray-50 px-5 py-1.5 text-[11px] font-medium text-gray-400">
                            {entry.subgroup}
                          </p>
                        )}
                        <FaqRow
                          entry={entry}
                          isOpen={openId === entry.id}
                          onToggle={() => toggle(entry.id)}
                        />
                      </li>
                    );
                  })}
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
    <div>
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
    </div>
  );
}