// components/join-guide.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, X, ZoomIn } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 라이트박스 컴포넌트                                                   */
/* ------------------------------------------------------------------ */
function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(null);
  const [lastPinchDist, setLastPinchDist] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; ox: number; oy: number } | null>(null);

  // 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const clampOffset = useCallback(
    (ox: number, oy: number, s: number) => {
      const maxX = ((s - 1) * window.innerWidth) / 2;
      const maxY = ((s - 1) * window.innerHeight) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, ox)),
        y: Math.max(-maxY, Math.min(maxY, oy)),
      };
    },
    []
  );

  /* ---- 터치 이벤트 (핀치 줌 + 드래그) ---- */
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setLastPinchDist(null);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setLastPinchDist(Math.hypot(dx, dy));
      setLastTouch(null);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastPinchDist !== null) {
      // 핀치 줌
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.max(1, Math.min(5, scale * (dist / lastPinchDist)));
      const clamped = clampOffset(offset.x, offset.y, newScale);
      setScale(newScale);
      setOffset(clamped);
      setLastPinchDist(dist);
    } else if (e.touches.length === 1 && lastTouch !== null && scale > 1) {
      // 드래그 (확대 상태에서만)
      const dx = e.touches[0].clientX - lastTouch.x;
      const dy = e.touches[0].clientY - lastTouch.y;
      const clamped = clampOffset(offset.x + dx, offset.y + dy, scale);
      setOffset(clamped);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const onTouchEnd = () => {
    setLastTouch(null);
    setLastPinchDist(null);
    if (scale < 1.05) resetZoom();
  };

  /* ---- 더블탭 줌 토글 ---- */
  const lastTapRef = useState<number>(0);
  const onTap = () => {
    const now = Date.now();
    if (now - lastTapRef[0] < 300) {
      scale > 1 ? resetZoom() : setScale(2.5);
    }
    // @ts-ignore
    lastTapRef[1](now);
  };

  /* ---- 마우스 드래그 (데스크톱) ---- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setDragStart({ x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y });
    setDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart) return;
    const clamped = clampOffset(
      dragStart.ox + (e.clientX - dragStart.x),
      dragStart.oy + (e.clientY - dragStart.y),
      scale
    );
    setOffset(clamped);
  };

  const onMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget && scale <= 1) onClose();
      }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
        aria-label="닫기"
      >
        <X className="h-5 w-5" />
      </button>

      {/* 줌 초기화 버튼 (확대 시에만) */}
      {scale > 1 && (
        <button
          onClick={resetZoom}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/20 px-4 py-2 text-xs text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          원래 크기로
        </button>
      )}

      {/* 힌트 텍스트 */}
      {scale === 1 && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-xs text-white/50 whitespace-nowrap">
          핀치로 확대 · 더블탭으로 2.5× 줌
        </p>
      )}

      {/* 이미지 */}
      <div
        className="relative select-none"
        style={{
          transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
          transition: dragging || lastPinchDist !== null ? "none" : "transform 0.2s ease",
          cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "default",
          touchAction: "none",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onTap}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-screen max-w-screen object-contain"
          style={{ maxHeight: "90vh", maxWidth: "95vw" }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 확대 가능한 이미지 래퍼                                               */
/* ------------------------------------------------------------------ */
function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-lg border border-gray-100 cursor-zoom-in group"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={800}
          height={500}
          className="w-full h-auto"
        />
        {/* 확대 힌트 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity">
          <div className="rounded-full bg-white/80 p-2 shadow">
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          src={src}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 가입조건 확인 질문 데이터                                              */
/* ------------------------------------------------------------------ */
const joinConditions = [
  {
    num: 1,
    image: "/ola_join/ola_join1.png",
    content: (
      <p className="text-sm text-gray-700 leading-relaxed">
        애완/반려 이외의 목적으로 기르는 반려동물만 가입 가능.
      </p>
    ),
  },
  {
    num: 2,
    image: "/ola_join/ola_join2.png",
    content: (
      <p className="text-sm text-gray-700 leading-relaxed">
        사고나 질병 등으로 <strong>3개월 이내 진찰을 받은 적이 없어야</strong> 가능.
        <br />
        (이력이 있다면 진료일로부터 3개월 이후 가입 가능.
        <br />
        가입일로부터 3개월 이전의 질병/치료의 완쾌나 예방목적의 진찰은 해당하지 않습니다.)
      </p>
    ),
  },
  {
    num: 3,
    image: "/ola_join/ola_join3.png",
    content: (
      <div className="text-sm text-gray-700 leading-relaxed space-y-1">
        <p>
          [개] 피보바이러스감염증, 디스템퍼바이러스감염증, 파라인플루엔자감염증, 전염성간염,
          아데노바이러스2형 감염증, 코로나바이러스감염증, 렙토스피라감염증, 필라리아감염증, 광견병
        </p>
        <p>
          [고양이] 고양이범백혈구감소증, 고양이칼리시바이러스감염증, 고양이바이러스성비기관지염,
          고양이백혈병바이러스감염증
        </p>
        <p>
          <strong>해당 예방 접종을 했어야 가입 가능</strong>
          <br />
          <span className="text-gray-500">(해당 예방접종을 하지 않았을 경우 발생한 해당질병은 보상하지 않기 때문)</span>
        </p>
      </div>
    ),
  },
  {
    num: "4-5",
    image: "/ola_join/ola_join4.png",
    content: (
      <p className="text-sm text-gray-700 leading-relaxed">
        해당 질병이 특약으로 보장되기 때문에 과거부터 현재까지 기왕증, 즉 병력이 있으면 가입이
        불가능하나 *피부병, 구강질환, 치과치료는{" "}
        <strong>3개월 이내 이력만 없으면 가능.</strong>
      </p>
    ),
  },
  {
    num: 6,
    image: "/ola_join/ola_join6.png",
    content: (
      <p className="text-sm text-gray-700 leading-relaxed">
        슬개골, 고관절은 과거 이력이 있으면 가입 불가능.
        <br />
        <span className="text-gray-500">
          (간혹 슬개골 고관절 부담보가입(해당질병을 보상하지 않는 가입)이 가능하냐고 할 수 있으나{" "}
        </span>
        <strong>부담보 가입 불가능</strong>
        <span className="text-gray-500">)</span>
      </p>
    ),
  },
  {
    num: 7,
    image: "/ola_join/ola_join7.png",
    content: (
      <p className="text-sm text-gray-700 leading-relaxed">
        비뇨기관 질환 요로결석은 보통 고양이에 해당하며{" "}
        <strong>6개월 이내 이력 없으면 가입 가능.</strong>
      </p>
    ),
  },
  {
    num: 8,
    image: "/ola_join/ola_join8.png",
    content: (
      <p className="text-sm text-gray-700 leading-relaxed">
        만성질환에 대한 질문
        <br />
        심장사상충, 벼룩, 진드기 등의 예방약 및 영양제를 제외한{" "}
        <strong>복용약이 있으면 만성질환을 앓고 있는 반려동물이라 판단해 가입 불가.</strong>
      </p>
    ),
  },
  {
    num: 9,
    image: "/ola_join/ola_join9.png",
    content: (
      <p className="text-sm text-gray-700 leading-relaxed">
        다른 펫보험에 중복가입 — 중복으로 가입하면 중복 보상이 되지 않기 때문에{" "}
        <strong>가입조건에서 가입 불가.</strong>
        <br />
        고객이 타 펫보험 해지할 경우 올라 가입이 가능하며, 이 경우 가입조건 답변을 체크해 보고
        보험료 산출이 나와야 가능.
        <br />
        <span className="text-gray-400 text-xs">※ 해당 조항 삭제 예정</span>
      </p>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* 개별 토글 아이템                                                      */
/* ------------------------------------------------------------------ */
function ConditionItem({
  num,
  image,
  content,
}: {
  num: number | string;
  image: string;
  content: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">{num}번 조건</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <ZoomableImage src={image} alt={`가입조건 ${num}번 이미지`} />
          {content}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 가입화면 토글 (상위)                                                  */
/* ------------------------------------------------------------------ */
function JoinScreenSection() {
  const [open, setOpen] = useState(false);

  const images = [
    { src: "/ola_join/ola_learning1.png", alt: "가입안내 이미지 1" },
    { src: "/ola_join/ola_learning2.png", alt: "가입안내 이미지 2" },
    { src: "/ola_join/ola_learning3.png", alt: "가입안내 이미지 3" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">가입화면</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          {images.map((img) => (
            <ZoomableImage key={img.src} src={img.src} alt={img.alt} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 가입조건 확인 질문 섹션 (상위 토글 → 내부에 1~9번 토글)               */
/* ------------------------------------------------------------------ */
function JoinConditionSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">가입조건 확인 질문</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            1~9번 중 <strong className="text-gray-700">3번만 예</strong>, 나머지 아니오일 때 보험료 조회 가능합니다.
          </p>
          {joinConditions.map((item) => (
            <ConditionItem
              key={String(item.num)}
              num={item.num}
              image={item.image}
              content={item.content}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 최종 export                                                          */
/* ------------------------------------------------------------------ */
export default function JoinGuide() {
  return (
    <div className="space-y-4">
      <JoinScreenSection />
      <JoinConditionSection />
    </div>
  );
}