// FAQ 질문/답변 데이터
// answer는 줄바꿈을 그대로 살려서 보여줄 것이므로 원문 줄바꿈을 유지한다.
// category는 화면에서 묶어서 보여줄 때 쓰는 분류 id (faqCategories 참고)
// subgroup은 카테고리 안에서 한 번 더 묶는 소분류 id (faqSubgroups 참고)
// widgets는 답변을 텍스트가 아니라 '인터랙티브 컴포넌트'로 보여주고 싶을 때만 채운다.
//   - widgets가 없으면: 기존처럼 answer 텍스트만 보여줌
//   - widgets가 있으면: answer 아래에 해당 위젯 컴포넌트들을 순서대로 렌더링
//
// 분류는 "올라펫보험_QnA_분류_통합본" 문서의 대분류/소분류 체계를 그대로 따른다.
// (2026-06-19 업데이트: 사용자가 새로 정리한 통합본 기준으로 전면 교체.
//  내용/문구는 원문 그대로 유지, 문서의 일련번호는 사용하지 않음.
//  category id는 문서의 분류 코드를 그대로 쓰지 않고 의미가 드러나는 영문 슬러그로 부여함.
//
//  2026-06-19 추가 업데이트: subgroup을 각 항목에 라벨 문자열을 직접 적던 방식에서
//  faqCategories와 동일한 패턴으로 분리했다. 각 항목은 subgroup에 id만 적고,
//  실제 코드(A-1 등)와 라벨은 아래 faqSubgroups 배열 한 곳에서만 관리한다.
//  소분류 코드/이름이 바뀌어도 faqSubgroups만 고치면 되고, 150개 항목을 일일이
//  수정할 필요가 없다.)

export type FaqCategoryId =
    "contract"
  | "premium"
  | "coverage"
  | "exclusion"
  | "claim"
  | "payout"
  | "renewal"
  | "dispute"
  | "registration"
  | "general";

export interface FaqCategoryInfo {
  id: FaqCategoryId;
  label: string;
}

// 화면에 보여줄 순서 그대로
export const faqCategories: FaqCategoryInfo[] = [
  { id: "contract", label: "A.가입·계약" },
  { id: "premium", label: "B.보험료" },
  { id: "coverage", label: "C.보장 범위" },
  { id: "payout", label: "D.보상 금액·지급" },
  { id: "claim", label: "E.보험금 청구" },

    { id: "exclusion", label: "F.면책·제외" },
  { id: "renewal", label: "G.갱신·해지·계약 변경" },
  { id: "dispute", label: "H.불만·분쟁·민원" },
  { id: "registration", label: "I.반려동물 등록·신원 확인" },
  { id: "general", label: "J.기타·일반" },
];

// 소분류(예: "A-1. 가입 자격·대상") id 전체 목록.
// 새 소분류를 추가할 때마다 여기에 한 줄씩 추가.
export type FaqSubgroupId =
    "contract-strength"
  | "contract-eligibility"
  | "contract-process"
  | "contract-waiting"
  | "contract-withdrawal"
  | "premium-level"
  | "premium-payment"
  | "premium-change"
  | "coverage-basic"
  | "coverage-specific"
  | "coverage-excluded"
  | "payout-limit"
  | "payout-method"
  | "payout-denial"
  | "claim-timing"
  | "claim-method"
  | "claim-documents"
  | "claim-review"
  | "exclusion-period"
  | "exclusion-congenital"
  | "exclusion-preexisting"
  | "exclusion-other"
  | "renewal-renew"
  | "renewal-change"
  | "renewal-cancel";

export interface FaqSubgroupInfo {
  id: FaqSubgroupId;
  category: FaqCategoryId; // 어느 대분류에 속하는지
  code: string; // 원본 문서의 소분류 코드 (예: "A-1")
  label: string; // 코드 없이 순수 이름만 (예: "가입 자격·대상")
}



// faqCategories와 같은 패턴: 화면에 보여줄 순서 그대로, 코드/이름을 여기 한 곳에서만 관리.
// 화면에 보여줄 전체 문구(예: "A-1. 가입 자격·대상")가 필요하면
// `${code}. ${label}` 형태로 조합해서 쓰면 된다.
export const faqSubgroups: FaqSubgroupInfo[] = [
  { id: "contract-strength", category: "contract", code: "A-0", label: "특장점 및 단일 상품" },
  { id: "contract-eligibility", category: "contract", code: "A-1", label: "가입 자격·대상" },
  { id: "contract-process", category: "contract", code: "A-2", label: "가입 방법·절차" },
  { id: "contract-waiting", category: "contract", code: "A-3", label: "보장 개시·대기기간" },
  { id: "contract-withdrawal", category: "contract", code: "A-4", label: "계약 취소·청약 철회" },
  { id: "premium-level", category: "premium", code: "B-1", label: "보험료 수준·결정 요인" },
  { id: "premium-payment", category: "premium", code: "B-2", label: "납입 방법·주기" },
  { id: "premium-change", category: "premium", code: "B-3", label: "보험료 변동" },
  { id: "coverage-basic", category: "coverage", code: "C-1", label: "기본 보장" },
  { id: "coverage-specific", category: "coverage", code: "C-2", label: "특정 질환·상황" },
  { id: "coverage-excluded", category: "coverage", code: "C-3", label: "보장 제외 항목" },
  { id: "payout-limit", category: "payout", code: "D-1", label: "보상 한도·구조" },
  { id: "payout-method", category: "payout", code: "D-2", label: "지급 방식·지연" },
  { id: "payout-denial", category: "payout", code: "D-3", label: "보험금 지급 거절" },
  { id: "claim-timing", category: "claim", code: "E-1", label: "청구 시기·조건" },
  { id: "claim-method", category: "claim", code: "E-2", label: "청구 방법·채널" },
  { id: "claim-documents", category: "claim", code: "E-3", label: "청구 서류" },
  { id: "claim-review", category: "claim", code: "E-4", label: "청구 심사·처리" },
  { id: "exclusion-period", category: "exclusion", code: "F-1", label: "면책기간" },
  { id: "exclusion-congenital", category: "exclusion", code: "F-2", label: "선천성·유전성 질환" },
  { id: "exclusion-preexisting", category: "exclusion", code: "F-3", label: "기존 질병·고지 의무" },
  { id: "exclusion-other", category: "exclusion", code: "F-4", label: "기타 면책 사유" },
  { id: "renewal-renew", category: "renewal", code: "G-1", label: "갱신" },
  { id: "renewal-change", category: "renewal", code: "G-2", label: "계약 변경" },
  { id: "renewal-cancel", category: "renewal", code: "G-3", label: "해지·환급" },
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
  subgroup?: FaqSubgroupId;
  widgets?: FaqWidgetId[];
}

export const faqEntries: FaqEntry[] = [

  // ════════════════════════════════════════════════════
  // 가입·계약
  // ════════════════════════════════════════════════════
  // 특장점 및 단일 상품
  {
    id: "faq-contract-01",
    question: "올라펫보험이 다른 보험과 다른 특장점이 뭔가요?",
    answer: "가장 큰 장점은 질병과 상해로 인한 입원,통원,수술 치료비를 횟수제한없이 사고당 7백만원 한도 내 연간 최대 3천만원 한도내에서 보장하는 점이예요. 또 피부,구강질환, 치료비 부담이 높은 슬개골,고관절 관련 질환까지 확장보장 해요. 반려동물로 인한 배상책임도 대인,대동물 3천만원 한도내에서 보상합니다. 복잡한 특약을 포함하고 핵심보장을 균형있게 설계한 보험입니다.",
    category: "contract",
    subgroup: "contract-strength",
  },
  {
    id: "faq-contract-02",
    question: "일반 DB손해보험의 펫보험과 다른 점이 뭔가요?",
    answer: "올라는 이마트가 계약자로 DB손해보험과 계약하는 단체보험에 고객을 피보험자로 가입시키는 방식입니다. 쉽게 말하자면 좋은 조건으로 공동구매하는 것이죠. 복잡한 특약을 포함시켰고 핵심보장을 균형있게 설계한 보험입니다.",
    category: "contract",
    subgroup: "contract-strength",
  },
  {
    id: "faq-contract-03",
    question: "올라 펫보험 설계 해주세요.",
    answer: "올라는 몰리스가 복잡하지 않게 특약을 포함해 핵심보장을 균형있게 설계한 상품이라 단일 상품이고 품종 및 나이 등에 따라 보험료가 산출됩니다.",
    category: "contract",
    subgroup: "contract-strength",
  },
  // 가입 자격·대상
  {
    id: "faq-contract-04",
    question: "(나이)최소 몇 살부터 가능한가요?",
    answer: "생후 60일 이후부터 가능합니다. (61일)",
    category: "contract",
    subgroup: "contract-eligibility",
    widgets: ["dog-age-calculator"],
  },
  {
    id: "faq-contract-05",
    question: "(나이)최대 몇 살까지 가능한가요?",
    answer: "12세까지 가능합니다. (26년도 기준 2013년 생일이 지나지 않았다면 가능) 갱신시 20세까지 보장됩니다. (즉 12세 때 가입해야 20세까지 보장된다는 의미)",
    category: "contract",
    subgroup: "contract-eligibility",
    widgets: ["dog-age-calculator"],
  },
  // 가입 방법·절차
  {
    id: "faq-contract-06",
    question: "가입을 어떻게 하나요?",
    answer: "몰리스 매장이나 고객센터 1522-5179를 통해 가입 안내문에 들어 있는 큐알코드를 카메라로 촬영하시면 가입화면이 나옵니다. 가까운 몰리스 매장이 없는 경우 1522-5179 고객센터에 요청하시면 됩니다. 카카오톡 올라 검색후 올라펫 채널을 통해서도 확인 가능합니다.",
    category: "contract",
    subgroup: "contract-process",
    widgets: ["contact-buttons", "flyer-images"],
  },
  {
    id: "faq-contract-07",
    question: "가입자의 계약 전 알릴 사항",
    answer: "피보험자는 보험계약 청약시 가입조건 질문등에 꼼꼼이 답변하시면 됩니다.",
    category: "contract",
    subgroup: "contract-process",
  },
  {
    id: "faq-contract-08",
    question: "가입자의 계약 후 변동 사항",
    answer: "기재사항을 변경하고자 할 때 또는 변경이 생겼음을 알 때",
    category: "contract",
    subgroup: "contract-process",
  },
  {
    id: "faq-contract-09",
    question: "반려동물을 양도할 때",
    answer: "위험이 변경되거나 변경되었음을 알았을 때",
    category: "contract",
    subgroup: "contract-process",
  },
  // 보장 개시·대기기간
  {
    id: "faq-contract-10",
    question: "이미 아픈 상태인데 가입이 가능한가요?",
    answer: "계약을 맺을 때 보험사고가 이미 발생한 경우 계약은 무효예요. 또한 최초계약의 보험개시일 이전에 이미 감염 또는 발병한 질병·상해는 보상하지 않아요. (이 경우 3개월이내 진찰받은 이력이 있으면 3개월 이후 가입하면 됨. 단 만성질환으로 약을 복용중이면 가입이 어려움. 가입 후 슬개골 고관절 90일, 다른 질병은 대기기간 30일)",
    category: "contract",
    subgroup: "contract-waiting",
  },
  {
    id: "faq-contract-11",
    question: "가입 후 언제부터 보장이 되나요?",
    answer: "보험료를 납부하고 가입증명서를 받으셨다면 가입하신 보험기간 1년 동안 보장이 됩니다. 상해(사고)는 즉시, 질병은 30일, 슬고관절 관련은 90일 대기기간 (면책기간)이 있습니다. (슬고관절은 보통 6개월 혹은 1년 대기기간이 있으나 올라는 90일로 고객에게 유리)",
    category: "contract",
    subgroup: "contract-waiting",
  },
  {
    id: "faq-contract-12",
    question: "동물병원에 최근 3개월이내 다녀왔는데 가입이 가능한가요?",
    answer: "마지막 진료를 받은 날부터 3개월이 지났으면 가입이 가능합니다. 예방목적이나 건강검사 등 으로 방문한 경우는 해당하지 않습니다.",
    category: "contract",
    subgroup: "contract-waiting",
  },
  {
    id: "faq-contract-13",
    question: "갱신 계약할때도 대기기간 (면책기간)이 적용되나요?",
    answer: "갱신 계약일때는 면책기간 없이 바로 보장됩니다.",
    category: "contract",
    subgroup: "contract-waiting",
  },
  {
    id: "faq-contract-14",
    question: "가입 당일 사고가 나도 보장이 되나요?",
    answer: "네. 상해(사고)는 보험개시일부터 보장돼요. 단, 보험기간 시작 전 사고는 보장되지 않아요.",
    category: "contract",
    subgroup: "contract-waiting",
  },
  {
    id: "faq-contract-15",
    question: "치과질환, 구강질환, 피부병 질환 등 특약의 대기기간은?",
    answer: "면책기간(대기기간)은 30일 이예요.",
    category: "contract",
    subgroup: "contract-waiting",
  },
  // 계약 취소·청약 철회
  {
    id: "faq-contract-16",
    question: "가입 후 마음이 바뀌었는데 취소할 수 있나요?",
    answer: "보험증권을 받은 날부터 15일 이내에 청약 철회가 가능해요. 또한 약관·청약서 미교부, 중요 내용 미설명, 자필서명 미이행 시에는계약 성립일부터 3개월 이내에 계약 취소가 가능해요.",
    category: "contract",
    subgroup: "contract-withdrawal",
  },
  {
    id: "faq-contract-17",
    question: "청약 철회 기간은 얼마나 되나요?",
    answer: "보험증권을 받은 날부터 15일 이내이며, 청약일부터 30일을 초과한 계약은 철회 불가해요.",
    category: "contract",
    subgroup: "contract-withdrawal",
  },
  {
    id: "faq-contract-18",
    question: "철회 시 보험료는 전액 돌려받을 수 있나요?",
    answer: "청약 철회 시 접수일부터 3영업일 이내에 납입한 보험료 전액을 돌려받을 수 있어요. 카드 결제는 취소 처리됩니다.",
    category: "contract",
    subgroup: "contract-withdrawal",
  },
  {
    id: "faq-contract-19",
    question: "보험증권을 받기 전에도 철회할 수 있나요?",
    answer: "철회 기간 기산점이 가입증명서 혹은 보험증권을 받은 날이기 때문에, 증권 수령 전에는 철회 기간이 시작되지 않아요. 다만 청약일부터 30일을 초과하면 철회 불가예요.",
    category: "contract",
    subgroup: "contract-withdrawal",
  },
  {
    id: "faq-contract-20",
    question: "철회 기간이 지난 경우에 계약을 취소할 수 있는 방법이 있나요?",
    answer: "약관 미교부, 중요 내용 미설명, 자필서명 미이행이 있었다면 계약 성립일부터 3개월 이내에 취소 가능해요. (올라는 단체보험이라 약관은 고객센터에 요청해서 받을 수 있어요.) 또한 금융소비자보호법 위반이 있는 경우 계약체결일부터 5년, 위반사실을 안 날부터 1년 이내에위법계약 해지 요구가 가능해요.",
    category: "contract",
    subgroup: "contract-withdrawal",
  },

  // ════════════════════════════════════════════════════
  // 보험료
  // ════════════════════════════════════════════════════
  // 보험료 수준·결정 요인
  {
    id: "faq-premium-01",
    question: "고령견 가입시 너무 보험료가 비싸요?",
    answer: "이 경우 다른 상품도 비교해 보시고 가입조건 등과 보험료를 확인해 보시면 좋을 것 같습니다.",
    category: "premium",
    subgroup: "premium-level",
  },
  {
    id: "faq-premium-02",
    question: "보험료는 어떻게 결정되나요?",
    answer: "나이, 품종, 체중, 등이 반영돼요.",
    category: "premium",
    subgroup: "premium-level",
  },
  {
    id: "faq-premium-03",
    question: "소형견·중형견·대형견 보험료 차이가 얼마나 나나요?",
    answer: "",
    category: "premium",
    subgroup: "premium-level",
  },
  {
    id: "faq-premium-04",
    question: "강아지와 고양이 보험료가 다른가요?",
    answer: "",
    category: "premium",
    subgroup: "premium-level",
  },
  {
    id: "faq-premium-05",
    question: "나이가 많을수록 보험료가 비싼가요?",
    answer: "네",
    category: "premium",
    subgroup: "premium-level",
  },
  // 납입 방법·주기
  {
    id: "faq-premium-06",
    question: "보험료 납부는 연납만 가능한가요?",
    answer: "현재 보험료 납부는 카드, 계좌이체 등으로 연납만 가능하며 12개월까지 할부가 가능합니다. 최대 5개월까지 무이자 할부가 가능합니다. (우리 카드는 6개월)",
    category: "premium",
    subgroup: "premium-payment",
  },
  // 보험료 변동
  {
    id: "faq-premium-07",
    question: "1년 후 갱신시 보험료가 달라지나요?",
    answer: "연령,품종에 따라 보험료가 달라지거나 인상될 수 있습니다(청구를 많이 했다고 인상 되는 것은 아님)",
    category: "premium",
    subgroup: "premium-change",
  },
  {
    id: "faq-premium-08",
    question: "갱신할 때마다 보험료가 오른다는데, 얼마나 오르나요?",
    answer: "나이, 손해율 등에 따라 보험료가 오를 수 있습니다.",
    category: "premium",
    subgroup: "premium-change",
  },

  // ════════════════════════════════════════════════════
  // 보장 범위
  // ════════════════════════════════════════════════════
  // 기본 보장
  {
    id: "faq-coverage-01",
    question: "특약은 따로 가입하나요? 특약이 뭐예요?",
    answer: "보장담보(특약)은 포함되어 있으며 상해 및 질병치료비 (피부병, 구강질환, 슬고관절 탈구) 보장 반려동물 배상책임 (대인,대동물) 반려동물 사망시 위로금을 지급합니다.",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-02",
    question: "배상책임은 뭔가요?",
    answer: "반려동물의 행위에 기인하는 우연한 사고로 타인의 신체 및 타인 소유의 반려동물에 손해를 입혀 배상책임을 부담함으로써 입은 손해를 3천만원 한도 내에서 보상합니다. (자기 부담금 3만원 차감) 단 세대를 같이 하는 친족인 경우 배상책임하지 않습니다. 소음,냄새, 털날림 등으로 인한 손해, 전염병으로 인한 손해 등도 배상책임하지 않습니다.",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-03",
    question: "상해란 무엇인가요?",
    answer: "보험기간 중에 발생한 급격하고도 우연한 외래의 사고로 반려동물이 입은 상해를 말하며, 유독 가스 또는 유독 물질을 반려동물이 우연히 일시적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상을 포함합니다. (그러나 음식물 섭취로 인한 증상, 세균성 음식물 중독과 상습적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상은 포함되지 않습니다. 이물섭식, 음식물이 아닌 것을 흡입,흡수한 결과로 생긴 상해는 보상합니다.)",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-04",
    question: "마취비, 처치비, 주사비 같은 항목도 보장되나요?",
    answer: "치료를 직접적인 목적으로 발생한 비용이면 보장돼요",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-05",
    question: "처방 약값도 보장되나요?",
    answer: "수의사가 처방하는 의약품은 보장 가능해요. 단, 건강보조식품, 한방약,의약부외품 등은 제외예요.",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-06",
    question: "MRI·CT·초음파·혈액검사 같은 검사비도 보장되나요?",
    answer: "치료를 직접적인 목적으로 실시한 검사비는보장돼요. 단, 정기검진, 예방적 검사를 위한 비용은 제외예요",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-07",
    question: "응급 치료비·야간 진료비도 보장되나요?",
    answer: "치료를 직접 목적으로 한 비용이면 보장 가능해요. 단,왕진료 및 이송비는 제외예요.",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-08",
    question: "어떤 동물병원에서 치료를 받아도 보장이 되나요?수의사법 시행령 제13조에 따른 동물",
    answer: "병원 또는 동물관련법에서 정한 동물의료기관이어야 해요",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  {
    id: "faq-coverage-add1",
    question: "치료를 받던 중 보험기간이 만료됐어요.",
    answer: "만료된 경우에도 만료일로부터 180일 이내 치료비는 보상합니다. 단 사고일 또는 발병일로부터 365일 이내의 치료인 경우엔 한합니다. (가입기간 1년)",
    category: "coverage",
    subgroup: "coverage-basic",
  },
  // 특정 질환·상황
  {
    id: "faq-coverage-09",
    question: "만성질환도 보장하나요?",
    answer: "지속된 질환으로 병원에 다니는 만성질환의 경우 보험가입 기간 내 발생한 경우 보상됩니다. 하나의 사고 질병등으로 인하여 2회 이상 치료하는 경우에도 이를 하나의 사고로 간주하여 보상하여 드립니다. (자부담금 1회 3만원, 합병증 및 수의학상 서로 중요한 관련이 있는 경우는 동일 사고로 간주) 최종 치료일에서 90일이 경과하여 개시되는 사고는 새로운 사고로 간주합니다. (자부담금 3만원 발생)",
    category: "coverage",
    subgroup: "coverage-specific",
  },
  {
    id: "faq-coverage-10",
    question: "피부병",
    answer: "피부병(외이염, 중이염, 피부알러지, 피부트러블을 포함)을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
    category: "coverage",
    subgroup: "coverage-specific",
  },
  {
    id: "faq-coverage-11",
    question: "구강질환",
    answer: "구강내 질환을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
    category: "coverage",
    subgroup: "coverage-specific",
  },
  {
    id: "faq-coverage-12",
    question: "치과질환",
    answer: "치석 제거 및 치아부정교합, 치주질환 등 치과 치료비용, 구강내 질환을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다. *치과 치료 항목 중 구강내 질환 및 구강내 질환으로 인한 치과 치료비용은 보상하지 않습니다. (예 잇몸염증이 악화되어 발치 등 구강질환과 치과 치료의 교집합 영역)",
    category: "coverage",
    subgroup: "coverage-specific",
  },
  {
    id: "faq-coverage-13",
    question: "개 슬관절, 고관절",
    answer: "슬관 절 탈구, 슬관절 형성부전, 기타 이들과 유사한 질병 또는 상해를 원인으로 하여 생긴 반려동물의 치료비를 반려동물 치료비를 특약으로 보상합니다. 슬관절 탈구, 고관절 탈구, 슬관절 형성부전, 고관절 형성부전 또는 기타 이들과 유사한 질병 또는 상해를 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
    category: "coverage",
    subgroup: "coverage-specific",
  },
  {
    id: "faq-coverage-14",
    question: "고양이 비뇨기질환 요로결석",
    answer: "비뇨기질환(요로결석 등)을 원인으로 하여 생긴 반려동물의 치료비를 특약으로 보상합니다.",
    category: "coverage",
    subgroup: "coverage-specific",
  },
  {
    id: "faq-coverage-15",
    question: "고양이 치과",
    answer: "치석 제거 및 치아부정교합, 등 치과 치료비용(치주질환으로 인한 비용 포함)을 특약으로 보상합니다. *구강내 질환 및 구강내 질환으로 인한 치과 치료비용은 보상하지 않습니다. (예 잇몸염증이 악화되어 발치 등. 구강질환과 치과 치료의 교집합 영역)",
    category: "coverage",
    subgroup: "coverage-specific",
  },
  {
    id: "faq-coverage-16",
    question: "수술은 모든 종류의 수술이 보장되나요?",
    answer: "면책 항목에 해당하지 않는 수술이라면 보장돼요. 중성화 수술, 임신, 미용 목적 수술, 건강동물에 실시하는 외과수술 등은 제외예요 (가입안내문 보상하지 않는 손해 리스트 혹은 치료비 특별약관 제3조 ①-13호, 가입 안내문 보상하지 않는 손해 참조)",
    category: "coverage",
    subgroup: "coverage-excluded",
  },
  {
    id: "faq-coverage-17",
    question: "해외 동물병원에서 치료를 받으면 보장이 안 되나요?",
    answer: "대한민국 이외의 지역에서 발생한 사고 및 손해는 보상하지 않아요",
    category: "coverage",
    subgroup: "coverage-excluded",
  },
  {
    id: "faq-exclusion-18",
    question: "보상하지 않는 손해",
    answer: "(기본)예방이나 검진 등의 목적, 미용의 목적, 출산관련 등이 보상하지 않습니다. 손톱절제, 유치잔존, 잠복고환, 제대헤르낭(배꼽부위 탈장), 항문낭 제거 등 건강동물에 실시하는 외과수술 및 기타검사, 점안, 귀청소 등의 관리비용. *가입 안내문 보상하지 않는 손해 참조 *약관 28페이지 제3조1항 보상하지 않는 손해 리스트 참조 단 3조 2항 3항의 피부병,구강질환,치과, 슬관절 등은 추가 기재된 특약으로 보장됨.",
    category: "coverage",
    subgroup: "coverage-excluded",
  },

  // ════════════════════════════════════════════════════
  // 보상 금액·지급
  // ════════════════════════════════════════════════════
  // 보상 한도·구조
  {
    id: "faq-payout-01",
    question: "통원과 입원의 보장 방식이 다른가요?",
    answer: "약관상 통원·입원을 별도 한도로 구분하지 않아요. 모두 1사고당 보상한도액 7백만원 기준으로 횟수제한 없이 적용돼요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-02",
    question: "입원 기간 동안 매일 보장받을 수 있나요?",
    answer: "한 사고당 보상한도 7백만원 범위 내에서 보장돼요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-03",
    question: "보상한도액이 어떤 식으로 적용되나요?",
    answer: "1사고당 보상한도액 범위 내에서 자기부담금을 초과한금액에 보상비율을 곱해 지급해요. 1사고당700만원, 보상비율 70%, 자기부담금 3만원이에요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-04",
    question: "사고당 한도와 연간 한도 중 어느 게 먼저 적용되나요?",
    answer: "1사고당 한도가 먼저 적용되고, 보험기간중 총 보상한도액(3,000만원)이 연간 상한으로 적용돼요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-05",
    question: "통원, 입원, 수술에 각각 별도 한도가 있나요?",
    answer: "별도 구분 없이 1사고당 총 한도700만원이 적용돼요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-06",
    question: "보상비율 70%라고 하면, 나머지 30%는 제가 부담하는 건가요?",
    answer: "맞아요. 진료비에서 자기부담금3만원을 뺀 금액의 70%를 보험사가 지급하고, 나머지 30%는 고객이 부담해요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-07",
    question: "자기부담금이란 정확히 무엇인가요?",
    answer: "보험사고로 발생한 손해에 대해 계약자 또는 피보험자가 부담하는 일정 금액이에요. 이 계약에서는 1사고당 3만원이예요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-08",
    question: "자기부담금은 얼마인가요?",
    answer: "치료비 담보: 1사고당 30,000원, 배상책임 담보: 1사고당 30,000원이예요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-09",
    question: "치료비가 자기부담금보다 적을 때도 보험금을 받을 수 있나요?",
    answer: "치료비가 3만원 이하면 보험금이발생하지 않아요. 자기부담금을 초과한 부분에 대해서만 보상해요",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-10",
    question: "같은 질병으로 여러 번 치료받으면 한도가 합산되나요?",
    answer: "동일 사고로 인한 치료는 하나의 사고로보아 1사고당 한도 7백만원 내에서 합산 보상돼요. 단, 최종 치료일로부터 90일이상 경과 후 시작되는 치료는 새로운 사고로 보아 한도가 리셋돼요.자기부담금이 발생해요.",
    category: "payout",
    subgroup: "payout-limit",
  },
  {
    id: "faq-payout-11",
    question: "보험기간이 끝나기 직전에 아프기 시작했는데 만기 이후 치료비도 보장되나요?",
    answer: "보험기간 만료 전발생한 사고로 치료를 받다가 보험기간이 만료된 경우, 만료일부터 180일 이내의 치료비는 보상해요. 단 사고일 또는 발병일부터 365일 이내 치료에 한해요",
    category: "payout",
    subgroup: "payout-limit",
  },
  // 지급 방식·지연
  {
    id: "faq-payout-12",
    question: "보험금 청구 후 언제 지급되나요?",
    answer: "지체없이 처리되며 지급심사시 최대 7일까지 소요될 수 있습니다.",
    category: "payout",
    subgroup: "payout-method",
  },
  {
    id: "faq-payout-13",
    question: "보험금은 어느 계좌로 받을 수 있나요?",
    answer: "(청구 시 지정 계약자 본인의 계좌 등록)",
    category: "payout",
    subgroup: "payout-method",
  },
  {
    id: "faq-payout-14",
    question: "계좌 정보를 변경하려면 어떻게 해야 하나요?",
    answer: "",
    category: "payout",
    subgroup: "payout-method",
  },
  {
    id: "faq-payout-15",
    question: "보험금이 예정일보다 늦게 지급되면 이자가 붙나요?",
    answer: "네. 지급기일 초과 시 기간별로 가산이율이적용돼요",
    category: "payout",
    subgroup: "payout-method",
  },
  {
    id: "faq-payout-16",
    question: "보험금 가지급 제도가 있다고 하는데 어떻게 신청하나요?",
    answer: "지급할 보험금이 결정되기 전에 피보험자의 청구가 있으면 회사가 추정한 보험금의 50% 상당액을 가지급보험금으로 지급해요.",
    category: "payout",
    subgroup: "payout-method",
  },
  {
    id: "faq-payout-17",
    question: "중복 보험에 가입한 경우 보험금을 두 곳에서 다 받을 수 있나요?",
    answer: "실손 보상이므로 중복해서 받을 수 없어요. 각 보험사의 보상책임액 비율에 따라 나눠 지급해요",
    category: "payout",
    subgroup: "payout-method",
  },
  {
    id: "faq-payout-18",
    question: "중복 보험인 경우 어떤 기준으로 나눠서 지급하나요?",
    answer: "각 계약의 보상책임액을 각각 산출한 후,그 합계액이 실제 손해액을 초과하면 각 계약의 보상책임액 비율에 따라 배분해요",
    category: "payout",
    subgroup: "payout-method",
  },
  // 보험금 지급 거절
  {
    id: "faq-payout-19",
    question: "과잉진료로 판단되면 보장을 안 해준다는 게 어떤 기준인가요?",
    answer: "과잉진료행위로 인한 비용은 보상하지 않아요. 지급 심사팀에서 추가 서류를 요청할 수 있습니다.",
    category: "payout",
    subgroup: "payout-denial",
  },
  {
    id: "faq-payout-20",
    question: "보험금 지급이 거절됐을 때 이유를 알 수 있나요?",
    answer: "네. 회사는 지급 거절 사유를 통지해야 해요.",
    category: "payout",
    subgroup: "payout-denial",
  },
  {
    id: "faq-payout-21",
    question: "지급 거절 사유에 동의하지 않으면 어떻게 할 수 있나요?",
    answer: "금융감독원장에게 분쟁 조정을 신청할수 있어요. 이의 신청 후 재심사를 요청할 수 있어요.",
    category: "payout",
    subgroup: "payout-denial",
  },
  {
    id: "faq-payout-22",
    question: "진단명이 약관의 면책 항목에 해당한다고 하는데, 의사 소견은 다를 경우 어떻게 하나요?",
    answer: "약관제36조에 따라 약관의 뜻이 명백하지 않은 경우 계약자에게 유리하게 해석해요. 이의 신청 또는 분쟁 조정 신청이 가능해요.",
    category: "payout",
    subgroup: "payout-denial",
  },

  // ════════════════════════════════════════════════════
  // 보험금 청구
  // ════════════════════════════════════════════════════
  // 청구 시기·조건
  {
    id: "faq-claim-01",
    question: "하나의 사고란 무엇인가요?",
    answer: "하나의 질병 또는 상해를 의미함. \"1회의 보험사고\"라 함은 하나의 행위 또는 사실상 같은 종류의 위험에 계속적, 반복적 또는 누적적으로 노출되어 그 결과로 발생한 모든 사고를 말합니다. 발생 원인이 동일하거나 합병증 및 수의학상 서로 중요한 관련이 있는 질병.",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-02",
    question: "하나의 사고로 여러번 병원에 다녀온 경우",
    answer: "입원, 통원, 수술 상관없이 하나의 사고 (상해나 질병)등으로 인하여 2회 이상 치료하는 경우에도 이를 하나의 사고로 간주하여 보상하여 드립니다. (자부담금 1회 3만원, 합병증 및 수의학상 서로 중요한 관련이 있는 경우는 동일 사고로 간주) 최종 치료일에서 90일이 경과하여 개시되는 사고는 새로운 사고로 간주합니다. (자부담금 3만원 발생)",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-03",
    question: "같은 질병으로 계속 청구 가능한가요?",
    answer: "하나의 사고로 1회 자기부담금 3만원을 차감하고 손해율 70%를 곱한 금액을 보상합니다. 다만 최종치료일 이후 90일이 지나면 새로운 사고로 간주합니다.",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-04",
    question: "보험금 청구기한은 언제까지 인가요?",
    answer: "지급사유가 발생한 후 3년 이내 청구가 가능합니다.",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-05",
    question: "보험금 청구는 치료받은 당일에도 할 수 있나요?",
    answer: "치료비 발생 후 바로 청구 가능해요. 별도 청구가능 시점 제한은 없어요",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-06",
    question: "오래전 치료비를 지금 청구해도 되나요? 청구 기한이 있나요?",
    answer: "보험금 청구권은 3년간 행사하지않으면 소멸시효가 완성돼요. 즉 치료일로부터 3년 이내에 청구해야 해요.",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-07",
    question: "진료비 영수증을 잃어버렸을 때 어떻게 하나요?",
    answer: "사고증명서(진료비 영수증 포함)를 제출해야 해요. 영수증을 분실한 경우 동물병원에서 재발급을 요청하는 방법이 있어요.",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-08",
    question: "소액(1~2만원 정도)도 청구할 수 있나요?",
    answer: "자기부담금이 1사고당 3만원이에요. 치료비가 3만원이하면 보험금이 지급되지 않아요. 2만원 치료비의 경우 자기부담금 3만원 미만이므로 보험금이 발생하지 않아요.",
    category: "claim",
    subgroup: "claim-timing",
  },
  {
    id: "faq-claim-09",
    question: "동일 질병으로 여러 병원을 다녔을 때 통합해서 청구하나요?",
    answer: "각각 청구하나요?동일 사고로 인한치료는 하나의 사고로 간주해요.여러 병원의 치료비를 합산해서 1사고당 한도 내에서 보상받을 수 있어요.",
    category: "claim",
    subgroup: "claim-timing",
  },
  // 청구 방법·채널
  {
    id: "faq-claim-10",
    question: "보험료 청구 및 사고 접수는 어떻게 하나요?",
    answer: "이메일로 청구하기 db2017@dbins.co.kr 팩스접수 0505-181-4862 우편접수 (54966) 전라북도 전주시 완산구 서원로 99 전주우체국 사서함15호 DB손해보험 사고접수팀",
    category: "claim",
    subgroup: "claim-method",
    widgets: ["claim-contact-buttons"],
  },
  {
    id: "faq-claim-11",
    question: "보험금은 어떻게 청구하나요?",
    answer: "이메일, 팩스, 우편 접수가 가능해요. 어플이나 병원시스템에서 청구 접수는 현재 불가.",
    category: "claim",
    subgroup: "claim-method",
  },
  {
    id: "faq-claim-12",
    question: "대리인이 청구할 수 있나요?",
    answer: "약관상 피보험자가 보험금을 청구하는 것이 원칙이에요. 신분증 외에 대리인의 인감증명서 또는 본인서명사실확인서가 필요해요",
    category: "claim",
    subgroup: "claim-method",
  },
  {
    id: "faq-claim-13",
    question: "가족 중 다른 사람이 청구해도 되나요?",
    answer: "배우자 또는3촌 이내 친족이 대리 청구 가능해요.",
    category: "claim",
    subgroup: "claim-method",
  },
  // 청구 서류
  {
    id: "faq-claim-14",
    question: "가입 완료 후 보험증권은 어떻게 받을 수 있나요?",
    answer: "가입시 가입증명서가 발송됩니다.",
    category: "claim",
    subgroup: "claim-documents",
  },
  {
    id: "faq-claim-15",
    question: "가입 완료 후 보험증권은 언제, 어떻게 받을 수 있나요?",
    answer: "약관 제17조에 따라 청약 승낙 시 지체없이 보험증권을 교부해요. 단체계약의 경우 계약자(이마트)에게 교부하며, 개별 피보험자에게는 가입증명서를 발급해요",
    category: "claim",
    subgroup: "claim-documents",
  },
  {
    id: "faq-claim-16",
    question: "보험금 청구에 필요한 서류가 무엇인가요?",
    answer: "보험금 청구서(회사양식), 사고증명서(수의사 진단서,진료내역서, 진료비 영수증 등), 신분증이 필요해요 회사가 요구하는 추가 증거자료도 제출해야 할 수 있어요.",
    category: "claim",
    subgroup: "claim-documents",
  },
  {
    id: "faq-claim-17",
    question: "영수증만 있으면 청구가 되나요, 진단서도 꼭 필요한가요?",
    answer: "진료비 영수증이 사고증명서에 포함돼요. 진단서는 입원 등 경우에 추가 요구될 수 있어요. → 기본은 영수증으로가능하나 추가 요청 가능",
    category: "claim",
    subgroup: "claim-documents",
  },
  {
    id: "faq-claim-18",
    question: "MRI·CT를 찍은 경우 영상 사진도 제출해야 하나요?",
    answer: "회사가 요구하는 증거자료\"로 요청될 수 있어요",
    category: "claim",
    subgroup: "claim-documents",
  },
  // 청구 심사·처리
  {
    id: "faq-claim-19",
    question: "청구하면 보험금을 받기까지 얼마나 걸리나요?",
    answer: "서류 접수 후 지체 없이 보험금을 결정하고, 결정후 7일 이내에 지급해요. 배상책임· 재물 손해는 서류 접수 후 지체 없이 지급해요.",
    category: "claim",
    subgroup: "claim-review",
  },
  {
    id: "faq-claim-20",
    question: "청구 후 추가 서류를 요청받았는데 이유가 무엇인가요?",
    answer: "보험금 지급사유 조사 및 확인을 위해 추가 증거자료 제출을 요청할 수 있어요",
    category: "claim",
    subgroup: "claim-review",
  },
  {
    id: "faq-claim-21",
    question: "보험사에서 조사를 나온다고 하는데 어떤 경우에 조사가 진행되나요?",
    answer: "보험사는 손해 사실을 확인하기 어려운 경우 조사할 수 있어요. 고액 청구, 반복 청구, 의심 정황 등의 경우조사가 진행될 수 있어요.",
    category: "claim",
    subgroup: "claim-review",
  },
  {
    id: "faq-claim-22",
    question: "보험사 조사에 협조 안 하면 어떻게 되나요?",
    answer: "손해 방지 의무 위반으로 증가된 손해는 보상하지않아요. 또한 조사 미협조로 지급이 지연되는 경우 그 기간은 보험사 귀책이 아니에요.",
    category: "claim",
    subgroup: "claim-review",
  },
  {
    id: "faq-claim-23",
    question: "청구가 자주 많으면 거절당하기 쉬워지나요?",
    answer: "청구 횟수에 따른 거절 규정은 없어요. 각청구 건이 요건을 충족하면 보상한도 내 지급돼요.",
    category: "claim",
    subgroup: "claim-review",
  },
  {
    id: "faq-claim-24",
    question: "청구 결과가 마음에 안 들 때 이의 신청을 할 수 있나요?",
    answer: "네. 금융감독원장에게 분쟁 조정을 신청할 수 있어요.",
    category: "claim",
    subgroup: "claim-review",
  },

  // ════════════════════════════════════════════════════
  // 면책·제외
  // ════════════════════════════════════════════════════
  // 면책기간

  {
    id: "faq-exclusion-02",
    question: "대기기간 중에 사고가 나면 어떻게 처리되나요?",
    answer: "질병 대기기간(30일) 중 발생한 질병은 보상 제외예요. 상해(사고)는 대기기간 적용이 없어요. 단, 보험기간 자체가 시작되지 않은 경우에는 상해도 보장 안 돼요.",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-03",
    question: "예방접종 비용은 보장이 안 되나요?",
    answer: "맞아요. 백신 접종비용 및 예방을 위한 투약·접종비용은 보상하지 않아요",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-04",
    question: "중성화 수술 비용은 왜 보장이 안 되나요?",
    answer: "중성화·불임·피임 목적의 수술 및 처치는 치료 목적이 아닌 예방적 처치로 보아 보상 대상에서 제외해요",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-05",
    question: "건강검진 비용은 완전히 보장이 안 되나요?",
    answer: "정기검진, 예방적 검사 비용은 보상하지 않아요. 단, 질병·상해 치료 과정에서 실시한 검사는 보장돼요.",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-06",
    question: "미용(목욕, 그루밍 등) 비용은 당연히 안 되는 건가요?",
    answer: "미용으로 인한 비용은 보상하지 않아요. 목욕비용(약욕 포함)도 제외예요",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-07",
    question: "임신·출산 관련 비용은 하나도 보장이 안 되나요?",
    answer: "정상적인 임신·출산, 제왕절개, 인공유산 관련비용 및 출산 후 증상 치료 비용은 보상하지 않아요",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-08",
    question: "건강동물에 실시하는 외과수술 및 기타 검사는 안되요",
    answer: "손톱절제, 유치잔존, 잠복고환, 제대헤르니아(배꼽부위 탈장), 항문낭 제거, 점안, 귀청소",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-09",
    question: "한방·아로마·대체 치료는 왜 보장이 안 되나요?",
    answer: "한의학(침구 제외), 인도의학, 허브요법, 아로마테라피 등 대체의료는 보상하지 않아요. 단, 침구치료는 예외적으로 보장 가능해요",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  {
    id: "faq-exclusion-10",
    question: "수의사 자격이 없는 사람에게 치료받으면 왜 안 되나요?",
    answer: "수의사 자격이 없는 자의 치료행위로 인한 비용은 보상하지 않아요 또한 보험금 청구 시 제출하는 사고증명서는 동물병원에서 발급한 것이어야 해요",
    category: "exclusion",
    subgroup: "exclusion-period",
  },
  // 선천성·유전성 질환
  {
    id: "faq-exclusion-11",
    question: "선천성 질환이 있는 아이도 가입할 수 있나요?",
    answer: "가입 자체는 가능할 수 있으나, 선천성·유전성질병에 의한 손해는 원칙적으로 보상하지 않아요(치료비 특별약관 제3조 ①-13호 가). 단, 보험기간 중 최초로 발견된 경우에는 해당 보험기간에 한해 보상해요.",
    category: "exclusion",
    subgroup: "exclusion-congenital",
  },
  // 기존 질병·고지 의무
  {
    id: "faq-exclusion-12",
    question: "가입 전에 치료 이력이 있으면 무조건 안 되나요?",
    answer: "치료 이력 자체가 가입 거절 사유는 아니에요. 사실대로 고지하면 돼요 가입조건 확인에서 대부분의 질병은 3개월이내, 피부병 구강질환은 6개월 이내에 이력이 없으면 되고 슬개골,고관절 관련의 경우 치료 이력이 과거부터 현재까지 없어야 가능해요.",
    category: "exclusion",
    subgroup: "exclusion-preexisting",
  },
  {
    id: "faq-exclusion-13",
    question: "가입 전 병원 이력을 솔직하게 말하지 않으면 어떻게 되나요?",
    answer: "고의 또는 중대한 과실로 중요 사항을 사실과 다르게 알린 경우 보험사가 계약을 해지할 수 있어요",
    category: "exclusion",
    subgroup: "exclusion-preexisting",
  },
  {
    id: "faq-exclusion-14",
    question: "고지 의무 위반이 되면 보험 계약이 취소되나요, 아니면 보험금만 안 주는 건가요?",
    answer: "원칙적으로계약 해지예요. 해지 후 그 손해를 보상하지 않아요. 단, 위반 사실이 손해 발생에 영향을 미치지 않은 경우에는 보상해요.",
    category: "exclusion",
    subgroup: "exclusion-preexisting",
  },
  {
    id: "faq-exclusion-15",
    question: "가입 당시에는 몰랐던 기존 질환이 나중에 발견된 경우에는 어떻게 되나요?보험개시 이",
    answer: "전 발병이 객관적으로 확인되면 보상 제외예요. 단, 보험기간 중 최초 발견된 경우에는 해당 보험기간에한해 보장 가능해요.",
    category: "exclusion",
    subgroup: "exclusion-preexisting",
  },
  {
    id: "faq-exclusion-16",
    question: "나이를 잘못 알고 고지했는데 나중에 문제가 생기면 어떻게 되나요?",
    answer: "고의나 중대한 과실 없이 잘못 알고 고지한 경우에는 회사가 계약 해지를 할 수 없어요 단, 보험료 조정이있을 수 있어요.",
    category: "exclusion",
    subgroup: "exclusion-preexisting",
  },
  {
    id: "faq-exclusion-17",
    question: "치료 이력이 3개월 이내라서 가입이 안 된다고 하는데, 그 기준이 어떻게 되나요?",
    answer: "3개월 이내 예방이나 검진 목적을 제외한 진료 이력이 없으면 가입 가능해요. 만약 있다면 조금 더 건강해진 다음에 만나요.",
    category: "exclusion",
    subgroup: "exclusion-preexisting",
  },
  // 기타 면책 사유
  {
    id: "faq-exclusion-18",
    question: "음식물을 먹거나 삼켜서 병원에 다녀왔어요.",
    answer: "음식물 섭취로 인한 증상, 세균성 음식물 중독과 상습적으로 흡입, 흡수 또는 섭취한 결과로 생긴 중독 증상은 보상하지 않습니다. 음식물- 반려동물이 일상생활 중 보호자 또는 생산자의 의도와 상관없이 섭취할 수 있는 모든 식 이 원료와 가공품 및 부산물(뼈, 과일 씨 등 폐기 대상 물질) 그러나 '이물섭식' 음식물이 아닌 이물을 먹어 발생한 사고는 상해로 인정합니다.",
    category: "exclusion",
    subgroup: "exclusion-other",
  },
  {
    id: "faq-exclusion-19",
    question: "보호자가 고의로 반려동물을 다치게 한 경우는 당연히 보장이 안 되는 건가요?",
    answer: "맞아요. 계약자·피보험자·가족·사용인의 고의 또는 중대한 과실로 생긴 손해는 보상하지 않아요",
    category: "exclusion",
    subgroup: "exclusion-other",
  },
  {
    id: "faq-exclusion-20",
    question: "전쟁, 자연재해로 인한 사고는 왜 보장이 안 되나요?",
    answer: "전쟁, 혁명, 내란, 지진, 분화, 해일, 홍수 등으로 생긴 손해는 보험의 기본 원리상 예측 불가능한 거대 위험으로 면책 처리돼요",
    category: "exclusion",
    subgroup: "exclusion-other",
  },
  {
    id: "faq-exclusion-21",
    question: "국가 명령에 의한 살처분의 경우에는 어떻게 되나요?",
    answer: "국가 및 지방자치단체의 명령 또는 법률에의한 살처분은 보상하지 않아요",
    category: "exclusion",
    subgroup: "exclusion-other",
  },
  {
    id: "faq-exclusion-22",
    question: "먹이를 제대로 안 줘서 발생한 질병은 보장이 안 된다는 게 어떤 경우를 말하나요?",
    answer: "원인이 어떤경우라도 사료 제공 또는 급수 등 기본적인 관리에 대한 태만으로 발생한 손해는 보상하지 않아요. 즉 관리 소홀로 인한 기아·탈수 등이 해당돼요.",
    category: "exclusion",
    subgroup: "exclusion-other",
  },
  {
    id: "faq-exclusion-23",
    question: "광견병 예방접종을 안 해서 걸린 광견병은 보장이 안 되나요?",
    answer: "맞아요. 질병 발생일로부터 과거 1년 이내에 예방접종을 하지 않아 발생한 광견병은 보상하지 않아요",
    category: "exclusion",
    subgroup: "exclusion-other",
  },
  {
    id: "faq-exclusion-24",
    question: "반려동물이 싸움(투견 등)을 하다 다쳤을 때도 보장이 안 되나요?",
    answer: "반려동물을 범죄행위, 투견, 실험 등 유사 목적으로 이용함으로써 발생한 손해는 보상하지 않아요",
    category: "exclusion",
    subgroup: "exclusion-other",
  },

  // ════════════════════════════════════════════════════
  // 갱신·해지·계약 변경
  // ════════════════════════════════════════════════════
  // 갱신
  {
    id: "faq-renewal-01",
    question: "보험이자동으로갱신된다고하는데,갱신거절을당할수도있나요?",
    answer: "",
    category: "renewal",
    subgroup: "renewal-renew",
  },
  {
    id: "faq-renewal-02",
    question: "갱신거절이되는조건은무엇인가요?",
    answer: "",
    category: "renewal",
    subgroup: "renewal-renew",
  },
  {
    id: "faq-renewal-03",
    question: "갱신시보험조건(보장내용)이바뀔수있나요?",
    answer: "갱신시 보장내용은 변동 없으며 대기기간(면책기간)이 없습니다.",
    category: "renewal",
    subgroup: "renewal-renew",
  },
  {
    id: "faq-renewal-04",
    question: "갱신 전에 미리 알려 주나요? 얼마나 전에 알려 주나요?",
    answer: "",
    category: "renewal",
    subgroup: "renewal-renew",
  },
  {
    id: "faq-renewal-05",
    question: "갱신을 원하지 않으면 어떻게 해야 하나요?",
    answer: "",
    category: "renewal",
    subgroup: "renewal-renew",
  },
  {
    id: "faq-renewal-06",
    question: "갱신일에 반려동물이 아픈 경우 갱신이 안될수도 있나요?",
    answer: "아니요. 갱신일에는 대기기간 없이 바로 보상됩니다.",
    category: "renewal",
    subgroup: "renewal-renew",
  },
  // 계약 변경
  {
    id: "faq-renewal-07",
    question: "이마트 몰리스가 이 보험을 없애면 어떻게 되나요?",
    answer: "이마트가 계약자로 하고 고객을 피보험자로 하는 단체계약이나 올라 상품이 없어질 경우 DB손해보험과의 계약으로 전환됩니다.",
    category: "renewal",
    subgroup: "renewal-change",
  },
  {
    id: "faq-renewal-08",
    question: "가입후특약을추가할수있나요?",
    answer: "올라는 피부병,구강질환,치과, 슬관절 등의 특약이 포함되어 있고 따로 특약은 없습니다.",
    category: "renewal",
    subgroup: "renewal-change",
  },
  {
    id: "faq-renewal-09",
    question: "보험료납입방법(월납↔연납)을중간에바꿀수있나요?",
    answer: "현재는 연납만 가능하나 (자동차보험처럼) 카드 할부 12개월까지 가능하고 무이자 할부는 5개월가지 가능합니다. (우리카드 6개월)",
    category: "renewal",
    subgroup: "renewal-change",
  },
  {
    id: "faq-renewal-10",
    question: "보험증권에 기재된 반려동물 정보가 잘못 됐을 때 어떻게수정하나요?",
    answer: "변경 사실 발생시 서면 등으로 회사에 알리고 확인을 받아야 해요.",
    category: "renewal",
    subgroup: "renewal-change",
  },
  // 해지·환급
  {
    id: "faq-renewal-11",
    question: "해약환급급 및 만기환급금",
    answer: "만기환급금은 없으며 해약시 보험사가 제반비용 계산 후 일할계산하여 돌려드립니다. 보험계약 대출제도는 없습니다.",
    category: "renewal",
    subgroup: "renewal-cancel",
  },
  {
    id: "faq-renewal-12",
    question: "중간에 해지하면 환급금을 받을수있나요?",
    answer: "네. 해지시 비용 공제 후 경과하지 않은 기간에 대해 일단위로 계산한 보험료를 환급해요",
    category: "renewal",
    subgroup: "renewal-cancel",
  },
  {
    id: "faq-renewal-13",
    question: "해지시 환급금이 납입한 보험료보다 적을수있나요?",
    answer: "네. 계약자 책임있는 사유로 해지하는 경우 이미 경과한 기간에 대해 단기요율로 계산한 보험료를 공제한 잔액을 환급해요. 경과기간이 길수록 환급금이 적어져요.",
    category: "renewal",
    subgroup: "renewal-cancel",
  },
  {
    id: "faq-renewal-14",
    question: "반려동물이 사망한 경우 보험계약은 어떻게되나요?",
    answer: "사망 위로금이 지급되며,보험목적(반려동물)이 소멸되므로 계약도 종료돼요.",
    category: "renewal",
    subgroup: "renewal-cancel",
  },
  {
    id: "faq-renewal-15",
    question: "반려동물을 분양보낸(양도한) 경우 계약은 어떻게 되나요?",
    answer: "보험의 목적의 양도는 회사의 서면동의 없이는 효력이 없어요. 양수인이 계약을 승계하려면 회사동의가 필요해요.",
    category: "renewal",
    subgroup: "renewal-cancel",
  },
  {
    id: "faq-renewal-16",
    question: "보험을 해지했다가 나중에 다시 살릴수있나요?",
    answer: "(현재 선연납이라 이 케이스가 발생할 일은 없음) 보험료 납입연체로 해지된 경우,환급금을 받지않았다면 해지일부터 3년이내에 부활(효력회복)을청약할 수 있어요. 임의 해지한 경우에는 부활이 안되고 재가입해야 해요.",
    category: "renewal",
    subgroup: "renewal-cancel",
  },
  {
    id: "faq-renewal-17",
    question: "부활시 대기기간이 다시 적용되나요?",
    answer: "(현재 선연납이라 이 케이스가 발생할 일은 없음) 부활의 경우 기존계약의 효력을 회복하는 것이므로 대기기간이 새로시작되지않아요.단,부활시에도 고지의무가 적용돼요",
    category: "renewal",
    subgroup: "renewal-cancel",
  },

  // ════════════════════════════════════════════════════
  // 불만·분쟁·민원
  // ════════════════════════════════════════════════════
  {
    id: "faq-dispute-01",
    question: "보험금 지급이 너무 오래 걸릴 때 어디에 항의할 수 있나요?",
    answer: "DB손해보험고객센터(1588-0100) 또는 금융감독원(1332)에 민원제기가 가능해요",
    category: "dispute",
  },
  {
    id: "faq-dispute-02",
    question: "보험사와 분쟁이 생기면 어디에 조정을 신청할 수 있나요?",
    answer: "금융감독원장에게 분쟁조정을 신청할 수 있어요",
    category: "dispute",
  },
  {
    id: "faq-dispute-03",
    question: "금융감독원에 민원을 넣으면 어떤 과정으로 진행되나요?",
    answer: "분쟁조정 신청 후 조정절차가 개시되면 회사는 관련법령이 정하는 경우를 제외하 고소를 제기하지않아요. 구체적진행절차는금감원(www.fss.or.kr)확인.",
    category: "dispute",
  },
  {
    id: "faq-dispute-04",
    question: "처음에 가입할 때 설명과 다른 내용이 있으면 어떻게 하나요?",
    answer: "보험 안내자료의 내용이 약관과 다른 경우 계약자에게 유리한 내용으로 계약이 성립된 것으로 봐요.",
    category: "dispute",
  },
  {
    id: "faq-dispute-05",
    question: "약관을 제대로 받지 못했는데 어떻게 해야 하나요?",
    answer: "(단체보험이라 이마트가 계약자이고 고객센터에 약관 요청하면 피보험자에게 보내줌) 약관 미교부·중요 내용 미설명의 경우 계약성립일부터 3개월 이내에 계약취소가가능하고,납입보험료 전액을 돌려받을 수 있어요.",
    category: "dispute",
  },
  {
    id: "faq-dispute-06",
    question: "소비자 입장에서 위법계약이라고 판단되면 해지요구가 가능한가요?",
    answer: "금융소비자보호법 위반사항이있는 경우 계약체결일부터5년,위반사실을 안 날부터 1년이내에 위법계약 해지요구가 가능해요",
    category: "dispute",
  },

  // ════════════════════════════════════════════════════
  // 반려동물 등록·신원 확인
  // ════════════════════════════════════════════════════
  {
    id: "faq-registration-01",
    question: "동물등록이 안 된 반려동물도 보험에 가입할 수 있나요?",
    answer: "",
    category: "registration",
  },
  {
    id: "faq-registration-02",
    question: "코사진(비문)으로 개체를 식별한다는 건 어떤원리인가요?",
    answer: "",
    category: "registration",
  },
  {
    id: "faq-registration-03",
    question: "비문등록을 해두면 어떤 이점이 있나요?",
    answer: "",
    category: "registration",
  },
  {
    id: "faq-registration-04",
    question: "보험에 가입한 반려동물과 치료받은 반려동물이 다른지 어떻게 확인하나요?",
    answer: "동물등록번호 등을 통해 동일성을 확인해요. 불일치시 추가 서류 제출이 요구될 수 있어요",
    category: "registration",
  },
  {
    id: "faq-registration-05",
    question: "반려동물이 잃어버렸다가 다시 찾았는데 보험은 유효한가요?",
    answer: "분실자체가 계약종료 사유는 아니에요. 보험기간내 보험사고 발생시 보장됩니다. 다만 분실기간 중 사고관련 동일성 입증은 필요해요.",
    category: "registration",
  },
  {
    id: "faq-registration-06",
    question: "반려동물의 나이를 확인할 방법이 없을 때 보험사에서 어떻게 처리하나요?",
    answer: "",
    category: "registration",
  },

  // ════════════════════════════════════════════════════
  // 기타·일반
  // ════════════════════════════════════════════════════
  {
    id: "faq-general-01",
    question: "펫보험이정말필요한가요?",
    answer: "",
    category: "general",
  },
  {
    id: "faq-general-02",
    question: "반려동물 의료비가 평균적으로 얼마나 드나요?",
    answer: "",
    category: "general",
  },
  {
    id: "faq-general-03",
    question: "보험사 별로 보장내용이 많이 다른가요?",
    answer: "",
    category: "general",
  },
  {
    id: "faq-general-04",
    question: "보험사를 선택할 때 어떤 점을 가장 중요하게 봐야 하나요?",
    answer: "",
    category: "general",
  },
  {
    id: "faq-general-05",
    question: "연말정산에서 펫보험료를 공제 받을 수 있나요?",
    answer: "",
    category: "general",
  },
  {
    id: "faq-general-06",
    question: "예금자 보호법 보호대상",
    answer: "이 계약은 법인(이마트)이 계약자·보험료 납부자인 단체계약으로,예금자 보호법 보호대상에는 해당하지 않는 구조예요.",
    category: "general",
  },
];