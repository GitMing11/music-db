// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

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

        // 로그인 성공 시 JWT 토큰을 localStorage에 저장
        localStorage.setItem("token", data.token);

        router.push("/dashboard"); // 대시보드 페이지로 리디렉션 (로그인 후 이동)
      } else {
        const data = await res.json();
        alert(data.error || "로그인 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">로그인</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded bg-blue-500 ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? "로딩 중..." : "로그인"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-blue-500 hover:underline"
          >
            회원가입하기
          </button>
        </div>
      </form>
    </div>
  );
}
