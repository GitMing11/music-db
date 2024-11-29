"use client";

import { useState, useEffect } from "react";

export default function ScrollToButton() {
  const [showButton, setShowButton] = useState(false);

  // 페이지 스크롤 위치에 따라 버튼을 보이거나 숨기기
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true); // 스크롤이 100px 이상일 때 버튼 보이기
      } else {
        setShowButton(false); // 스크롤이 100px 미만일 때 버튼 숨기기
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 맨 위로 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 맨 아래로 이동
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-4">
          {/* 맨 위로 가는 버튼 */}
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300"
          >
            ↑
          </button>

          {/* 맨 아래로 가는 버튼 */}
          <button
            onClick={scrollToBottom}
            className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300"
          >
            ↓
          </button>
        </div>
      )}
    </>
  );
}
