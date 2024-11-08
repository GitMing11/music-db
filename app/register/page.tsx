"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const textResponse = await res.text();
      console.log("응답 내용:", textResponse);

      const data = textResponse ? JSON.parse(textResponse) : {};

      if (res.ok) {
        // 응답 데이터가 있는 경우
        if (data) {
          alert("회원가입 성공");
          router.push("/login"); // 회원가입 후 로그인 페이지로 리디렉션
        } else {
          alert("서버에서 빈 응답이 반환되었습니다.");
        }
      } else {
        alert(data.error || "회원가입 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다.");
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
        <h2 className="text-2xl font-semibold text-center mb-6">회원가입</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // 이름 변경 처리
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
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
          className={`w-full p-2 text-white rounded bg-green-500 ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? "로딩 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
