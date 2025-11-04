import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (data.message === "로그인 성공") {
      localStorage.setItem("nickname", data.nickname);
      navigate("/home");
      }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 overflow-hidden">
      {/* 제목 부분 */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">
          🍱 Diet AI 로그인
        </h1>
      </div>

      {/* 흰 입력 영역만 카드화 */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[90vw] max-w-sm">
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 mb-2 text-lg font-semibold">이메일</label>
          <input
            type="email"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-gray-700 mb-2 text-lg font-semibold">비밀번호</label>
          <input
            type="password"
            className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition"
          >
            로그인
          </button>

          {message && (
            <p className="text-center mt-4 text-red-500 font-semibold">{message}</p>
          )}

          <p className="mt-4 text-center text-gray-600 text-base">
            계정이 없으신가요?{" "}
            <Link
              to="/register"
              className="text-orange-500 font-semibold hover:underline"
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}