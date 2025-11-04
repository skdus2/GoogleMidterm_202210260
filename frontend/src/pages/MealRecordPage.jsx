import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function MealRecordPage() {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [mealTime, setMealTime] = useState("점심");
  const [menuName, setMenuName] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  // ✅ 식단 기록 불러오기
  const fetchRecords = () => {
    fetch(`${import.meta.env.VITE_API_BASE}/meal-records`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("식단 기록 불러오기 실패:", err));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ 날짜 클릭 시 해당 날짜 기록 필터링
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const filteredRecords = records.filter((r) =>
    r.date?.startsWith(selectedDateStr)
  );

  // ✅ 저장 (추가 / 수정)
  const handleSave = async () => {
    if (!menuName.trim()) return alert("메뉴 이름을 입력해주세요!");
    const dateTime = date ? `${date}T00:00:00` : new Date().toISOString();

    const payload = {
      date: dateTime,
      mealTime,
      menu: { name: menuName },
    };

    const url = editRecord
      ? `${import.meta.env.VITE_API_BASE}/meal-records/${editRecord.id}`
      : `${import.meta.env.VITE_API_BASE}/meal-records`;
    const method = editRecord ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editRecord ? "기록이 수정되었습니다 ✅" : "새 기록이 추가되었습니다 ✅");
        setModalOpen(false);
        setEditRecord(null);
        fetchRecords();
      } else {
        const msg = await res.text();
        alert("저장 실패 😢\n" + msg);
      }
    } catch (err) {
      console.error(err);
      alert("서버 연결 실패");
    }
  };

  // ✅ 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/meal-records/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("삭제되었습니다 ✅");
      fetchRecords();
    } else alert("삭제 실패 😢");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 overflow-hidden">
      <div className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-lg p-5 flex flex-col">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          📅 한 달간 식단 캘린더
        </h1>

        {/* ✅ 달력 */}
        <div className="flex justify-center mb-4">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-xl p-2 bg-orange-50 shadow-md border-none w-full"
            tileContent={({ date }) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const meals = records.filter((r) => r.date?.startsWith(dateStr));
              return meals.length > 0 ? (
                <div className="text-xs text-orange-600 font-semibold mt-1 truncate">
                  🍱 {meals[0].menu?.name}
                </div>
              ) : null;
            }}
          />
        </div>

        {/* ✅ 선택된 날짜 기록 */}
        <div className="flex-grow overflow-y-auto bg-orange-50 p-3 rounded-xl shadow-inner">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            📆 {format(selectedDate, "yyyy년 MM월 dd일")} 식단 기록
          </h2>

          {filteredRecords.length > 0 ? (
            <ul className="space-y-2">
              {filteredRecords.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between items-center bg-white px-3 py-2 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      🍽 {r.menu?.name}
                    </p>
                    <p className="text-sm text-gray-600">🕒 {r.mealTime}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditRecord(r);
                        setMealTime(r.mealTime);
                        setMenuName(r.menu?.name || "");
                        setDate(r.date ? r.date.split("T")[0] : "");
                        setModalOpen(true);
                      }}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">
              등록된 식단이 없습니다 😢
            </p>
          )}
        </div>

        {/* ✅ 버튼 영역 */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              setEditRecord(null);
              setMealTime("점심");
              setDate(format(selectedDate, "yyyy-MM-dd"));
              setMenuName("");
              setModalOpen(true);
            }}
            className="w-full bg-orange-400 text-white py-3 rounded-lg text-lg hover:bg-orange-500 transition"
          >
            ➕ 식단 추가
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            ⬅ 홈으로 돌아가기
          </button>
        </div>
      </div>

      {/* ✅ 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {editRecord ? "✏️ 식단 수정" : "🍽 새 식단 추가"}
            </h2>

            <label className="block mb-2 text-gray-700 font-semibold">날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-3"
            />

            <label className="block mb-2 text-gray-700 font-semibold">
              식사 시간
            </label>
            <select
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-3"
            >
              <option>아침</option>
              <option>점심</option>
              <option>저녁</option>
            </select>

            <label className="block mb-2 text-gray-700 font-semibold">
              메뉴 이름
            </label>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="예: 닭갈비덮밥"
              className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}