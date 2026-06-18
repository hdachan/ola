import type { ComponentType } from "react";
import type { FaqWidgetId } from "@/lib/faq-entries";
import DogAgeCalculator from "@/components/faq-widgets/DogAgeCalculator";
import ContactButtons from "@/components/faq-widgets/ContactButtons";
import FlyerImages from "@/components/faq-widgets/FlyerImages";
import ClaimContactButtons from "@/components/faq-widgets/ClaimContactButtons";

// 새 위젯을 추가하는 절차:
// 1. lib/faq-entries.ts의 FaqWidgetId에 새 id 추가
// 2. components/faq-widgets/에 새 컴포넌트 파일 생성
// 3. 아래 맵에 한 줄 추가
// 4. faq-entries.ts에서 해당 질문에 widget: "새id" 지정
//
// faq-placeholder.tsx는 이 맵을 통해서만 위젯을 찾기 때문에 수정할 필요 없음.
export const faqWidgetRegistry: Record<FaqWidgetId, ComponentType> = {
  "dog-age-calculator": DogAgeCalculator,
  "contact-buttons": ContactButtons,
  "flyer-images": FlyerImages,
  "claim-contact-buttons": ClaimContactButtons,
};