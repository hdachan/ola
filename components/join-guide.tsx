"use client";

import { useMemo, useState } from "react";
import {
  guideTrees,
  findPathToNode,
  type GuideNode,
} from "@/lib/guide-tree-data";
import { cn } from "@/lib/utils";

const MAX_RECENT = 8;

// 검색 결과 한 줄에 필요한 정보: 매칭된 노드 + 거기까지 오는 경로(상위 라벨들)
interface SearchHit {
  node: GuideNode;
  path: string[]; // 루트 제외, 매칭 노드 자신 포함하지 않음
}

function isLeaf(node: GuideNode) {
  return !node.children || node.children.length === 0;
}

// 트리 전체를 순회하면서 label 또는 answer에 검색어가 포함된 노드를 모두 수집
function searchTree(roots: GuideNode[], query: string): SearchHit[] {
  const lower = query.toLowerCase();
  const hits: SearchHit[] = [];

  function walk(node: GuideNode, path: string[]) {
    const matches =
      node.label.toLowerCase().includes(lower) ||
      (node.answer ?? "").toLowerCase().includes(lower);
    if (matches) {
      hits.push({ node, path });
    }
    node.children?.forEach((child) => walk(child, [...path, node.label]));
  }

  roots.forEach((root) => walk(root, []));
  return hits;
}

export default function JoinGuide() {
  const [query, setQuery] = useState("");
  // 선택 경로: 지금까지 골라온 노드들. 화면엔 이걸 그대로 "선택 단계 카드"로 쌓아서 보여준다.
  const [path, setPath] = useState<GuideNode[]>([]);
  const [openAnswerId, setOpenAnswerId] = useState<string | null>(null);
  // 클릭했던 노드들의 id를 최신순으로 보관 (중간 단계 항목도 포함)
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const searchResults = useMemo(
    () => (isSearching ? searchTree(guideTrees, trimmedQuery) : []),
    [isSearching, trimmedQuery]
  );

  const recentNodes = useMemo(() => {
    return recentIds
      .map((id) => {
        const found = findPathToNode(guideTrees, id);
        if (!found) return null;
        return { node: found[found.length - 1], path: found };
      })
      .filter((v): v is { node: GuideNode; path: GuideNode[] } => v !== null);
  }, [recentIds]);

  // 같은 탐색 흐름 안에서 더 깊이 들어간 경우, 이전에 남겨둔 중간 단계 기록은
  // 지우고 최종 도착 지점만 남긴다. (예: 청구 -> 팩스로 들어가면 "청구"는 빼고 "팩스"만 남음)
  // currentPath는 이번에 기록하는 노드까지 오는 전체 경로(자기 자신 포함)다.
  function recordRecent(nodeId: string, currentPath: GuideNode[]) {
    const pathIds = new Set(currentPath.map((n) => n.id));
    setRecentIds((prev) => {
      // 지금 경로에 포함된 예전 기록(= 같은 흐름의 중간 단계)은 모두 제거
      const withoutAncestors = prev.filter((id) => !pathIds.has(id));
      return [nodeId, ...withoutAncestors].slice(0, MAX_RECENT);
    });
  }

  // 한 단계의 옵션 목록에서 항목을 선택했을 때.
  // depth는 그 옵션 목록이 path 중 몇 번째 단계 다음에 나온 것인지(루트 목록이면 0).
  function selectAt(depth: number, node: GuideNode) {
    const newPath = [...path.slice(0, depth), node];
    recordRecent(node.id, newPath);
    setPath(newPath);
    setOpenAnswerId(isLeaf(node) ? node.id : null);
  }

  // 이미 선택해서 카드로 쌓인 단계를 다시 누르면, 그 시점으로 되돌아가서
  // "선택을 바꾸는" 화면으로 전환 (그 단계의 옵션 목록을 다시 보여줌)
  function reopenStage(depth: number) {
    setPath((prev) => prev.slice(0, depth));
    setOpenAnswerId(null);
  }

  function resetAll() {
    setPath([]);
    setOpenAnswerId(null);
  }

  // 최근 본 항목 / 검색 결과에서 노드를 눌렀을 때, 그 노드가 있는 경로 전체를
  // 선택 카드로 그대로 쌓아서 보여줌 (= 그 흐름을 다시 따라온 것처럼)
  function jumpToNode(fullPath: GuideNode[]) {
    setQuery("");
    const target = fullPath[fullPath.length - 1];
    recordRecent(target.id, fullPath);
    setPath(fullPath);
    setOpenAnswerId(isLeaf(target) ? target.id : null);
  }

  // path를 바탕으로, 화면에 그릴 "단계" 목록을 만든다.
  // 각 단계 = { depth, options(이 단계에서 고를 수 있던 목록), selected(고른 것, 있으면) }
  const stages = useMemo(() => {
    type Stage = {
      depth: number;
      options: GuideNode[];
      selected: GuideNode | null;
    };
    const result: Stage[] = [];
    let options = guideTrees;
    for (let depth = 0; depth <= path.length; depth++) {
      const selected = path[depth] ?? null;
      result.push({ depth, options, selected });
      if (!selected) break;
      if (isLeaf(selected)) break; // 답변 노드면 더 이상 다음 단계 없음
      options = selected.children ?? [];
    }
    return result;
  }, [path]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-gray-900">가입 안내</h1>
      <p className="mb-5 text-sm text-gray-500">
        궁금한 내용을 검색하거나, 하나씩 눌러서 찾아보세요
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
          placeholder="예: 카드, 나이, 가입불가"
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

      {/* 최근 본 항목: 검색 중에는 숨겨서 화면을 덜 복잡하게 유지 */}
      {!isSearching && recentNodes.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-xs font-medium text-gray-400">
            최근 본 항목
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recentNodes.map(({ node, path: fullPath }) => (
              <button
                key={node.id}
                onClick={() => jumpToNode(fullPath)}
                className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 shadow-sm active:bg-gray-50"
              >
                {fullPath.map((n) => n.label).join(" > ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {isSearching ? (
        // 검색 모드: 트리 깊이 무관하게 라벨+답변 매칭된 노드를 경로와 함께 표시.
        // 클릭하면 검색 결과 자리에서 펼치는 게 아니라, "내가 고른 흐름" 카드 쌓기
        // 화면으로 그대로 이동해서 일반 탐색과 똑같은 경험을 준다.
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {searchResults.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">
              &ldquo;{trimmedQuery}&rdquo;에 대한 검색 결과가 없어요
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {searchResults.map(({ node, path: hitPath }) => (
                <li key={node.id}>
                  <button
                    onClick={() => {
                      const fullPath = findPathToNode(guideTrees, node.id);
                      if (fullPath) jumpToNode(fullPath);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left active:bg-gray-50"
                  >
                    <span className="min-w-0">
                      {hitPath.length > 0 && (
                        <span className="mb-0.5 block truncate text-xs font-medium text-emerald-600">
                          {hitPath.join(" / ")}
                        </span>
                      )}
                      <span className="block text-[15px] font-medium text-gray-900">
                        {node.label}
                      </span>
                    </span>
                    <ChevronRightIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* 지금까지 고른 흐름이 있으면 맨 위에 한 줄로 요약 + 처음부터 다시 버튼 */}
          {path.length > 0 && (
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
              <p className="text-sm text-emerald-700">
                <span className="font-semibold">내가 고른 흐름</span>{" "}
                <span className="text-emerald-600">
                  {path.map((n) => n.label).join(" → ")}
                </span>
              </p>
              <button
                onClick={resetAll}
                className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
              >
                처음부터
              </button>
            </div>
          )}

          {/* 단계별 카드: 선택을 마친 단계는 "고른 항목"만 보이고,
              아직 선택 전인 마지막 단계는 옵션 목록을 그대로 보여준다. */}
          {stages.map((stage) => {
            const isLastStage = stage.depth === stages.length - 1;
            const showOptions = !stage.selected; // 아직 선택 안 한 단계 = 옵션 펼친 상태

            return (
              <div
                key={stage.depth}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {stage.selected && (
                  <button
                    onClick={() => reopenStage(stage.depth)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
                        {stage.depth + 1}
                      </span>
                      <span className="text-[15px] font-medium text-gray-900">
                        {stage.selected.label}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      변경
                    </span>
                  </button>
                )}

                {/* 답변(leaf)이면 바로 아래 펼쳐서 보여줌 */}
                {stage.selected &&
                  isLeaf(stage.selected) &&
                  openAnswerId === stage.selected.id && (
                    <p className="whitespace-pre-line px-5 pb-4 text-sm leading-relaxed text-gray-500">
                      {stage.selected.answer}
                    </p>
                  )}

                {showOptions && (
                  <>
                    {!isLastStage && (
                      <p className="px-5 pt-4 text-xs font-medium text-gray-400">
                        다시 선택해주세요
                      </p>
                    )}
                    {stage.options.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {stage.options.map((node) => (
                          <li key={node.id}>
                            <button
                              onClick={() => selectAt(stage.depth, node)}
                              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left active:bg-gray-50"
                            >
                              <span className="text-[15px] font-medium text-gray-900">
                                {node.label}
                              </span>
                              {isLeaf(node) ? (
                                <ChevronDownIcon open={false} />
                              ) : (
                                <ChevronRightIcon />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-5 py-10 text-center text-sm text-gray-400">
                        아직 등록된 내용이 없어요
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cn(
        "h-4 w-4 flex-shrink-0 text-gray-400 transition-transform",
        open && "rotate-180"
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}