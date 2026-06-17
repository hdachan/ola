// 가입 안내 트리 데이터
// GuideNode: 트리의 노드 하나. children이 있으면 더 들어갈 수 있음.
//   children이 없으면 "마지막 답변 노드"로 보고 answer를 보여준다.
// 검색 시에는 트리 깊이와 무관하게 label + answer를 모두 대상으로 매칭한다.

export interface GuideNode {
  id: string;
  label: string;
  answer?: string; // 자식이 없는 말단 노드는 answer를 채워서 펼쳤을 때 보여줄 내용으로 사용
  children?: GuideNode[];
}

// 청구 > 팩스, 우편, 메일
export const claimTree: GuideNode = {
  id: "claim",
  label: "청구",
  children: [
    { id: "claim-fax", label: "팩스", answer: "테스트" },
    { id: "claim-mail-post", label: "우편", answer: "테스트" },
    { id: "claim-email", label: "메일", answer: "테스트" },
  ],
};

// QR > 중성화 > (중성화한날도 되나요? O / 중성화 하러가기전 되나요? X / 중성화 하면되나요? O / 다른보험)
export const qrTree: GuideNode = {
  id: "qr",
  label: "QR",
  children: [
    {
      id: "neutering",
      label: "중성화",
      children: [
        {
          id: "neutering-same-day",
          label: "중성화한날도 되나요? O",
          answer: "테스트",
        },
        {
          id: "neutering-before",
          label: "중성화 하러가기전 되나요? X",
          answer: "테스트",
        },
        {
          id: "neutering-do",
          label: "중성화 하면되나요? O",
          answer: "테스트",
        },
        {
          id: "neutering-other-insurance",
          label: "다른보험",
          answer: "테스트",
        },
        {
  id: "neutering-cost",
  label: "중성화 비용도 보장되나요?",
  children: [
    { id: "neutering-cost-yes", label: "보장됩니다", answer: "테스트" },
    { id: "neutering-cost-no", label: "보장 안됩니다", answer: "테스트" },
  ],
},
      ],
    },
  ],
};

export const guideTrees: GuideNode[] = [claimTree, qrTree];

// 주어진 id를 가진 노드까지 가는 경로(루트 포함, 자기 자신 포함)를 찾는다.
// 어느 트리에 속하는지 모를 때도 바로 찾을 수 있도록 guideTrees 전체를 훑는다.
export function findPathToNode(
  roots: GuideNode[],
  targetId: string
): GuideNode[] | null {
  function walk(node: GuideNode, path: GuideNode[]): GuideNode[] | null {
    const nextPath = [...path, node];
    if (node.id === targetId) return nextPath;
    if (!node.children) return null;
    for (const child of node.children) {
      const found = walk(child, nextPath);
      if (found) return found;
    }
    return null;
  }

  for (const root of roots) {
    const found = walk(root, []);
    if (found) return found;
  }
  return null;
}