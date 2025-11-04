import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname }),
    });

    const text = await res.text();
    setMessage(text);

    if (text === "회원가입 성공") {
      navigate("/");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-lime-100 overflow-hidden">
      <div className="w-[90vw] h-[85vh] bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">✨ 회원가입</h1>

        <form onSubmit={handleSubmit} className="flex flex-col justify-center flex-grow">
          <label className="block text-gray-700 mb-2 text-left text-lg">이메일</label>
          <input
            type="email"
            className="w-full mb-5 p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-gray-700 mb-2 text-left text-lg">비밀번호</label>
          <input
            type="password"
            className="w-full mb-5 p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-gray-700 mb-2 text-left text-lg">닉네임</label>
          <input
            type="text"
            className="w-full mb-6 p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-lime-500 text-white py-3 rounded-lg text-lg hover:bg-lime-600 transition"
          >
            회원가입 완료
          </button>

          {message && (
            <p className="text-center mt-4 text-red-500 font-semibold">{message}</p>
          )}

          <p className="mt-6 text-center text-gray-600 text-base">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/"
              className="text-lime-500 font-semibold hover:underline"
            >
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}