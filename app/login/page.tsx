// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // 로그인 오류 메시지
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/users"); // 이미 로그인된 경우 대시보드로 리디렉션
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/users");
      } else {
        const data = await res.json();
        setError(data.error || "로그인 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#1e1e1e] text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#282828] p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6">로그인</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-gray-300">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-gray-500 focus:border-[#901010]"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-gray-300">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-gray-500 focus:border-[#901010]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded bg-[#901010] text-white hover:bg-[#b01a1a] transition-colors ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? "로딩 중..." : "로그인"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-[#b01a1a] hover:underline"
          >
            회원가입하기
          </button>
        </div>
      </form>
    </div>
  );
}
