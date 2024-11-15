// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "회원가입 실패");
        return;
      }

      alert("회원가입 성공");
      router.push("/login"); // 회원가입 후 로그인 페이지로 리디렉션
    } catch (error) {
      console.error("Error:", error);
      setError("회원가입 중 오류가 발생했습니다.");
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
        <h2 className="text-3xl font-bold text-center mb-6">회원가입</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-gray-300">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#3a3a3a] text-white border border-gray-500 focus:border-[#901010]"
          />
        </div>

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
          {loading ? "로딩 중..." : "회원가입"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-[#b01a1a] hover:underline"
          >
            이미 계정이 있으신가요? 로그인하기
          </button>
        </div>
      </form>
    </div>
  );
}
