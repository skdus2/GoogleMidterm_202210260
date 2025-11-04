import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StatusPage() {
  const nickname = localStorage.getItem("nickname") || "사용자";
  const [status, setStatus] = useState({
    condition: "",
    goal: "",
    allergy: "",
    notes: "",
  });
  const navigate = useNavigate();

  // ✅ 기존 상태 불러오기
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/status/${nickname}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) setStatus(data);
      })
      .catch(() => console.log("상태 불러오기 실패"));
  }, [nickname]);

  // ✅ 상태 저장
  const handleSave = async () => {
    const body = { nickname, ...status };

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("상태가 저장되었습니다 ✅");
    } else {
      alert("저장 실패 😢");
    }
  };

  // ✅ 입력 변경 핸들러
  const handleChange = (e) => {
    setStatus({ ...status, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-lime-100 to-green-200 overflow-hidden">
      <div className="w-[90vw] h-[85vh] bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          🧠 나의 상태 입력
        </h1>

        {/* 상태 입력 폼 */}
        <div className="flex-grow space-y-4 overflow-y-auto">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              현재 컨디션 😴
            </label>
            <input
              type="text"
              name="condition"
              value={status.condition}
              onChange={handleChange}
              placeholder="예: 운동 중, 피곤함, 컨디션 좋음 등"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              목표 🎯
            </label>
            <input
              type="text"
              name="goal"
              value={status.goal}
              onChange={handleChange}
              placeholder="예: 다이어트, 벌크업, 유지"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              알러지 🚫
            </label>
            <input
              type="text"
              name="allergy"
              value={status.allergy}
              onChange={handleChange}
              placeholder="예: 새우, 견과류, 우유 등"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              메모 📝
            </label>
            <textarea
              name="notes"
              value={status.notes}
              onChange={handleChange}
              placeholder="예: 생리 기간, 약 복용 중 등"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 outline-none resize-none"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white py-3 rounded-lg text-lg hover:bg-green-600 transition"
          >
            ✅ 상태 저장
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            ⬅ 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}