import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AiRecommendPage() {
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecommend = async () => {
    if (!prompt.trim()) {
      alert("프롬프트를 입력해주세요 🍱");
      return;
    }

    setLoading(true);
    setRecommendations([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/ai/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("서버 응답 오류");

      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error(err);
      alert("추천을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (menuName) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/meal-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString(),
          mealTime: "점심",
          menu: { name: menuName },
        }),
      });
      if (res.ok) {
        alert(`${menuName}이(가) 오늘의 식단으로 기록되었습니다 ✅`);
        navigate("/home");
      } else {
        alert("기록 실패 😢");
      }
    } catch (e) {
      console.error(e);
      alert("서버 연결 실패");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🍱 AI 식단 추천
        </h1>

        {/* 프롬프트 입력 */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 학식 먹으려고 하는데 오늘 뭐 먹을까?"
          className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-orange-300 outline-none"
          rows={4}
        />
        <button
          onClick={handleRecommend}
          disabled={loading}
          className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
        >
          {loading ? "추천 중..." : "AI에게 추천 받기 🤖"}
        </button>

        {/* 추천 결과 표시 */}
        {recommendations.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              🍽 오늘의 추천 메뉴
            </h2>
            {recommendations.map((r, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 flex justify-between items-center bg-orange-50 hover:bg-orange-100 transition"
              >
                <div>
                  <p className="font-bold text-gray-800">
                    {idx + 1}. {r.menu}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    💡 이유: {r.reason}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(r.menu)}
                  className="bg-orange-400 text-white px-3 py-2 rounded-lg hover:bg-orange-500 transition"
                >
                  선택
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/home")}
          className="mt-6 w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          ⬅ 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}