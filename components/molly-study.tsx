// components/molly-study.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, X, ZoomIn } from "lucide-react";

const learningImages = [
  { src: "/ola_learning1.png", alt: "몰리스 학습자료 1" },
  { src: "/ola_learning2.png", alt: "몰리스 학습자료 2" },
  { src: "/ola_learning3.png", alt: "몰리스 학습자료 3" },
];

function PinchZoomImage({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const lastDistance = useRef<number | null>(null);
  const lastTranslate = useRef({ x: 0, y: 0 });
  const lastTouchCenter = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touches: React.TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
      lastTouchCenter.current = getCenter(e.touches);
      lastTranslate.current = translate;
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging.current = true;
      dragStart.current = {
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y,
      };
    }
  }, [translate, scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 2 && lastDistance.current !== null) {
      const newDistance = getDistance(e.touches);
      const newScale = Math.min(Math.max(scale * (newDistance / lastDistance.current), 1), 5);

      const center = getCenter(e.touches);
      const dx = center.x - lastTouchCenter.current.x;
      const dy = center.y - lastTouchCenter.current.y;

      setScale(newScale);
      setTranslate({
        x: lastTranslate.current.x + dx,
        y: lastTranslate.current.y + dy,
      });

      lastDistance.current = newDistance;
      lastTouchCenter.current = center;
      lastTranslate.current = {
        x: lastTranslate.current.x + dx,
        y: lastTranslate.current.y + dy,
      };
    } else if (e.touches.length === 1 && isDragging.current) {
      setTranslate({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    }
  }, [scale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastDistance.current = null;
    }
    if (e.touches.length === 0) {
      isDragging.current = false;
      // 1배율로 돌아왔으면 위치 초기화
      if (scale <= 1) {
        setTranslate({ x: 0, y: 0 });
        setScale(1);
      }
    }
  }, [scale]);

  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  }, [scale]);

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden w-full h-full"
      style={{ touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      <div
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging.current ? "none" : "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={900}
          className="max-h-[85vh] w-auto select-none"
          draggable={false}
        />
      </div>

      {/* 안내 텍스트 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white whitespace-nowrap">
        {scale > 1 ? `${scale.toFixed(1)}× · 두 손가락으로 확대/축소` : "두 손가락으로 확대 · 두 번 탭으로 2.5×"}
      </div>
    </div>
  );
}

export default function MollyStudy() {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* 토글 헤더 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="text-sm font-semibold text-gray-800">올라 안내문 설명</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {/* 이미지 목록 */}
      {isOpen && (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4">
          {learningImages.map((img, idx) => (
            <div
              key={img.src}
              className="group relative cursor-zoom-in overflow-hidden rounded-lg border border-gray-100"
              onClick={() => setZoomedSrc(img.src)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto transition-transform duration-200 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                <ZoomIn className="h-8 w-8 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-black/40 px-2 py-0.5 text-xs text-white">
                {idx + 1} / {learningImages.length}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 확대 모달 — 핀치줌 적용 */}
      {zoomedSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
            onClick={() => setZoomedSrc(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <PinchZoomImage src={zoomedSrc} alt="확대 이미지" />
        </div>
      )}
    </div>
  );
}