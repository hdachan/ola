// 가입 안내 챗봇용 질문/답변 트리 데이터
// 실제 FAQ 게시판 데이터(faqEntries/faqCategories)의 내용을 그대로 가져와서
// "대분류 -> 소분류 -> 질문 -> 답변" 3단계 트리로 재구성한 것.
// 원본 FAQ 데이터를 수정하면 이 파일도 같이 맞춰서 갱신해줘야 한다(자동 동기화 아님).
//
// 분류 기준 (2026-06-18: "올라펫보험 Q&A 분류 정리 (v2)" 문서의 A~F 대분류로 전면 재구성):
//   A. 가입하기      = 가입 방법, 가입연령, 계약 전후 알릴 사항, 가입조건·기존질병, 보장개시·대기기간, 청구·사고접수
//   B. 올라 특장점   = 타사 비교
//   C. 보장 범위·특약 = 보장하지 않는 손해, 특약·보장항목, 질환별 보장 안내
//   D. 보험료·갱신·계약관리 = 보험료·납부, 갱신, 계약관리·증권
//   E. 진료·치료 관련 = 진료·검사
//   F. 상품·운영 안내 = 상품 설계·운영, 상담·분쟁조정

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
  widgets?: FaqWidgetId[]; // 답변과 함께 보여줄 인터랙티브 위젯들 (선택, 순서대로 렌더링)
}

export const guideTrees: GuideNode[] = [
  // ── A. 가입하기 ─────────────────────────────────
  {
    id: "join-root",
    label: "가입하기",
    children: [
      {
        id: "join-how",
        label: "가입 방법",
        children: [
          {
            id: "faq-how-to-join",
            label: "가입을 어떻게 하나요?",
            answer:
              "몰리스 매장이나 고객센터(1522-5179)를 통해 가입 안내문에 들어 있는 큐알코드를 카메라로 촬영하시면 가입화면이 나옵니다.\n가까운 몰리스 매장이 없는 경우 1522-5179 고객센터에 요청하시면 됩니다.\n카카오톡에서 \"올라\" 검색 후 올라펫 채널을 통해서도 확인 가능합니다.",
            widgets: ["contact-buttons", "flyer-images"],
          },
          {
            id: "faq-flyer-join",
            label: "전단에서 어떻게 가입이 가능한가요?",
            answer: "전단에 있는 QR을 이용해 가입 하실 수 있습니다.",
            widgets: ["flyer-images"],
          },
        ],
      },
      {
        id: "join-age",
        label: "가입연령",
        children: [
          {
            id: "faq-min-age",
            label: "최소 몇 살부터 가능한가요?",
            answer: "생후 60일 이후부터 가능합니다. (61일)",
            widgets: ["dog-age-calculator"],
          },
          {
            id: "faq-max-age",
            label: "최대 몇 살까지 가능한가요?",
            answer:
              "12세까지 가능합니다. (26년도 기준 2013년 생일이 지나지 않았다면 가능)\n갱신시 20세까지 보장됩니다.\n(즉 12세 때 가입해야 20세까지 보장된다는 의미)",
            widgets: ["dog-age-calculator"],
          },
        ],
      },
      {
        id: "join-notice",
        label: "계약 전후 알릴 사항",
        children: [
          {
            id: "faq-pre-contract-notice",
            label: "가입자의 계약 전 알릴 사항이 있나요?",
            answer: "피보험자는 보험계약 청약시 가입조건 질문 등에 꼼꼼히 답변하시면 됩니다.",
          },
          {
            id: "faq-post-contract-change",
            label: "가입자의 계약 후 변동 사항은 어떻게 처리하나요?",
            answer: "기재사항을 변경하고자 할 때 또는 변경이 생겼음을 알게 되었을 때 알려주셔야 합니다.",
          },
          {
            id: "faq-transfer-pet",
            label: "반려동물을 양도할 때는 어떻게 하나요?",
            answer: "위험이 변경되거나 변경되었음을 알았을 때 알려주셔야 합니다.",
          },
        ],
      },
      {
        id: "join-eligibility",
        label: "가입 가능 여부·기존질병",
        children: [
          {
            id: "faq-congenital-disease",
            label: "선천성 질환이 있는 아이도 가입할 수 있나요?",
            answer:
              "가입 자체는 가능할 수 있으나, 선천성·유전성질병에 의한 손해는 원칙적으로 보상하지 않습니다(치료비 특별약관 제3조 ①-13호 가).\n단, 보험기간 중 최초로 발견된 경우에는 해당 보험기간에 한해 보상합니다.",
          },
          {
            id: "faq-already-sick",
            label: "이미 아픈 상태인데 가입이 가능한가요?",
            answer:
              "계약을 맺을 때 보험사고가 이미 발생한 경우 계약은 무효입니다.\n또한 최초계약의 보험개시일 이전에 이미 감염 또는 발병한 질병·상해는 보상하지 않습니다.\n(이 경우 3개월 이내 진찰받은 이력이 있으면 3개월 이후 가입하면 됩니다. 단 만성질환으로 약을 복용중이면 가입이 어렵습니다. 가입 후 슬개골·고관절은 90일, 다른 질병은 대기기간 30일이 적용됩니다.)",
          },
          {
            id: "faq-recent-visit",
            label: "동물병원에 최근 3개월 이내 다녀왔는데 가입이 가능한가요?",
            answer:
              "마지막 진료를 받은 날부터 3개월이 지났으면 가입이 가능합니다.\n예방목적으로 방문한 경우는 해당하지 않습니다.",
          },
        ],
      },
      {
        id: "join-waiting-period",
        label: "보장 개시·대기기간",
        children: [
          {
            id: "faq-policy-start-date",
            label: "가입 후 언제부터 보장이 되나요?",
            answer:
              "보험료를 납부하고 가입증명서를 받으셨다면 가입하신 보험기간 1년 동안 보장이 됩니다.\n상해(사고)는 즉시, 질병은 30일, 슬·고관절 관련은 90일의 대기기간(면책기간)이 있습니다.\n(슬·고관절은 보통 6개월 혹은 1년의 대기기간이 있으나, 올라는 90일로 고객에게 유리하게 적용합니다.)",
          },
          {
            id: "faq-chronic-disease",
            label: "만성질환도 보장하나요?",
            answer:
              "지속된 질환으로 병원에 다니는 만성질환의 경우 보험가입 기간 내 발생한 경우 보상됩니다.\n하나의 사고·질병 등으로 인하여 2회 이상 치료하는 경우에도 이를 하나의 사고로 간주하여 보상해 드립니다. (자기부담금 1회 3만원, 합병증 및 수의학상 서로 중요한 관련이 있는 경우는 동일 사고로 간주)\n최종 치료일에서 90일이 경과하여 개시되는 사고는 새로운 사고로 간주합니다. (자기부담금 3만원 발생)",
          },
          {
            id: "faq-one-accident",
            label: "하나의 사고란 무엇인가요?",
            answer:
              "하나의 질병 또는 상해를 의미합니다.\n\"1회의 보험사고\"란 하나의 행위 또는 사실상 같은 종류의 위험에 계속적, 반복적 또는 누적적으로 노출되어 그 결과로 발생한 모든 사고를 말합니다.\n발생 원인이 동일하거나 합병증 및 수의학상 서로 중요한 관련이 있는 질병도 포함됩니다.",
          },
          {
            id: "faq-multiple-visits-one-accident",
            label: "하나의 사고로 여러 번 병원에 다녀온 경우는 어떻게 되나요?",
            answer:
              "입원, 통원, 수술 상관없이 하나의 사고(상해나 질병) 등으로 인하여 2회 이상 치료하는 경우에도 이를 하나의 사고로 간주하여 보상해 드립니다. (자기부담금 1회 3만원, 합병증 및 수의학상 서로 중요한 관련이 있는 경우는 동일 사고로 간주)\n최종 치료일에서 90일이 경과하여 개시되는 사고는 새로운 사고로 간주합니다. (자기부담금 3만원 발생)",
          },
        ],
      },
      {
        id: "join-claim",
        label: "청구·사고접수",
        children: [
          {
            id: "faq-claim-method",
            label: "보험료 청구 및 사고 접수는 어떻게 하나요?",
            answer: "청구는 아래 접수 방법을 통해 진행해 주시기 바랍니다.",
            widgets: ["claim-contact-buttons"],
          },
          {
            id: "faq-dog-injured",
            label: "강아지가 다쳤을때 어떻게 해야될까요?",
            answer: "테스트",
          },
        ],
      },
    ],
  },

  // ── B. 올라 특장점 ─────────────────────────────────
  {
    id: "strength-root",
    label: "올라 특장점",
    children: [
      {
        id: "strength-compare",
        label: "타사 비교",
        children: [
          {
            id: "faq-strength-vs-others",
            label: "올라펫보험이 다른 보험과 다른 특장점이 뭔가요?",
            answer:
              "가장 큰 장점은 질병과 상해로 인한 입원, 통원, 수술 치료비를 횟수 제한 없이 사고당 7백만원 한도 내 연간 최대 3천만원 한도 내에서 보장하는 점입니다.\n또 피부, 구강질환, 치료비 부담이 높은 슬개골·고관절 관련 질환까지 확장보장 합니다.\n반려동물로 인한 배상책임도 대인·대동물 3천만원 한도 내에서 보상합니다.\n복잡한 특약을 포함하고 핵심보장을 균형있게 설계한 보험입니다.",
          },
          {
            id: "faq-strength-vs-db-pet",
            label: "일반 DB손해보험의 펫보험과 다른 점이 뭔가요?",
            answer:
              "올라는 이마트가 계약자로 DB손해보험과 계약하는 단체보험에 고객을 피보험자로 가입시키는 방식입니다. 쉽게 말하자면 좋은 조건으로 공동구매하는 것입니다.\n복잡한 특약을 포함시켰고 핵심보장을 균형있게 설계한 보험입니다.",
          },
        ],
      },
    ],
  },

  // ── C. 보장 범위·특약 ─────────────────────────────────
  {
    id: "coverage-root",
    label: "보장 범위·특약",
    children: [
      {
        id: "coverage-not-covered",
        label: "보장하지 않는 손해",
        children: [
          {
            id: "faq-not-covered",
            label: "보상하지 않는 손해는 무엇인가요?",
            answer:
              "(기본) 예방이나 검진 등의 목적, 미용의 목적, 출산 관련 등은 보상하지 않습니다.\n손톱절제, 유치잔존, 잠복고환, 제대헤르니아(배꼽부위 탈장), 항문낭 제거 등 건강한 동물에 실시하는 외과수술 및 기타검사, 점안, 귀청소 등의 관리비용도 보상하지 않습니다.\n※ 약관 28페이지 제3조1항 보상하지 않는 손해 리스트 참조\n단, 3조 2항·3항의 피부병, 구강질환, 치과, 슬관절 등은 추가 기재된 특약으로 보장됩니다.",
          },
        ],
      },
      {
        id: "coverage-rider",
        label: "특약·보장 항목",
        children: [
          {
            id: "faq-rider-coverage",
            label: "특약은 따로 가입하나요? 특약이 뭐예요?",
            answer:
              "보장담보(특약)은 포함되어 있으며 다음을 보장합니다.\n상해 및 질병치료비 (피부병, 구강질환, 슬·고관절 탈구) 보장\n반려동물 배상책임 (대인, 대동물)\n반려동물 사망시 위로금 지급",
          },
          {
            id: "faq-treatment-after-expiry",
            label: "치료를 받던 중 보험기간이 만료됐어요.",
            answer:
              "만료된 경우에도 만료일로부터 180일 이내 치료비는 보상합니다.\n단, 사고일 또는 발병일로부터 365일 이내의 치료인 경우에 한합니다. (가입기간 1년 기준)",
          },
          {
            id: "faq-overseas-treatment",
            label: "해외에서 발생한 병원비도 보장되나요?",
            answer: "국내에서 수의사에게 치료를 받은 경우에만 보상합니다.",
          },
          {
            id: "faq-liability-coverage",
            label: "배상책임은 뭔가요?",
            answer:
              "반려동물의 행위에 기인하는 우연한 사고로 타인의 신체 및 타인 소유의 반려동물에 손해를 입혀 배상책임을 부담함으로써 입은 손해를 3천만원 한도 내에서 보상합니다. (자기부담금 3만원 차감)\n단, 세대를 같이 하는 친족인 경우 배상책임 대상이 아닙니다.\n소음, 냄새, 털날림 등으로 인한 손해, 전염병으로 인한 손해 등도 배상책임 대상이 아닙니다.",
          },
          {
            id: "faq-what-is-injury",
            label: "상해란 무엇인가요?",
            answer:
              "보험기간 중에 발생한 급격하고도 우연한 외래의 사고로 반려동물이 입은 상해를 말하며, 유독 가스 또는 유독 물질을 반려동물이 우연히 일시적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상을 포함합니다.\n그러나 음식물 섭취로 인한 증상, 세균성 음식물 중독과 상습적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상은 포함되지 않습니다.",
          },
          {
            id: "faq-food-ingestion",
            label: "음식물을 먹거나 삼켜서 병원에 다녀왔어요.",
            answer:
              "음식물 섭취로 인한 증상, 세균성 음식물 중독과 상습적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상은 보상하지 않습니다.\n※ 음식물: 반려동물이 일상생활 중 보호자 또는 생산자의 의도와 상관없이 섭취할 수 있는 모든 식이 원료와 가공품 및 부산물(뼈, 과일 씨 등 폐기 대상 물질)\n그러나 '이물섭식', 즉 음식물이 아닌 이물을 먹어 발생한 사고는 상해로 인정합니다.",
          },
          {
            id: "faq-deductible",
            label: "자기부담금은 얼마인가요?",
            answer: "3만원입니다.",
          },
        ],
      },
      {
        id: "coverage-by-disease",
        label: "질환별 보장 안내",
        children: [
          {
            id: "faq-coverage-skin",
            label: "피부병도 보장되나요?",
            answer:
              "피부병(외이염, 중이염, 피부알러지, 피부트러블 포함)을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다. (가입기간 중 발생, 대기기간 30일 이후)",
          },
          {
            id: "faq-coverage-oral",
            label: "구강질환도 보장되나요?",
            answer: "구강내 질환을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
          },
          {
            id: "faq-coverage-dental",
            label: "치과질환도 보장되나요?",
            answer:
              "치석 제거 및 치아부정교합, 치주질환 등 치과 치료비용, 구강내 질환을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.\n※ 치과 치료 항목 중 구강내 질환 및 구강내 질환으로 인한 치과 치료비용은 보상하지 않습니다. (예: 잇몸염증이 악화되어 발치 등 구강질환과 치과 치료의 교집합 영역)",
          },
          {
            id: "faq-coverage-knee-hip",
            label: "강아지 슬관절, 고관절도 보장되나요?",
            answer:
              "슬관절 탈구, 고관절 탈구, 슬관절 형성부전, 고관절 형성부전 또는 기타 이들과 유사한 질병 또는 상해를 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
          },
          {
            id: "faq-coverage-cat-urinary",
            label: "고양이 비뇨기질환(요로결석)도 보장되나요?",
            answer: "비뇨기질환(요로결석 등)을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
          },
          {
            id: "faq-coverage-cat-dental",
            label: "고양이 치과도 보장되나요?",
            answer:
              "치석 제거 및 치아부정교합 등 치과 치료비용(치주질환으로 인한 비용 포함)을 특약으로 보상합니다.\n※ 구강내 질환 및 구강내 질환으로 인한 치과 치료비용은 보상하지 않습니다. (예: 잇몸염증이 악화되어 발치 등. 구강질환과 치과 치료의 교집합 영역)",
          },
        ],
      },
    ],
  },

  // ── D. 보험료·갱신·계약관리 ─────────────────────────────────
  {
    id: "premium-root",
    label: "보험료·갱신·계약관리",
    children: [
      {
        id: "premium-payment",
        label: "보험료·납부",
        children: [
          {
            id: "faq-renewal-premium-change",
            label: "1년 후 갱신시 보험료가 달라지나요?",
            answer: "연령, 손해율에 따라 보험료가 달라지거나 인상될 수 있습니다.",
          },
          {
            id: "faq-yearly-premium",
            label: "보험료 납부는 연납만 가능한가요?",
            answer:
              "현재 보험료 납부는 카드, 계좌이체 등으로 연납만 가능하며 12개월까지 할부가 가능합니다.\n최대 5개월까지 무이자 할부가 가능합니다. (우리카드는 6개월)",
          },
          {
            id: "faq-discount",
            label: "할인이나 혜택은 없나요?",
            answer: "이마트 몰리스가 좋은 조건으로 단체계약하는 상품이라 따로 할인 등은 없습니다.",
          },
          {
            id: "faq-senior-dog-premium",
            label: "고령견 가입시 보험료가 너무 비싸요.",
            answer: "이 경우 다른 상품도 비교해 보시고 가입조건 등과 보험료를 확인해 보시면 좋을 것 같습니다.",
          },
        ],
      },
      {
        id: "premium-renewal",
        label: "갱신",
        children: [
          {
            id: "faq-renewal-waiting-period",
            label: "갱신 계약할 때도 대기기간(면책기간)이 적용되나요?",
            answer: "갱신 계약일 때는 면책기간 없이 바로 보장됩니다.",
          },
          {
            id: "faq-renewal-max-age",
            label: "얼마나/언제까지 갱신이 가능하죠?",
            answer: "최대 20세 까지 갱신 가능합니다.",
          },
        ],
      },
      {
        id: "premium-contract-management",
        label: "계약관리·증권",
        children: [
          {
            id: "faq-unknown-breed-age",
            label: "반려동물의 정확한 품종이나 나이를 모를 때는 어떻게 하나요?",
            answer: "동물병원에서 수의사 선생님의 비문 등의 확인으로 추정할 수 있습니다.",
          },
          {
            id: "faq-policy-document",
            label: "가입 완료 후 보험증권은 어떻게 받을 수 있나요?",
            answer: "가입시 가입증명서가 발송됩니다.",
          },
          {
            id: "faq-refund",
            label: "해약환급금 및 만기환급금은 어떻게 되나요?",
            answer:
              "만기환급금은 없으며, 해약시 보험사가 제반비용 계산 후 일할계산하여 돌려드립니다.\n보험계약 대출제도는 없습니다.",
          },
        ],
      },
    ],
  },

  // ── E. 진료·치료 관련 ─────────────────────────────────
  {
    id: "treatment-root",
    label: "진료·치료 관련",
    children: [
      {
        id: "treatment-exam",
        label: "진료·검사",
        children: [
          {
            id: "faq-mri-ct",
            label: "MRI, CT 등 검사도 가능한가요?",
            answer: "예방 목적이 아닌 치료상 필요한 경우에 가능합니다.",
          },
        ],
      },
    ],
  },

  // ── F. 상품·운영 안내 ─────────────────────────────────
  {
    id: "product-root",
    label: "상품·운영 안내",
    children: [
      {
        id: "product-design",
        label: "상품 설계·운영",
        children: [
          {
            id: "faq-product-design",
            label: "올라 펫보험은 어떻게 설계되어 있나요?",
            answer:
              "올라는 몰리스가 복잡하지 않게 특약을 포함해 핵심보장을 균형있게 설계한 상품이라 단일 상품이며, 품종 및 나이 등에 따라 보험료가 산출됩니다.",
          },
          {
            id: "faq-emart-discontinue",
            label: "이마트 몰리스가 이 보험을 없애면 어떻게 되나요?",
            answer:
              "이마트가 계약자로 하고 고객을 피보험자로 하는 단체계약이며, 올라 상품이 없어질 경우 DB손해보험과의 계약으로 전환됩니다.",
          },
          {
            id: "faq-terms-request",
            label: "약관은 따로 없나요? 더 구체적으로 알고 싶어요.",
            answer: "가입 고객에게 약관을 보내드립니다. (1522-5179로 요청 및 상담 가능)",
            widgets: ["contact-buttons"],
          },
        ],
      },
      {
        id: "product-dispute",
        label: "상담·분쟁조정",
        children: [
          {
            id: "faq-dispute-resolution",
            label: "상담 및 분쟁조정이 필요한 경우 어떻게 하나요?",
            answer:
              "www.dbins.com 고객센터에서 전자민원을 접수할 수 있습니다.\n1588-0100에서도 접수 가능합니다.",
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