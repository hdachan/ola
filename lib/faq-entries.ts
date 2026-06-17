// FAQ 질문/답변 데이터
// answer는 줄바꿈을 그대로 살려서 보여줄 것이므로 원문 줄바꿈을 유지한다.
// category는 화면에서 묶어서 보여줄 때 쓰는 분류 id (faqCategories 참고)

export type FaqCategoryId = "join" | "coverage";

export interface FaqCategoryInfo {
  id: FaqCategoryId;
  label: string;
}

// 화면에 보여줄 순서 그대로
export const faqCategories: FaqCategoryInfo[] = [
  { id: "join", label: "가입·이용 안내" },
  { id: "coverage", label: "보장 안내" },
];

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: FaqCategoryId;
}

export const faqEntries: FaqEntry[] = [
  // 가입·이용 안내: 나이, 가입 절차, 가입 조건, 보험기간처럼
  // "가입 전후에 알아야 할 것들" 묶음
  {
    id: "faq-min-age",
    question: "몇 살부터 가입 가능한가요?",
    answer: "네, 생후 60일 이후부터\n가입 가능하답니다.",
    category: "join",
  },
  {
    id: "faq-max-age",
    question: "몇 살까지 가입 가능한가요?",
    answer:
      "만12세까지 가입 가능하며\n갱신시에는 최대 만20세까지 가능합니다.",
    category: "join",
  },
  {
    id: "faq-how-to-join",
    question: "가입은 어떻게 하나요",
    answer:
      "몰리스 매장이나 고객센터에서\n가입 QR이 포함 된 안내문을 받아 카메라로 QR을 촬영 시\n가입이 진행 됩니다.",
    category: "join",
  },
  {
    id: "faq-join-conditions",
    question: "가입 조건 확인",
    answer:
      "가입 시 아이의 상태를 확인하는 절차로\n꼼꼼하게 읽고 답변해 주시면 됩니다.\n3개월 이내에 예방 목적 이외의\n병원 진찰을 받은 적이 없고\n1년 이내에 일부 예방 접종을 하여야 합니다.\n확장 보장 특약이 포함되어 있어\n해당 질병 이력이 없어야 합니다.",
    category: "join",
  },
  {
    id: "faq-insurance-period",
    question: "보험기간",
    answer:
      "보험기간은 1년이며\n매년 갱신해야 합니다.\n(갱신 시 보험료가 달라 질 수 있습니다)",
    category: "join",
  },

  // 보장 안내: 무엇을, 언제부터, 어떻게 보상받는지에 대한 묶음
  {
    id: "faq-coverage-start",
    question: "보장은 언제부터 시작되나요",
    answer:
      "치료비에 대해\n상해는 즉시보장 되고\n질병은 보험개시일로부터 그날을 포함하여 30일 이후부터 보장됩니다.\n슬관절 및 고관절 관련 상해/질병은 보험개시일로부터 그날을 포함하여 90일 이후부터 보장됩니다.\n사망시위로금에 대해\n보험개시일로부터 그날을 포함하여 30일 이후부터 보장됩니다.",
    category: "coverage",
  },
  {
    id: "faq-special-coverage",
    question: "보장특약",
    answer:
      "피부병,구강질환,슬개골 및 고관절까지\n특약으로 포함 되어 있습니다.\n반려동물 배상책임(대인,대동물)\n3천만원 한도 내에서 보상합니다.\n(자기부담금 3만원)\n반려동물 사망 시 위로금 (30만원)을 지급합니다.\n(가입 30일 이후)",
    category: "coverage",
  },
  {
    id: "faq-death-comfort-money",
    question: "사망위로금 안내",
    answer:
      "안타깝지만 반려동물이 사망한 경우, 사망위로금을 지급해 드리는 보장입니다.\n동물병원에서 적법하게 시행된 안락사도 보상되며, 보험금 청구시 동물병원에서 발급한 소견서가 필요합니다.",
    category: "coverage",
  },
  {
    id: "faq-claim-documents",
    question: "보험금 청구서류 접수방법",
    answer:
      "대표팩스접수 : 0505-181-4862\n메일접수: DB2017@dbins.co.kr\n우편접수: 우편번호(54966)\n전라북도 전주시 완산구 서원로 99\n전주우체국 사서함 15호\nDB손해보험 사고접수 팀\n1588-0100",
    category: "coverage",
  },
];