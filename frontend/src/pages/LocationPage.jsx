import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LocationPage() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [menuList, setMenuList] = useState("");
  const [editModal, setEditModal] = useState(null); // 🔹 수정 모달 상태
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const navigate = useNavigate();

  // ✅ 장소 목록 불러오기
  const fetchLocations = () => {
    fetch(`${import.meta.env.VITE_API_BASE}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch(() => console.error("장소 목록 불러오기 실패"));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // ✅ 장소 등록
  const handleAddLocation = async () => {
    if (!newLocation.trim()) return alert("장소 이름을 입력해주세요!");

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newLocation,
        description: menuList,
      }),
    });

    if (res.ok) {
      alert("장소가 추가되었습니다!");
      setNewLocation("");
      setMenuList("");
      fetchLocations();
    } else alert("장소 추가 실패 😢");
  };

  // ✅ 장소 수정 (모달 제출)
  const handleEditSubmit = async () => {
    if (!editModal) return;

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/locations/${editModal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        description: editDesc,
      }),
    });

    if (res.ok) {
      alert("수정되었습니다 ✅");
      setEditModal(null);
      fetchLocations();
    } else {
      alert("수정 실패 😢");
    }
  };

  // ✅ 장소 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/locations/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("삭제되었습니다 ✅");
      fetchLocations();
    } else alert("삭제 실패 😢");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-md relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">🏠 장소 관리</h1>

        {/* 장소 목록 */}
        <ul className="space-y-3 mb-4">
          {locations.map((loc) => (
            <li
              key={loc.id}
              className="flex flex-col bg-orange-50 rounded-lg px-4 py-2 hover:bg-orange-100 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{loc.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditModal(loc);
                      setEditName(loc.name);
                      setEditDesc(loc.description || "");
                    }}
                    className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                🍽 {loc.description || "등록된 메뉴 없음"}
              </p>
            </li>
          ))}
        </ul>

        {/* 새 장소 추가 */}
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="장소 이름 (예: 학식, 구내식당)"
          className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-2"
        />
        <textarea
          value={menuList}
          onChange={(e) => setMenuList(e.target.value)}
          placeholder="메뉴 목록을 쉼표로 구분 (예: 닭갈비덮밥, 연어샐러드, 김치찌개)"
          className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-2 h-24 resize-none"
        />
        <button
          onClick={handleAddLocation}
          className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 transition"
        >
          장소 추가
        </button>

        <button
          onClick={() => navigate("/home")}
          className="mt-4 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          ⬅ 홈으로 돌아가기
        </button>
      </div>

      {/* 🔸 수정 모달 */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ✏️ 장소 수정
            </h2>
            <label className="block mb-2 text-gray-700 font-semibold">
              장소 이름
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-3"
            />
            <label className="block mb-2 text-gray-700 font-semibold">
              메뉴 목록
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="border border-gray-300 rounded-lg w-full px-3 py-2 h-24 resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
              <button
                onClick={handleEditSubmit}
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