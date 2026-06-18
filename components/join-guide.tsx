"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  guideTrees,
  searchGuideTree,
  type GuideNode,
  type FaqWidgetId,
  type SearchHit,
} from "@/lib/guide-tree-data";
// FAQ 게시판(Faq 컴포넌트)에서 쓰던 위젯 레지스트리를 그대로 재사용한다.
// 새 위젯을 추가하는 절차는 lib/faq-widget-registry.ts 쪽 절차를 따르면 됨
// (이 파일은 따로 수정할 필요 없음).
import { faqWidgetRegistry } from "@/lib/faq-widget-registry";

const SHORTCUT_PREVIEW_COUNT = 3; // 키워드 보기에서 처음에 보여줄 개수, 나머지는 "더보기"

function isLeaf(node: GuideNode) {
  return !node.children || node.children.length === 0;
}

// widget id -> 레지스트리에서 실제 컴포넌트를 찾아 렌더링.
// 등록되지 않은 id가 들어오면(타입상 불가능하지만 방어적으로) 아무것도 안 그림.
function renderWidget(widget: FaqWidgetId) {
  const WidgetComponent = faqWidgetRegistry[widget];
  if (!WidgetComponent) return null;
  return <WidgetComponent />;
}

// 채팅에 쌓이는 모든 사건을 "시간순 단일 타임라인"으로 관리한다.
// 메뉴를 눌렀든, 키워드 보기를 눌렀든 똑같이 이 배열에 순서대로 추가되기 때문에
// 항상 가장 마지막에 누른 게 화면 맨 아래에 오는 게 보장된다.
// (이전 버전은 menu 진행 상황과 shortcut 답변을 따로 들고 있다가 합치는 방식이라
//  실제 클릭 순서와 화면 표시 순서가 어긋나는 문제가 있었음 -> 이 구조로 교체)
interface SelectEvent {
  node: GuideNode;
}

export default function JoinGuide() {
  // 사용자가 지금까지 고른 노드들을 클릭한 순서 그대로 쌓은 단일 타임라인
  const [events, setEvents] = useState<SelectEvent[]>([]);
  // 입력창 텍스트. 전송/엔터 없이 타이핑하는 즉시 바로 위 보기 목록이 갱신됨.
  const [query, setQuery] = useState("");
  // "더보기"를 눌러서 전체 펼친 보기 목록인지 여부 (입력값이 바뀌면 다시 접힘)
  const [expanded, setExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  const shortcutHits = useMemo(
    () => (hasQuery ? searchGuideTree(guideTrees, trimmedQuery) : []),
    [hasQuery, trimmedQuery]
  );
  const visibleHits = expanded
    ? shortcutHits
    : shortcutHits.slice(0, SHORTCUT_PREVIEW_COUNT);
  const hiddenCount = shortcutHits.length - visibleHits.length;

  // "지금 메뉴 트리의 어느 위치에 있는지"는 별도 state가 아니라
  // events 마지막 항목을 기준으로 매번 계산한다. (단일 진실 소스 = events)
  // 마지막으로 고른 노드가 leaf(답변)면 -> 메뉴 진행은 끝난 상태.
  // leaf가 아니면 -> 그 노드의 children이 다음에 보여줄 옵션.
  const lastEvent = events[events.length - 1] ?? null;
  const awaitingMenuChoice = !lastEvent || !isLeaf(lastEvent.node);
  const currentOptions = !lastEvent
    ? guideTrees
    : !isLeaf(lastEvent.node)
    ? lastEvent.node.children ?? []
    : [];

  function selectNode(node: GuideNode) {
    setEvents((prev) => [...prev, { node }]);
    // 메뉴 버튼이든 키워드 보기든, 새로 고른 순간 검색창은 항상 비워서
    // "방금 고른 것"이 명확히 맨 아래에 보이게 한다.
    setQuery("");
    setExpanded(false);
  }

  function restart() {
    setEvents([]);
    setQuery("");
    setExpanded(false);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events.length, visibleHits.length]);

  const showRestart = events.length > 0;

  return (
    <div className="flex h-[640px] max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl bg-gray-50">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">가입 안내 챗봇</h1>
          <p className="text-xs text-gray-400">
            메뉴를 누르거나, 키워드를 입력해서 바로 답을 찾아보세요
          </p>
        </div>
        {showRestart && (
          <button
            onClick={restart}
            className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 active:bg-gray-200"
          >
            처음부터
          </button>
        )}
      </div>

      {/* 대화 영역: events를 시간순 그대로 렌더링 */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {/* 첫 인사: 아직 아무것도 고르기 전에만 표시 */}
        {events.length === 0 && (
          <BotBubble>안녕하세요! 무엇을 도와드릴까요?</BotBubble>
        )}

        {events.map((event, i) => {
          const leaf = isLeaf(event.node);
          return (
            <div key={`${event.node.id}-${i}`} className="space-y-2">
              <UserBubble>{event.node.label}</UserBubble>
              {leaf ? (
                <>
                  <BotBubble>{event.node.answer}</BotBubble>
                  {event.node.widget && (
                    <div className="pl-9">{renderWidget(event.node.widget)}</div>
                  )}
                </>
              ) : (
                <BotBubble>아래에서 골라주세요.</BotBubble>
              )}
            </div>
          );
        })}

        {/* 아직 메뉴 선택이 끝나지 않았으면(=마지막이 leaf가 아니면) 지금 단계의 옵션을 맨 아래에 표시 */}
        {awaitingMenuChoice && (
          <OptionList options={currentOptions} onSelect={selectNode} />
        )}

        {/* 가장 마지막에 답변(leaf)까지 도달했으면 마무리 멘트 */}
        {!awaitingMenuChoice && lastEvent && (
          <div className="space-y-2">
            <BotBubble>더 궁금한 점이 있으신가요?</BotBubble>
            <div className="flex justify-start">
              <button
                onClick={restart}
                className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-600 shadow-sm active:bg-emerald-50"
              >
                처음으로 돌아가기
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 키워드 보기: 입력창 바로 위에, 타이핑하는 즉시 매칭되는 질문이 번호 붙은 리스트로 뜸.
          여기서 항목을 고르면 selectNode가 호출되어 위 events 타임라인 맨 끝에 그대로 추가되므로,
          메뉴 진행 중이었더라도 항상 화면 가장 아래에 정확히 나타난다. */}
      {hasQuery && (
        <div className="border-t border-gray-100 bg-white px-4 pt-3">
          {shortcutHits.length === 0 ? (
            <p className="px-1 pb-3 text-xs text-gray-400">
              &ldquo;{trimmedQuery}&rdquo;와 일치하는 질문이 없어요
            </p>
          ) : (
            <div className="pb-3">
              <p className="px-1 pb-1.5 text-xs font-medium text-gray-400">
                이런 질문을 찾으시나요?
              </p>
              <ul className="overflow-hidden rounded-2xl border border-gray-100">
                {visibleHits.map((hit, idx) => (
                  <li key={hit.node.id}>
                    <button
                      onClick={() => selectNode(hit.node)}
                      className="flex w-full items-center gap-3 border-b border-gray-100 bg-white px-3.5 py-3 text-left last:border-b-0 active:bg-gray-50"
                    >
                      <span
                        className={
                          idx < 3
                            ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white"
                            : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[11px] font-bold text-gray-500"
                        }
                      >
                        {idx + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-gray-800">
                        {hit.node.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {hiddenCount > 0 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="mt-1.5 w-full rounded-xl py-2 text-xs font-medium text-gray-400 active:bg-gray-100"
                >
                  {hiddenCount}개 더보기
                </button>
              )}
              {expanded && shortcutHits.length > SHORTCUT_PREVIEW_COUNT && (
                <button
                  onClick={() => setExpanded(false)}
                  className="mt-1.5 w-full rounded-xl py-2 text-xs font-medium text-gray-400 active:bg-gray-100"
                >
                  접기
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 입력창: 전송 버튼/엔터 동작 없음. 타이핑 자체가 위쪽 보기 목록을 즉시 갱신하는 트리거. */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
            onChange={(e) => {
              setQuery(e.target.value);
              setExpanded(false);
            }}
            placeholder="궁금한 내용을 입력해보세요 (예: 나이, 청구, 갱신)"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-9 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white"
          />
          {query.length > 0 && (
            <button
              onClick={() => {
                setQuery("");
                setExpanded(false);
              }}
              aria-label="입력 지우기"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg
                className="h-3.5 w-3.5"
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
      </div>
    </div>
  );
}

function BotBubble({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
        봇
      </div>
      <div className="max-w-[78%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[15px] leading-relaxed text-gray-800 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-emerald-500 px-4 py-3 text-[15px] leading-relaxed text-white shadow-sm">
        {children}
      </div>
    </div>
  );
}

// 사용자가 직접 입력하는 대신 누르는 "선택지 버튼" 묶음.
function OptionList({
  options,
  onSelect,
}: {
  options: GuideNode[];
  onSelect: (node: GuideNode) => void;
}) {
  if (options.length === 0) {
    return (
      <div className="flex justify-start pl-9">
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
          아직 등록된 내용이 없어요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2 pl-9">
      {options.map((node) => (
        <button
          key={node.id}
          onClick={() => onSelect(node)}
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-600 shadow-sm transition-colors active:bg-emerald-50"
        >
          {node.label}
        </button>
      ))}
    </div>
  );
}