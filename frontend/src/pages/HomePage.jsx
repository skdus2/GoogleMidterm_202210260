import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(localStorage.getItem("nickname") || "사용자");
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]); // ✅ DB에서 불러올 장소 목록
  const [selectedLocation, setSelectedLocation] = useState("그 외");

  // ✅ 장소 목록 불러오기 (백엔드에서)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("장소 불러오기 실패:", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Gemini AI 호출
  const handleAskAI = async () => {
    if (!prompt.trim()) {
        alert("AI에게 물어볼 내용을 입력해주세요!");
        return;
    }

    setLoading(true);
    setRecommendations([]);

    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/ai/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt,
            prompt,
            nickname: nickname || localStorage.getItem("nickname") || "사용자",
            location: selectedLocation, // ✅ 추가됨
            mealTime,
          }),
        });

        if (!res.ok) throw new Error("서버 응답 오류");

        const data = await res.json();
        console.log("✅ AI 응답:", data);
        setRecommendations(data);
    } catch (err) {
        console.error("❌ AI 요청 오류:", err);
        alert("AI 추천 요청 중 오류가 발생했습니다 😢");
    } finally {
        setLoading(false);
    }
  };

  const [mealTime, setMealTime] = useState("점심"); //기본값 점심
  const localDate = new Date();
  localDate.setHours(localDate.getHours() + 9); //UTC+9 보정

  const handleSelect = async (menuName) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/meal-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            date: localDate.toISOString(),
            mealTime, //사용자가 선택한 시간
            menu: { name: menuName },
        }),
        });

        if (res.ok) {
        alert(`${menuName}이(가) 오늘 ${mealTime} 식단으로 기록되었습니다 ✅`);
        } else {
        alert("식단 기록 실패 😢");
        }
    } catch (e) {
        console.error(e);
        alert("서버 연결 실패");
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 p-6">
     <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md text-center overflow-visible relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          안녕하세요, <span className="text-orange-500">{nickname}</span> 님 👋
        </h1>
        <p className="text-xl text-gray-700 mb-6">오늘의 음식을 추천해드립니다 🍱</p>

        {/* ✅ 장소 선택 드롭다운 추가 */}
        <div className="mb-4 text-left">
          <label className="block text-gray-700 font-semibold mb-2">📍 장소 선택</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 relative z-50 bg-white"
          >
            <option value="그 외">그 외 (메뉴 제한 없음)</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ 식사 시간 선택 드롭다운 */}
        <div className="mb-4 text-left">
        <label className="block text-gray-700 font-semibold mb-2">🍽️ 식사 시간 선택</label>
        <select
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
            <option value="아침">아침</option>
            <option value="점심">점심</option>
            <option value="저녁">저녁</option>
        </select>
        </div>

        {/* 프롬프트 입력창 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 배달시킬려고 하는데 뭐 먹을까?"
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            onClick={handleAskAI}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            {loading ? "추천 중..." : "추천받기"}
          </button>
        </div>


        {/* 결과 표시 */}
        {recommendations.length > 0 && (
          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-800">🍽 추천 결과</h2>
            {recommendations.map((r, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 bg-orange-50 flex justify-between items-center hover:bg-orange-100 transition"
              >
                <div className="text-left">
                  <p className="font-bold text-gray-800">
                    {idx + 1}. {r.menu}
                  </p>
                  <p className="text-gray-600 text-sm">💡 {r.reason}</p>
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

        {/* 하단 버튼 */}
        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={() => navigate("/location")}
            className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
          >
            🏠 장소 수정 및 추가
          </button>

          <button
            onClick={() => navigate("/status")}
            className="bg-lime-500 text-white py-3 rounded-lg hover:bg-lime-600 transition"
          >
            💬 상태 입력
          </button>

          <button
            onClick={() => navigate("/calendar")}
            className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            📅 한달간 식단 보기
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 text-gray-500 hover:text-gray-800 underline"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}