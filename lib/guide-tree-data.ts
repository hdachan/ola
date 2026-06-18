// 가입 안내 챗봇용 질문/답변 트리 데이터
// 실제 FAQ 게시판 데이터(faqEntries/faqCategories)의 내용을 그대로 가져와서
// "대분류 -> 소분류 -> 질문 -> 답변" 3단계 트리로 재구성한 것.
// 원본 FAQ 데이터를 수정하면 이 파일도 같이 맞춰서 갱신해줘야 한다(자동 동기화 아님).
//
// 분류 기준:
//   대분류 "가입하기"  = 가입이 되는지/어떻게 하는지에 대한 것
//     소분류 "가입 안내"     = 가입 가능 나이, 가입 경로, 보험 개시일 등
//     소분류 "가입 조건·심사" = 다른보험, 예방접종, 기존질병 등 가입 심사 기준
//   대분류 "이용하기"  = 가입 이후 실제 이용에 대한 것
//     소분류 "보장 안내"      = 보장범위, 보상금액, 자기부담금
//     소분류 "보험료·갱신"    = 결제, 할부, 갱신
//     소분류 "사고·청구"      = 다쳤을 때 대처, 청구 방법

// 위젯 id 타입은 여기서 따로 정의하지 않고 실제 FAQ 데이터(lib/faq-entries)의
// 타입을 그대로 재사용한다. 두 군데서 따로 정의하면 한쪽만 고치고 잊어버려서
// 어긋날 수 있기 때문에, 새 위젯을 추가할 때도 lib/faq-entries.ts의
// FaqWidgetId 한 곳에만 추가하면 된다.
import type { FaqWidgetId } from "@/lib/faq-entries";
export type { FaqWidgetId } from "@/lib/faq-entries";

export interface GuideNode {
  id: string;
  label: string; // 버튼/말풍선에 표시되는 선택지 텍스트
  children?: GuideNode[]; // 다음 단계 선택지 (있으면 중간 노드)
  answer?: string; // 최종 답변 (children이 없는 leaf 노드일 때 사용)
  widget?: FaqWidgetId; // 답변과 함께 보여줄 인터랙티브 위젯 (선택)
}

export const guideTrees: GuideNode[] = [
  // ── 대분류: 가입하기 ─────────────────────────────────
  {
    id: "join-root",
    label: "가입하기",
    children: [
      {
        id: "join-info",
        label: "가입 안내",
        children: [
          {
            id: "faq-min-age",
            label: "몇 살부터 가입 가능한가요?",
            answer:
              "생후 60일 부터 가입 가능합니다.\n※ 61일이 지난 시점 가입 가능",
            widget: "dog-age-calculator",
          },
          {
            id: "faq-max-age",
            label: "몇 살까지 가입 가능한가요?",
            answer:
              "12세까지 가입가능합니다.\n※2013년 아이의 생일 전날까지 가능합니다.",
            widget: "dog-age-calculator",
          },
          {
            id: "faq-no-store-visit",
            label: "매장방문이 어려운 사람들은 어떻게 가입이 가능할까요?",
            answer:
              "올라 CS 카카오톡 채널에서 확인하시거나,\n전화(1522-5179) 또는 이메일(csolapet@gmail.com)로 문의주시면 전단을 보내드립니다.",
            widget: "contact-buttons",
          },
          {
            id: "faq-flyer-join",
            label: "전단에서 어떻게 가입이 가능한가요?",
            answer: "전단에 있는 QR을 이용해 가입 하실 수 있습니다.",
            widget: "flyer-images",
          },
          {
            id: "faq-policy-start-date",
            label: "보험 개시일은 언제인가요?",
            answer:
              "입력하신 보험기간의 시작일(개시일)부터 보장이 시작되며, \n보험료 결제 완료 후 해당 보험기간 동안 보장을 받으실 수 있습니다.",
          },
        ],
      },
      {
        id: "join-screening",
        label: "가입 조건·심사",
        children: [
          {
            id: "faq-other-insurance",
            label: "다른 보험이 있는 경우 가입이 가능한가요?",
            answer: "가입이 가능하지 않습니다. \n(수정필요- 비례 부분)",
          },
          {
            id: "faq-no-diagnosis-doc",
            label: "질병 진단서를 안넣고 가입이 가능한가요?",
            answer: "테스트",
          },
          {
            id: "faq-vaccination-required",
            label: "예방 접종을 맞아야 가입이 가능한가요?",
            answer:
              "네 맞습니다.\n[강아지] 피보바이러스감염증, 디스템퍼바이러스감염증, 파라인플루엔자감염증, 전염성간염, 아데노바이러스2형 감염증, 코로나바이러스감염증, 렙토스피라감염증, 필라리아감염증, 광견병\n[고양이] 고양이범백혈구감소증, 고양이칼리시바이러스감염증, 고양이바이러스성비기관지염 고양이백혈병바이러스감염증",
          },
          {
            id: "faq-pre-existing-condition-join",
            label: "슬개골/구강질환/피부질환이 있는 경우 가입이 불가능한가요?",
            answer: "네 과거 이력이 있는경우 가입이 제한 될 수 있습니다.",
          },
          {
            id: "faq-recent-visit",
            label: "동물병원에 최근 3개월 전에 다녀왔는데 가입이 불가능할까요?",
            answer:
              "네 안타깝게도 현재 질병 및 사고로 치료 또는 경과 관찰 중이거나 과거 3개월 이내에 동물병원에서 진료 받은 내역이 있다면 가입이 제한 될 수있습니다. \n※ 다만 예방 목적인 경우 해당하지 않음",
          },
          {
            id: "faq-one-accident",
            label: "한사고라는 건 무엇인가요?",
            answer: "하나의 질병. \n다만 90일 이후에는 이 질병으로 가입시 불가능",
          },
          {
            id: "faq-taking-medicine",
            label: "약을 먹고 있는경우 가입이 가능할까요?",
            answer: "테스트",
          },
          {
            id: "faq-vet-staff",
            label: "동물병원 종사자는 가입이 불가능 할까요?",
            answer: "테스트",
          },
          {
            id: "faq-unknown-birthdate",
            label: "강아지의 생년월일이 기억 나지 않아요 어떻게 해야 되나요?",
            answer: "테스트",
          },
        ],
      },
    ],
  },

  // ── 대분류: 이용하기 ─────────────────────────────────
  {
    id: "use-root",
    label: "이용하기",
    children: [
      {
        id: "use-coverage",
        label: "보장 안내",
        children: [
          {
            id: "faq-coverage-knee-oral-skin",
            label: "슬개골/구강질환/피부질환을 보장하나요?",
            answer: "네 치료목적인 경우 보장합니다.",
          },
          {
            id: "faq-continuous-coverage",
            label: "강아지가 질병이 생겼을때 계속 보상해 주신다는 말인가요?",
            answer:
              "한사고에 해당해서는 최대 700만원, 연간 3000만원 까지 보상합니다.",
          },
          {
            id: "faq-deductible",
            label: "자기부담금은 얼마인가요?",
            answer: "3만원입니다.",
          },
          {
            id: "faq-strength",
            label: "강점이 먼가요?",
            answer: "테스트",
          },
        ],
      },
      {
        id: "use-premium",
        label: "보험료·갱신",
        children: [
          {
            id: "faq-card-installment",
            label: "카드 할부 가능한가요?",
            answer: "네 카드 할부가능합니다.\n※카드 사별 무이자는 상이",
          },
          {
            id: "faq-yearly-premium",
            label: "보험료는 1년단위 밖에 안되나요?",
            answer:
              "네 맞습니다. 현재 분납 가능하시구요. 월납이 가능하지 않으나\n최대12개월 할부가가능하구요 무이자는 5개월까지 가능합니다.",
          },
          {
            id: "faq-renewal-estimate",
            label: "갱신 예상 금액은 얼마인가요?",
            answer: "테스트",
          },
          {
            id: "faq-renewal-max-age",
            label: "얼마나/언제까지 갱신이 가능하죠?",
            answer: "최대 20세 까지 갱신 가능합니다.",
          },
        ],
      },
      {
        id: "use-claim",
        label: "사고·청구",
        children: [
          {
            id: "faq-dog-injured",
            label: "강아지가 다쳤을때 어떻게 해야될까요?",
            answer: "테스트",
          },
          {
            id: "faq-claim-method",
            label: "청구는 어떻게 할 수있나요?",
            answer: "청구는 아래 접수 방법을 통해 진행해 주시기 바랍니다.",
            widget: "claim-contact-buttons",
          },
        ],
      },
    ],
  },
];

// id를 기준으로 트리를 순회해서, 루트부터 해당 노드까지의 경로(자기 자신 포함)를 반환
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

// 검색 기능용: 트리 전체를 순회하면서 label 또는 answer에 검색어가 포함된
// "leaf 노드(실제 질문)"만 모아서 반환한다. 중간 분류 노드는 검색 결과에 포함하지 않는다.
export interface SearchHit {
  node: GuideNode; // 매칭된 질문 노드 (leaf)
  path: GuideNode[]; // 루트부터 이 노드까지의 전체 경로 (자기 자신 포함)
}

export function searchGuideTree(
  roots: GuideNode[],
  query: string
): SearchHit[] {
  const lower = query.trim().toLowerCase();
  if (!lower) return [];

  const hits: SearchHit[] = [];

  function walk(node: GuideNode, path: GuideNode[]) {
    const nextPath = [...path, node];
    const isLeafNode = !node.children || node.children.length === 0;

    if (isLeafNode) {
      const matches =
        node.label.toLowerCase().includes(lower) ||
        (node.answer ?? "").toLowerCase().includes(lower);
      if (matches) {
        hits.push({ node, path: nextPath });
      }
      return;
    }

    node.children?.forEach((child) => walk(child, nextPath));
  }

  roots.forEach((root) => walk(root, []));
  return hits;
}