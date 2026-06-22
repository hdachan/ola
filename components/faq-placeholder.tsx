"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  faqCategories,
  faqEntries,
  faqSubgroups,
  type FaqCategoryId,
  type FaqEntry,
} from "@/lib/faq-entries";
import { faqWidgetRegistry } from "@/lib/faq-widget-registry";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

// subgroup id로 "코드. 이름" 형태의 표시용 문구를 빠르게 찾기 위한 맵.
// faqSubgroups가 단일 진실 소스이고, 여기서는 화면에 보여줄 문자열만 미리 조합해둔다.
const subgroupLabelMap = new Map(
  faqSubgroups.map((sg) => [sg.id, `${sg.code}. ${sg.label}`])
);

// 질문 앞의 "1. " "2. " 같은 패턴을 제거한 순수 질문 텍스트를 반환한다.
function stripLeadingNumber(question: string): string {
  return question.replace(/^\d+\.\s*/, "");
}

// 텍스트 안에서 검색어와 일치하는 모든 부분을 <mark>로 감싸서 노란색으로 강조한다.
// 대소문자 구분 없이 찾되, 실제로 보여줄 때는 원문 그대로의 대소문자를 유지한다.
// 검색어가 비어있으면 원문을 그대로 한 덩어리로 반환한다 (하이라이트 없음).
function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let matchIndex = lower.indexOf(lowerQuery, cursor);

  while (matchIndex !== -1) {
    if (matchIndex > cursor) {
      parts.push(text.slice(cursor, matchIndex));
    }
    parts.push(
      <mark
        key={matchIndex}
        className="rounded-sm bg-yellow-200 text-gray-900"
      >
        {text.slice(matchIndex, matchIndex + query.length)}
      </mark>
    );
    cursor = matchIndex + query.length;
    matchIndex = lower.indexOf(lowerQuery, cursor);
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

// 검색어가 답변 본문 어디쯤 있는지 보여주기 위해, 매칭 위치 앞뒤로 짧게 잘라낸
// 미리보기를 만든다. before/match/after 세 조각으로 나눠서 반환하면,
// 화면에서는 match 부분에만 하이라이트를 입힐 수 있다.
function buildAnswerSnippet(
  answer: string,
  query: string
): { before: string; match: string; after: string } {
  const lower = answer.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return { before: "", match: "", after: answer.slice(0, 40) };

  const CONTEXT = 14; // 검색어 앞뒤로 보여줄 글자 수
  const start = Math.max(0, idx - CONTEXT);
  const end = Math.min(answer.length, idx + query.length + CONTEXT);

  const prefix = start > 0 ? "…" : "";
  const suffix = end < answer.length ? "…" : "";

  return {
    before: prefix + answer.slice(start, idx),
    match: answer.slice(idx, idx + query.length),
    after: answer.slice(idx + query.length, end) + suffix,
  };
}

export default function Faq() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  // null이면 "전체" 상태. 검색을 시작하면 카테고리 선택은 의미가 없어지므로
  // 검색어가 있는 동안은 이 값과 무관하게 항상 전체에서 검색한다.
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId | null>(
    null
  );
  const [page, setPage] = useState(1);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const listTopRef = useRef<HTMLDivElement>(null);

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

  const totalPages = Math.max(
    1,
    Math.ceil(categoryFilteredEntries.length / PAGE_SIZE)
  );
  // 검색어를 바꾸거나 카테고리를 바꾸면 항상 1페이지부터 다시 보여준다.
  // (다른 목록을 보고 있는데 예전 페이지 번호가 그대로 남아있으면 혼란스러우므로)
  useEffect(() => {
    setPage(1);
  }, [trimmedQuery, activeCategory]);

  const pagedEntries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return categoryFilteredEntries.slice(start, start + PAGE_SIZE);
  }, [categoryFilteredEntries, page]);

  function goToPage(nextPage: number) {
    setPage(nextPage);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 검색 중이 아닐 때는 카테고리별로 묶어서 보여준다.
  // 검색 중에는 굳이 묶지 않고 매칭된 것만 평평하게 보여줘서 한 번에 훑기 쉽게 한다.
  // 그룹핑은 항상 "현재 페이지에 보일 10개"만 대상으로 한다 (전체를 다 그룹핑한 뒤 자르면
  // 카테고리 경계와 페이지 경계가 어긋나 버리므로, 먼저 자르고 나서 그 안에서만 묶는다).
  const groupedByCategory = useMemo(() => {
    return faqCategories
      .map((category) => ({
        category,
        entries: pagedEntries.filter((entry) => entry.category === category.id),
      }))
      .filter((group) => group.entries.length > 0);
  }, [pagedEntries]);

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
        자주 묻는 질문을 검색하거나 펼쳐서 확인해보세요 / B,G,I,J중 일부 답변이 없습니다.
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

      <div ref={listTopRef} />

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

                    // subgroup이 있으면 subgroup 내 순번, 없으면 category 내 순번
                    const subgroupIndex = entry.subgroup
                      ? entries
                          .slice(0, idx + 1)
                          .filter((e) => e.subgroup === entry.subgroup).length
                      : entries.slice(0, idx + 1).filter((e) => !e.subgroup).length;

                    return (
                      <li key={entry.id}>
                        {showSubgroupLabel && (
                          <p className="bg-gray-50 px-5 py-1.5 text-[11px] font-medium text-gray-400">
                            {subgroupLabelMap.get(entry.subgroup!)}
                          </p>
                        )}
                        <FaqRow
                          entry={entry}
                          isOpen={openId === entry.id}
                          onToggle={() => toggle(entry.id)}
                          searchQuery={trimmedQuery}
                          subgroupIndex={subgroupIndex}
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

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const WINDOW_SIZE = 5; // 한 번에 보여줄 페이지 번호 개수

  // 5개짜리 창을 현재 페이지 기준으로 옮긴다. 창은 항상 5칸을 채우려고 하되,
  // 맨 앞/맨 뒤에서는 범위를 벗어나지 않도록 시작점을 안쪽으로 당긴다.
  // 예: 1페이지 -> [1,2,3,4,5] / 5페이지 -> [3,4,5,6,7] / 마지막 근처 -> 끝에 딱 맞춰 고정.
  const windowStart = useMemo(() => {
    const half = Math.floor(WINDOW_SIZE / 2);
    let start = page - half;
    start = Math.max(1, start);
    start = Math.min(start, Math.max(1, totalPages - WINDOW_SIZE + 1));
    return start;
  }, [page, totalPages]);

  const pageNumbers = useMemo(() => {
    const windowEnd = Math.min(totalPages, windowStart + WINDOW_SIZE - 1);
    const nums: number[] = [];
    for (let p = windowStart; p <= windowEnd; p++) nums.push(p);
    return nums;
  }, [windowStart, totalPages]);

  return (
    <div className="mt-5 flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="이전 페이지"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30"
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

      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
            p === page
              ? "bg-emerald-500 text-white"
              : "text-gray-500 hover:bg-gray-100"
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="다음 페이지"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30"
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
  );
}

function FaqRow({
  entry,
  isOpen,
  onToggle,
  searchQuery,
  subgroupIndex,
}: {
  entry: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
  // 검색 중일 때만 값이 들어오고, 검색 중이 아니면 빈 문자열이라 하이라이트가 적용되지 않는다.
  searchQuery: string;
  subgroupIndex: number;
}) {
  // entry.widgets에 지정된 id들을 순서대로 레지스트리에서 찾아 컴포넌트 배열로 만든다.
  // widgets가 없으면 빈 배열이라서 아래에서 기존처럼 텍스트만 보여줌.
  const widgetIds = entry.widgets ?? [];

  // 검색어가 질문에는 없고 답변 본문에만 있는 경우, 평소엔 닫혀 있어서 안 보이니까
  // 질문 아래에 작은 미리보기를 함께 보여준다. (펼쳐져 있을 때는 답변 전체에 이미
  // 하이라이트가 보이므로 중복으로 보여줄 필요 없음)
  const matchedOnlyInAnswer =
    searchQuery.length > 0 &&
    !entry.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
    entry.answer.toLowerCase().includes(searchQuery.toLowerCase());
  const answerSnippet =
    matchedOnlyInAnswer && !isOpen
      ? buildAnswerSnippet(entry.answer, searchQuery)
      : null;

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left active:bg-gray-50"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-start gap-2 text-[15px] font-medium text-gray-900">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-600">
              {subgroupIndex}
            </span>
            <span className="min-w-0">
              {highlightMatches(stripLeadingNumber(entry.question), searchQuery)}
            </span>
          </span>
          {answerSnippet && (
            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
              <span className="shrink-0 rounded bg-gray-100 px-1 py-0.5 text-gray-500">
                답변 내용 일치
              </span>
              <span className="truncate">
                {answerSnippet.before}
                {answerSnippet.match && (
                  <mark className="rounded-sm bg-yellow-200 px-0.5 text-gray-700">
                    {answerSnippet.match}
                  </mark>
                )}
                {answerSnippet.after}
              </span>
            </span>
          )}
        </span>
        <svg
          className={cn(
            "mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform",
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
            {highlightMatches(entry.answer, searchQuery)}
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