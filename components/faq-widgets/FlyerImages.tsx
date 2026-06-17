"use client";

import { useState } from "react";
import Image from "next/image";

// public/backgorund_emart1.png, public/backgorund_emart2.png 자리에 실제 전단 사진이 있으면
// 바로 화면에 보인다.
//
// 주의: public 폴더 안의 파일은 웹 경로에서 "/public"을 붙이지 않고
// 바로 "/파일명.확장자"로 접근한다 (예: public/a.png -> "/a.png").
const flyerImages = [
  { src: "/backgorund_emart1.png", alt: "가입 전단 앞면 (QR 코드)" },
  { src: "/backgorund_emart2.png", alt: "가입 전단 뒷면" },
];

export default function FlyerImages() {
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {flyerImages.map((img) => (
          <button
            key={img.src}
            onClick={() => setZoomedSrc(img.src)}
            className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
          >
            {/* width/height는 next/image가 비율 계산용으로만 쓰는 값이고,
                실제 표시 크기는 className의 w-full h-auto가 결정한다.
                덕분에 원본 가로세로 비율 그대로, 잘리지 않고 보인다. */}
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={1200}
              className="h-auto w-full"
              sizes="200px"
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        이미지를 누르면 크게 볼 수 있어요. QR을 화면에 가까이 대고 스캔해보세요.
      </p>

      {/* 탭하면 전체화면으로 확대해서 QR 스캔이 쉽게 보이도록 */}
      {zoomedSrc && (
        <div
          onClick={() => setZoomedSrc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <Image
            src={zoomedSrc}
            alt="전단 확대 이미지"
            width={800}
            height={1200}
            className="h-auto max-h-[85vh] w-auto max-w-full object-contain"
            sizes="100vw"
          />
        </div>
      )}
    </>
  );
}