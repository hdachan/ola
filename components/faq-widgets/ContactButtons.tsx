import { Phone, Mail, MessageCircle, ChevronRight } from "lucide-react";
import { contactInfo } from "@/lib/contact-info";

// 전화번호에 하이픈 등이 들어있어도 tel: 링크는 숫자/플러스만 필요하므로 정리해서 사용.
const telHref = `tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`;
const mailHref = `mailto:${contactInfo.email}`;

export default function ContactButtons() {
  return (
    <div className="mt-3 space-y-1">
      <a
        href={contactInfo.kakaoChannelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 transition-colors active:bg-gray-50"
      >
        <MessageCircle className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <span className="flex-1">카카오톡 채널 바로가기</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
      </a>

      <a
        href={telHref}
        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 transition-colors active:bg-gray-50"
      >
        <Phone className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <span className="flex-1">전화 걸기 ({contactInfo.phone})</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
      </a>

      <a
        href={mailHref}
        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-700 transition-colors active:bg-gray-50"
      >
        <Mail className="h-4 w-4 flex-shrink-0 text-emerald-600" />
        <span className="flex-1">이메일 보내기 ({contactInfo.email})</span>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
      </a>
    </div>
  );
}