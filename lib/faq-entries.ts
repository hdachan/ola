// FAQ 질문/답변 데이터
// answer는 줄바꿈을 그대로 살려서 보여줄 것이므로 원문 줄바꿈을 유지한다.
// category는 화면에서 묶어서 보여줄 때 쓰는 분류 id (faqCategories 참고)
// widget은 답변을 텍스트가 아니라 '인터랙티브 컴포넌트'로 보여주고 싶을 때만 채운다.
//   - widget이 없으면: 기존처럼 answer 텍스트만 보여줌 (기존 항목 전부 그대로 동작)
//   - widget이 있으면: answer 아래(또는 대신)에 해당 위젯 컴포넌트를 렌더링
//
// 분류는 "올라펫보험 Q&A 분류 정리 (v2)" 문서의 A~F 대분류를 그대로 따른다.
// (2026-06-18 업데이트: 기존 4개 카테고리 체계에서 문서의 6개 대분류 체계로 전면 재구성)

export type FaqCategoryId =
  | "join" // A. 가입 및 가입조건
  | "strength" // B. 올라 특장점
  | "coverage" // C. 보장 범위·특약
  | "premium" // D. 보험료·갱신·계약관리
  | "treatment" // E. 진료·치료 관련
  | "product"; // F. 상품·운영 안내

export interface FaqCategoryInfo {
  id: FaqCategoryId;
  label: string;
}

// 화면에 보여줄 순서 그대로
export const faqCategories: FaqCategoryInfo[] = [
  { id: "join", label: "가입 및 가입조건" },
  { id: "strength", label: "올라 특장점" },
  { id: "coverage", label: "보장 범위·특약" },
  { id: "premium", label: "보험료·갱신·계약관리" },
  { id: "treatment", label: "진료·치료 관련" },
  { id: "product", label: "상품·운영 안내" },
];

// 위젯 종류를 정의하는 id. 새 위젯을 추가할 때마다 여기에 한 줄씩 추가.
export type FaqWidgetId =
  | "dog-age-calculator"
  | "contact-buttons"
  | "flyer-images"
  | "claim-contact-buttons";

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: FaqCategoryId;
  // 선택적 필드라서 기존 항목들은 수정할 필요 없음 (그냥 undefined로 남음)
  // 위젯을 여러 개 붙이고 싶을 때는 배열에 순서대로 나열하면 그 순서대로 렌더링됨
  widgets?: FaqWidgetId[];
}

export const faqEntries: FaqEntry[] = [
  // ════════════════════════════════════════════════════
  // A. 가입 및 가입조건
  // ════════════════════════════════════════════════════

  // 가입 방법
  {
    id: "faq-how-to-join",
    question: "가입을 어떻게 하나요?",
    answer:
      "몰리스 매장이나 고객센터(1522-5179)를 통해 가입 안내문에 들어 있는 큐알코드를 카메라로 촬영하시면 가입화면이 나옵니다.\n가까운 몰리스 매장이 없는 경우 1522-5179 고객센터에 요청하시면 됩니다.\n카카오톡에서 \"올라\" 검색 후 올라펫 채널을 통해서도 확인 가능합니다.",
    category: "join",
    widgets: ["contact-buttons", "flyer-images"],
  },

  // 가입연령
  {
    id: "faq-min-age",
    question: "최소 몇 살부터 가능한가요?",
    answer: "생후 60일 이후부터 가능합니다. (61일)",
    category: "join",
    widgets: ["dog-age-calculator"],
  },
  {
    id: "faq-max-age",
    question: "최대 몇 살까지 가능한가요?",
    answer:
      "12세까지 가능합니다. (26년도 기준 2013년 생일이 지나지 않았다면 가능)\n갱신시 20세까지 보장됩니다.\n(즉 12세 때 가입해야 20세까지 보장된다는 의미)",
    category: "join",
    widgets: ["dog-age-calculator"],
  },

  // 계약 전후 알릴 사항
  {
    id: "faq-pre-contract-notice",
    question: "가입자의 계약 전 알릴 사항이 있나요?",
    answer: "피보험자는 보험계약 청약시 가입조건 질문 등에 꼼꼼히 답변하시면 됩니다.",
    category: "join",
  },
  {
    id: "faq-post-contract-change",
    question: "가입자의 계약 후 변동 사항은 어떻게 처리하나요?",
    answer: "기재사항을 변경하고자 할 때 또는 변경이 생겼음을 알게 되었을 때 알려주셔야 합니다.",
    category: "join",
  },
  {
    id: "faq-transfer-pet",
    question: "반려동물을 양도할 때는 어떻게 하나요?",
    answer: "위험이 변경되거나 변경되었음을 알았을 때 알려주셔야 합니다.",
    category: "join",
  },

  // 가입 가능 여부 · 기존질병
  {
    id: "faq-congenital-disease",
    question: "선천성 질환이 있는 아이도 가입할 수 있나요?",
    answer:
      "가입 자체는 가능할 수 있으나, 선천성·유전성질병에 의한 손해는 원칙적으로 보상하지 않습니다(치료비 특별약관 제3조 ①-13호 가).\n단, 보험기간 중 최초로 발견된 경우에는 해당 보험기간에 한해 보상합니다.",
    category: "join",
  },
  {
    id: "faq-already-sick",
    question: "이미 아픈 상태인데 가입이 가능한가요?",
    answer:
      "계약을 맺을 때 보험사고가 이미 발생한 경우 계약은 무효입니다.\n또한 최초계약의 보험개시일 이전에 이미 감염 또는 발병한 질병·상해는 보상하지 않습니다.\n(이 경우 3개월 이내 진찰받은 이력이 있으면 3개월 이후 가입하면 됩니다. 단 만성질환으로 약을 복용중이면 가입이 어렵습니다. 가입 후 슬개골·고관절은 90일, 다른 질병은 대기기간 30일이 적용됩니다.)",
    category: "join",
  },
  {
    id: "faq-recent-visit",
    question: "동물병원에 최근 3개월 이내 다녀왔는데 가입이 가능한가요?",
    answer:
      "마지막 진료를 받은 날부터 3개월이 지났으면 가입이 가능합니다.\n예방목적으로 방문한 경우는 해당하지 않습니다.",
    category: "join",
  },

  // 보장 개시 · 대기기간
  {
    id: "faq-policy-start-date",
    question: "가입 후 언제부터 보장이 되나요?",
    answer:
      "보험료를 납부하고 가입증명서를 받으셨다면 가입하신 보험기간 1년 동안 보장이 됩니다.\n상해(사고)는 즉시, 질병은 30일, 슬·고관절 관련은 90일의 대기기간(면책기간)이 있습니다.\n(슬·고관절은 보통 6개월 혹은 1년의 대기기간이 있으나, 올라는 90일로 고객에게 유리하게 적용합니다.)",
    category: "join",
  },
  {
    id: "faq-chronic-disease",
    question: "만성질환도 보장하나요?",
    answer:
      "지속된 질환으로 병원에 다니는 만성질환의 경우 보험가입 기간 내 발생한 경우 보상됩니다.\n하나의 사고·질병 등으로 인하여 2회 이상 치료하는 경우에도 이를 하나의 사고로 간주하여 보상해 드립니다. (자기부담금 1회 3만원, 합병증 및 수의학상 서로 중요한 관련이 있는 경우는 동일 사고로 간주)\n최종 치료일에서 90일이 경과하여 개시되는 사고는 새로운 사고로 간주합니다. (자기부담금 3만원 발생)",
    category: "join",
  },
  {
    id: "faq-one-accident",
    question: "하나의 사고란 무엇인가요?",
    answer:
      "하나의 질병 또는 상해를 의미합니다.\n\"1회의 보험사고\"란 하나의 행위 또는 사실상 같은 종류의 위험에 계속적, 반복적 또는 누적적으로 노출되어 그 결과로 발생한 모든 사고를 말합니다.\n발생 원인이 동일하거나 합병증 및 수의학상 서로 중요한 관련이 있는 질병도 포함됩니다.",
    category: "join",
  },
  {
    id: "faq-multiple-visits-one-accident",
    question: "하나의 사고로 여러 번 병원에 다녀온 경우는 어떻게 되나요?",
    answer:
      "입원, 통원, 수술 상관없이 하나의 사고(상해나 질병) 등으로 인하여 2회 이상 치료하는 경우에도 이를 하나의 사고로 간주하여 보상해 드립니다. (자기부담금 1회 3만원, 합병증 및 수의학상 서로 중요한 관련이 있는 경우는 동일 사고로 간주)\n최종 치료일에서 90일이 경과하여 개시되는 사고는 새로운 사고로 간주합니다. (자기부담금 3만원 발생)",
    category: "join",
  },

  // 청구 · 사고접수
  {
    id: "faq-claim-method",
    question: "보험료 청구 및 사고 접수는 어떻게 하나요?",
    answer: "청구는 아래 접수 방법을 통해 진행해 주시기 바랍니다.",
    category: "join",
    widgets: ["claim-contact-buttons"],
  },
  {
    id: "faq-dog-injured",
    question: "강아지가 다쳤을때 어떻게 해야될까요?",
    answer: "테스트",
    category: "join",
  },

  // ════════════════════════════════════════════════════
  // B. 올라 특장점
  // ════════════════════════════════════════════════════
  {
    id: "faq-strength-vs-others",
    question: "올라펫보험이 다른 보험과 다른 특장점이 뭔가요?",
    answer:
      "가장 큰 장점은 질병과 상해로 인한 입원, 통원, 수술 치료비를 횟수 제한 없이 사고당 7백만원 한도 내 연간 최대 3천만원 한도 내에서 보장하는 점입니다.\n또 피부, 구강질환, 치료비 부담이 높은 슬개골·고관절 관련 질환까지 확장보장 합니다.\n반려동물로 인한 배상책임도 대인·대동물 3천만원 한도 내에서 보상합니다.\n복잡한 특약을 포함하고 핵심보장을 균형있게 설계한 보험입니다.",
    category: "strength",
  },
  {
    id: "faq-strength-vs-db-pet",
    question: "일반 DB손해보험의 펫보험과 다른 점이 뭔가요?",
    answer:
      "올라는 이마트가 계약자로 DB손해보험과 계약하는 단체보험에 고객을 피보험자로 가입시키는 방식입니다. 쉽게 말하자면 좋은 조건으로 공동구매하는 것입니다.\n복잡한 특약을 포함시켰고 핵심보장을 균형있게 설계한 보험입니다.",
    category: "strength",
  },

  // ════════════════════════════════════════════════════
  // C. 보장 범위 · 특약
  // ════════════════════════════════════════════════════

  // 보장하지 않는 손해
  {
    id: "faq-not-covered",
    question: "보상하지 않는 손해는 무엇인가요?",
    answer:
      "(기본) 예방이나 검진 등의 목적, 미용의 목적, 출산 관련 등은 보상하지 않습니다.\n손톱절제, 유치잔존, 잠복고환, 제대헤르니아(배꼽부위 탈장), 항문낭 제거 등 건강한 동물에 실시하는 외과수술 및 기타검사, 점안, 귀청소 등의 관리비용도 보상하지 않습니다.\n※ 약관 28페이지 제3조1항 보상하지 않는 손해 리스트 참조\n단, 3조 2항·3항의 피부병, 구강질환, 치과, 슬관절 등은 추가 기재된 특약으로 보장됩니다.",
    category: "coverage",
  },

  // 특약 · 보장 항목
  {
    id: "faq-rider-coverage",
    question: "특약은 따로 가입하나요? 특약이 뭐예요?",
    answer:
      "보장담보(특약)은 포함되어 있으며 다음을 보장합니다.\n상해 및 질병치료비 (피부병, 구강질환, 슬·고관절 탈구) 보장\n반려동물 배상책임 (대인, 대동물)\n반려동물 사망시 위로금 지급",
    category: "coverage",
  },
  {
    id: "faq-treatment-after-expiry",
    question: "치료를 받던 중 보험기간이 만료됐어요.",
    answer:
      "만료된 경우에도 만료일로부터 180일 이내 치료비는 보상합니다.\n단, 사고일 또는 발병일로부터 365일 이내의 치료인 경우에 한합니다. (가입기간 1년 기준)",
    category: "coverage",
  },
  {
    id: "faq-overseas-treatment",
    question: "해외에서 발생한 병원비도 보장되나요?",
    answer: "국내에서 수의사에게 치료를 받은 경우에만 보상합니다.",
    category: "coverage",
  },
  {
    id: "faq-liability-coverage",
    question: "배상책임은 뭔가요?",
    answer:
      "반려동물의 행위에 기인하는 우연한 사고로 타인의 신체 및 타인 소유의 반려동물에 손해를 입혀 배상책임을 부담함으로써 입은 손해를 3천만원 한도 내에서 보상합니다. (자기부담금 3만원 차감)\n단, 세대를 같이 하는 친족인 경우 배상책임 대상이 아닙니다.\n소음, 냄새, 털날림 등으로 인한 손해, 전염병으로 인한 손해 등도 배상책임 대상이 아닙니다.",
    category: "coverage",
  },
  {
    id: "faq-what-is-injury",
    question: "상해란 무엇인가요?",
    answer:
      "보험기간 중에 발생한 급격하고도 우연한 외래의 사고로 반려동물이 입은 상해를 말하며, 유독 가스 또는 유독 물질을 반려동물이 우연히 일시적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상을 포함합니다.\n그러나 음식물 섭취로 인한 증상, 세균성 음식물 중독과 상습적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상은 포함되지 않습니다.",
    category: "coverage",
  },
  {
    id: "faq-food-ingestion",
    question: "음식물을 먹거나 삼켜서 병원에 다녀왔어요.",
    answer:
      "음식물 섭취로 인한 증상, 세균성 음식물 중독과 상습적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상은 보상하지 않습니다.\n※ 음식물: 반려동물이 일상생활 중 보호자 또는 생산자의 의도와 상관없이 섭취할 수 있는 모든 식이 원료와 가공품 및 부산물(뼈, 과일 씨 등 폐기 대상 물질)\n그러나 '이물섭식', 즉 음식물이 아닌 이물을 먹어 발생한 사고는 상해로 인정합니다.",
    category: "coverage",
  },

  // 질환별 보장 안내
  {
    id: "faq-coverage-skin",
    question: "피부병도 보장되나요?",
    answer:
      "피부병(외이염, 중이염, 피부알러지, 피부트러블 포함)을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다. (가입기간 중 발생, 대기기간 30일 이후)",
    category: "coverage",
  },
  {
    id: "faq-coverage-oral",
    question: "구강질환도 보장되나요?",
    answer: "구강내 질환을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
    category: "coverage",
  },
  {
    id: "faq-coverage-dental",
    question: "치과질환도 보장되나요?",
    answer:
      "치석 제거 및 치아부정교합, 치주질환 등 치과 치료비용, 구강내 질환을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.\n※ 치과 치료 항목 중 구강내 질환 및 구강내 질환으로 인한 치과 치료비용은 보상하지 않습니다. (예: 잇몸염증이 악화되어 발치 등 구강질환과 치과 치료의 교집합 영역)",
    category: "coverage",
  },
  {
    id: "faq-coverage-knee-hip",
    question: "강아지 슬관절, 고관절도 보장되나요?",
    answer:
      "슬관절 탈구, 고관절 탈구, 슬관절 형성부전, 고관절 형성부전 또는 기타 이들과 유사한 질병 또는 상해를 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
    category: "coverage",
  },
  {
    id: "faq-coverage-cat-urinary",
    question: "고양이 비뇨기질환(요로결석)도 보장되나요?",
    answer: "비뇨기질환(요로결석 등)을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
    category: "coverage",
  },
  {
    id: "faq-coverage-cat-dental",
    question: "고양이 치과도 보장되나요?",
    answer:
      "치석 제거 및 치아부정교합 등 치과 치료비용(치주질환으로 인한 비용 포함)을 특약으로 보상합니다.\n※ 구강내 질환 및 구강내 질환으로 인한 치과 치료비용은 보상하지 않습니다. (예: 잇몸염증이 악화되어 발치 등. 구강질환과 치과 치료의 교집합 영역)",
    category: "coverage",
  },
  {
    id: "faq-deductible",
    question: "자기부담금은 얼마인가요?",
    answer: "3만원입니다.",
    category: "coverage",
  },

  // ════════════════════════════════════════════════════
  // D. 보험료 · 갱신 · 계약관리
  // ════════════════════════════════════════════════════

  // 보험료 · 납부
  {
    id: "faq-renewal-premium-change",
    question: "1년 후 갱신시 보험료가 달라지나요?",
    answer: "연령, 손해율에 따라 보험료가 달라지거나 인상될 수 있습니다.",
    category: "premium",
  },
  {
    id: "faq-yearly-premium",
    question: "보험료 납부는 연납만 가능한가요?",
    answer:
      "현재 보험료 납부는 카드, 계좌이체 등으로 연납만 가능하며 12개월까지 할부가 가능합니다.\n최대 5개월까지 무이자 할부가 가능합니다. (우리카드는 6개월)",
    category: "premium",
  },
  {
    id: "faq-discount",
    question: "할인이나 혜택은 없나요?",
    answer: "이마트 몰리스가 좋은 조건으로 단체계약하는 상품이라 따로 할인 등은 없습니다.",
    category: "premium",
  },
  {
    id: "faq-senior-dog-premium",
    question: "고령견 가입시 보험료가 너무 비싸요.",
    answer: "이 경우 다른 상품도 비교해 보시고 가입조건 등과 보험료를 확인해 보시면 좋을 것 같습니다.",
    category: "premium",
  },

  // 갱신
  {
    id: "faq-renewal-waiting-period",
    question: "갱신 계약할 때도 대기기간(면책기간)이 적용되나요?",
    answer: "갱신 계약일 때는 면책기간 없이 바로 보장됩니다.",
    category: "premium",
  },
  {
    id: "faq-renewal-max-age",
    question: "얼마나/언제까지 갱신이 가능하죠?",
    answer: "최대 20세 까지 갱신 가능합니다.",
    category: "premium",
  },

  // 계약관리 · 증권
  {
    id: "faq-unknown-breed-age",
    question: "반려동물의 정확한 품종이나 나이를 모를 때는 어떻게 하나요?",
    answer: "동물병원에서 수의사 선생님의 비문 등의 확인으로 추정할 수 있습니다.",
    category: "premium",
  },
  {
    id: "faq-policy-document",
    question: "가입 완료 후 보험증권은 어떻게 받을 수 있나요?",
    answer: "가입시 가입증명서가 발송됩니다.",
    category: "premium",
  },
  {
    id: "faq-refund",
    question: "해약환급금 및 만기환급금은 어떻게 되나요?",
    answer:
      "만기환급금은 없으며, 해약시 보험사가 제반비용 계산 후 일할계산하여 돌려드립니다.\n보험계약 대출제도는 없습니다.",
    category: "premium",
  },

  // ════════════════════════════════════════════════════
  // E. 진료 · 치료 관련
  // ════════════════════════════════════════════════════
  {
    id: "faq-mri-ct",
    question: "MRI, CT 등 검사도 가능한가요?",
    answer: "예방 목적이 아닌 치료상 필요한 경우에 가능합니다.",
    category: "treatment",
  },

  // ════════════════════════════════════════════════════
  // F. 상품 · 운영 안내
  // ════════════════════════════════════════════════════

  // 상품 설계 · 운영
  {
    id: "faq-product-design",
    question: "올라 펫보험은 어떻게 설계되어 있나요?",
    answer:
      "올라는 몰리스가 복잡하지 않게 특약을 포함해 핵심보장을 균형있게 설계한 상품이라 단일 상품이며, 품종 및 나이 등에 따라 보험료가 산출됩니다.",
    category: "product",
  },
  {
    id: "faq-emart-discontinue",
    question: "이마트 몰리스가 이 보험을 없애면 어떻게 되나요?",
    answer:
      "이마트가 계약자로 하고 고객을 피보험자로 하는 단체계약이며, 올라 상품이 없어질 경우 DB손해보험과의 계약으로 전환됩니다.",
    category: "product",
  },
  {
    id: "faq-terms-request",
    question: "약관은 따로 없나요? 더 구체적으로 알고 싶어요.",
    answer: "가입 고객에게 약관을 보내드립니다. (1522-5179로 요청 및 상담 가능)",
    category: "product",
    widgets: ["contact-buttons"],
  },

  // 상담 · 분쟁조정
  {
    id: "faq-dispute-resolution",
    question: "상담 및 분쟁조정이 필요한 경우 어떻게 하나요?",
    answer:
      "www.dbins.com 고객센터에서 전자민원을 접수할 수 있습니다.\n1588-0100에서도 접수 가능합니다.",
    category: "product",
  },
];