// FAQ 질문/답변 데이터
// answer는 줄바꿈을 그대로 살려서 보여줄 것이므로 원문 줄바꿈을 유지한다.
// category는 화면에서 묶어서 보여줄 때 쓰는 분류 id (faqCategories 참고)
// widget은 답변을 텍스트가 아니라 '인터랙티브 컴포넌트'로 보여주고 싶을 때만 채운다.
//   - widget이 없으면: 기존처럼 answer 텍스트만 보여줌 (기존 항목 전부 그대로 동작)
//   - widget이 있으면: answer 아래(또는 대신)에 해당 위젯 컴포넌트를 렌더링

export type FaqCategoryId = "join" | "screening" | "coverage" | "premium";

export interface FaqCategoryInfo {
  id: FaqCategoryId;
  label: string;
}

// 화면에 보여줄 순서 그대로
export const faqCategories: FaqCategoryInfo[] = [
  { id: "join", label: "가입·이용 안내" },
  { id: "screening", label: "가입 조건·심사" },
  { id: "coverage", label: "보장 안내" },
  { id: "premium", label: "보험료·갱신" },
];

// 위젯 종류를 정의하는 id. 새 위젯을 추가할 때마다 여기에 한 줄씩 추가.
export type FaqWidgetId =
  | "dog-age-calculator"
  | "premium-estimator"
  | "contact-buttons"
  | "flyer-images"
  | "claim-contact-buttons";

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: FaqCategoryId;
  // 선택적 필드라서 기존 항목들은 수정할 필요 없음 (그냥 undefined로 남음)
  widget?: FaqWidgetId;
}

export const faqEntries: FaqEntry[] = [
  // 가입·이용 안내: 나이, 가입 경로(매장/전단/QR), 청구방법, 보장 개시일처럼
  // "가입을 어떻게 하고 그 이후엔 어떻게 이용하는지"에 대한 묶음
  {
    id: "faq-min-age",
    question: "몇 살부터 가입 가능한가요?",
    answer: "생후 60일 부터 가입 가능합니다.\n※ 61일이 지난 시점 가입 가능",
    category: "join",
    // 예시: 이 질문에는 "내 강아지 생일 넣어서 지금 가입 가능한지" 계산기를 붙임
    widget: "dog-age-calculator",
  },
  {
    id: "faq-max-age",
    question: "몇 살까지 가입 가능한가요?",
    answer:
      "12세까지 가입가능합니다.\n※2013년 아이의 생일 전날까지 가능합니다.",
    category: "join",
    // 같은 위젯을 여기서도 재사용 (질문마다 같은 위젯 쓰는 경우의 예시)
    widget: "dog-age-calculator",
  },
  {
    id: "faq-no-store-visit",
    question: "매장방문이 어려운 사람들은 어떻게 가입이 가능할까요?",
    answer:
      "올라 CS 카카오톡 채널에서 확인하시거나,\n전화(1522-5179) 또는 이메일(csolapet@gmail.com)로 문의주시면 전단을 보내드립니다.",
    category: "join",
    widget: "contact-buttons",
  },
  {
    id: "faq-flyer-join",
    question: "전단에서 어떻게 가입이 가능한가요?",
    answer: "전단에 있는 QR을 이용해 가입 하실 수 있습니다.",
    category: "join",
    widget: "flyer-images",
  },
  {
    id: "faq-claim-method",
    question: "청구는 어떻게 할 수있나요?",
    answer:
      "청구는 아래 접수 방법을 통해 진행해 주시기 바랍니다.",
    category: "join",
    widget: "claim-contact-buttons",
  },
  {
    id: "faq-policy-start-date",
    question: "보험 개시일은 언제인가요?",
    answer: "입력하신 보험기간의 시작일(개시일)부터 보장이 시작되며, \n보험료 결제 완료 후 해당 보험기간 동안 보장을 받으실 수 있습니다.",
    category: "join",
  },
  {
    id: "faq-dog-injured",
    question: "강아지가 다쳤을때 어떻게 해야될까요?",
    answer: "테스트",
    category: "join",
  },

  // 가입 조건·심사: 다른보험, 진단서, 예방접종, 기존 질병/진료 이력처럼
  // "가입이 되는지 안 되는지를 가르는 조건" 묶음
  {
    id: "faq-other-insurance",
    question: "다른 보험이 있는 경우 가입이 가능한가요?",
    answer: "가입이 가능하지 않습니다. \n(수정필요- 비례 부분)",
    category: "screening",
  },
  {
    id: "faq-no-diagnosis-doc",
    question: "질병 진단서를 안넣고 가입이 가능한가요?",
    answer: "테스트",
    category: "screening",
  },
  {
    id: "faq-vaccination-required",
    question: "예방 접종을 맞아야 가입이 가능한가요?",
    answer:
      "네 맞습니다.\n[강아지] 피보바이러스감염증, 디스템퍼바이러스감염증, 파라인플루엔자감염증, 전염성간염, 아데노바이러스2형 감염증, 코로나바이러스감염증, 렙토스피라감염증, 필라리아감염증, 광견병\n[고양이] 고양이범백혈구감소증, 고양이칼리시바이러스감염증, 고양이바이러스성비기관지염 고양이백혈병바이러스감염증",
    category: "screening",
  },
  {
    id: "faq-pre-existing-condition-join",
    question: "슬개골/구강질환/피부질환이 있는 경우 가입이 불가능한가요?",
    answer: "네 과거 이력이 있는경우 가입이 제한 될 수 있습니다.",
    category: "screening",
  },
  {
    id: "faq-recent-visit",
    question: "동물병원에 최근 3개월 전에 다녀왔는데 가입이 불가능할까요?",
    answer:
      "네 안타깝게도 현재 질병 및 사고로 치료 또는 경과 관찰 중이거나 과거 3개월 이내에 동물병원에서 진료 받은 내역이 있다면 가입이 제한 될 수있습니다. \n※ 다만 예방 목적인 경우 해당하지 않음",
    category: "screening",
  },
  {
    id: "faq-one-accident",
    question: "한사고라는 건 무엇인가요?",
    answer: "하나의 질병. \n다만 90일 이후에는 이 질병으로 가입시 불가능",
    category: "screening",
  },
  {
    id: "faq-taking-medicine",
    question: "약을 먹고 있는경우 가입이 가능할까요?",
    answer: "테스트",
    category: "screening",
  },
  {
    id: "faq-vet-staff",
    question: "동물병원 종사자는 가입이 불가능 할까요?",
    answer: "테스트",
    category: "screening",
  },
  {
    id: "faq-unknown-birthdate",
    question: "강아지의 생년월일이 기억 나지 않아요 어떻게 해야 되나요?",
    answer: "테스트",
    category: "screening",
  },

  // 보장 안내: 무엇을 보장하고 어떻게 보상받는지에 대한 묶음
  {
    id: "faq-coverage-knee-oral-skin",
    question: "슬개골/구강질환/피부질환을 보장하나요?",
    answer: "네 치료목적인 경우 보장합니다.",
    category: "coverage",
  },
  {
    id: "faq-continuous-coverage",
    question: "강아지가 질병이 생겼을때 계속 보상해 주신다는 말인가요?",
    answer: "한사고에 해당해서는 최대 700만원, 연간 3000만원 까지 보상합니다.",
    category: "coverage",
  },
  {
    id: "faq-deductible",
    question: "자기부담금은 얼마인가요?",
    answer: "3만원입니다.",
    category: "coverage",
  },

  {
    id: "faq-strength",
    question: "강점이 먼가요?",
    answer: "테스트",
    category: "coverage",
  },

  // 보험료·갱신: 결제 방식, 보험료 구조, 갱신 관련 묶음
  {
    id: "faq-card-installment",
    question: "카드 할부 가능한가요?",
    answer: "네 카드 할부가능합니다.\n※카드 사별 무이자는 상이",
    category: "premium",
  },
  {
    id: "faq-yearly-premium",
    question: "보험료는 1년단위 밖에 안되나요?",
    answer:
      "네 맞습니다. 현재 분납 가능하시구요. 월납이 가능하지 않으나\n최대12개월 할부가가능하구요 무이자는 5개월까지 가능합니다.",
    category: "premium",
    // 예시: 다른 종류의 위젯 (월 납입액 계산기)
    widget: "premium-estimator",
  },
  {
    id: "faq-renewal-estimate",
    question: "갱신 예상 금액은 얼마인가요?",
    answer: "테스트",
    category: "premium",
  },
  {
    id: "faq-renewal-max-age",
    question: "얼마나/언제까지 갱신이 가능하죠?",
    answer: "최대 20세 까지 갱신 가능합니다.",
    category: "premium",
  },
];