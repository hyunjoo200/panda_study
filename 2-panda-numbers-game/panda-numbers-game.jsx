import { useState, useEffect, useCallback, useRef } from "react";

// ---------- 데이터 ----------
const COLS = 8;
const ROWS = 5;

const NUMBERS = [
  { id: 1, hanzi: "一", pinyin: "yī", arabic: 1, npc: "과일가게 할머니", npcEmoji: "👵",
    item: "🍎", itemName: "사과", place: "과일밭", placeEmoji: "🍎",
    line: "판다야! 사과 한 개만 가져다주렴.", pos: { x: 1, y: 0 } },
  { id: 2, hanzi: "二", pinyin: "èr", arabic: 2, npc: "과일가게 아저씨", npcEmoji: "👨",
    item: "🍊", itemName: "귤", place: "과일밭", placeEmoji: "🍊",
    line: "귤 두 개만 가져와 줄래?", pos: { x: 3, y: 0 } },
  { id: 3, hanzi: "三", pinyin: "sān", arabic: 3, npc: "꽃집 주인", npcEmoji: "👩",
    item: "🌸", itemName: "꽃", place: "산책길", placeEmoji: "🌳",
    line: "예쁜 꽃 세 송이를 가져다줘!", pos: { x: 5, y: 0 } },
  { id: 4, hanzi: "四", pinyin: "sì", arabic: 4, npc: "연못의 아이", npcEmoji: "🧒",
    item: "🐟", itemName: "물고기", place: "작은 연못", placeEmoji: "💧",
    line: "물고기 네 마리를 찾아줘!", pos: { x: 7, y: 1 } },
  { id: 5, hanzi: "五", pinyin: "wǔ", arabic: 5, npc: "채소밭 할머니", npcEmoji: "👵",
    item: "🥕", itemName: "당근", place: "채소밭", placeEmoji: "🥕",
    line: "당근 다섯 개를 찾아주겠니?", pos: { x: 0, y: 2 } },
  { id: 6, hanzi: "六", pinyin: "liù", arabic: 6, npc: "나비를 좋아하는 아이", npcEmoji: "🧒",
    item: "🦋", itemName: "나비", place: "마을 광장", placeEmoji: "🦋",
    line: "나비 여섯 마리를 찾아보자!", pos: { x: 2, y: 2 } },
  { id: 7, hanzi: "七", pinyin: "qī", arabic: 7, npc: "마을 꼬마", npcEmoji: "🧒",
    item: "⭐", itemName: "별 모양 장식", place: "마을 광장", placeEmoji: "🏮",
    line: "마을 광장에 있는 별 모양 장식 일곱 개를 찾아줘!", pos: { x: 4, y: 2 } },
  { id: 8, hanzi: "八", pinyin: "bā", arabic: 8, npc: "대나무 숲의 판다 친구", npcEmoji: "🐼",
    item: "🎋", itemName: "대나무", place: "대나무 숲", placeEmoji: "🎋",
    line: "대나무 여덟 개를 모아줘!", pos: { x: 6, y: 3 } },
  { id: 9, hanzi: "九", pinyin: "jiǔ", arabic: 9, npc: "마을 상점 주인", npcEmoji: "🧑",
    item: "⚽", itemName: "공", place: "작은 가게", placeEmoji: "🏪",
    line: "공 아홉 개를 찾아서 바구니에 넣어줘!", pos: { x: 1, y: 4 } },
  { id: 10, hanzi: "十", pinyin: "shí", arabic: 10, npc: "마을 촌장", npcEmoji: "👴",
    item: "💎", itemName: "보물", place: "할머니의 집", placeEmoji: "🏠",
    line: "판디야! 마지막 미션이야. 마을에 숨겨진 보물 열 개를 찾아보자!", pos: { x: 5, y: 4 } },
];

const DECOR = [
  { x: 0, y: 0, emoji: "🌳" }, { x: 6, y: 0, emoji: "🌼" }, { x: 2, y: 0, emoji: "🌼" },
  { x: 4, y: 0, emoji: "🌳" }, { x: 0, y: 1, emoji: "🌿" }, { x: 2, y: 1, emoji: "🎍" },
  { x: 5, y: 1, emoji: "🌿" }, { x: 1, y: 2, emoji: "🌷" }, { x: 3, y: 2, emoji: "🏮" },
  { x: 5, y: 2, emoji: "🌸" }, { x: 7, y: 2, emoji: "🌳" }, { x: 0, y: 3, emoji: "🥬" },
  { x: 2, y: 3, emoji: "🌾" }, { x: 4, y: 3, emoji: "🎍" }, { x: 1, y: 3, emoji: "🌿" },
  { x: 3, y: 4, emoji: "🌳" }, { x: 7, y: 4, emoji: "🌼" }, { x: 6, y: 1, emoji: "🌾" },
];

const TILE = 56;

function findDecor(x, y) {
  return DECOR.find((d) => d.x === x && d.y === y);
}
function findNpcAt(x, y) {
  return NUMBERS.find((n) => n.pos.x === x && n.pos.y === y);
}

// ---------- 컴포넌트 ----------
export default function PandaNumberGame() {
  const [screen, setScreen] = useState("title"); // title | map | ending
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState("right");
  const [collected, setCollected] = useState({});
  const [activeMission, setActiveMission] = useState(null); // NUMBERS item
  const [phase, setPhase] = useState("dialogue"); // dialogue | select | correct
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [feedback, setFeedback] = useState("");
  const [reviewId, setReviewId] = useState(null);
  const [bump, setBump] = useState(false);
  const wrongTimeout = useRef(null);

  const collectedCount = Object.keys(collected).length;
  const npcHere = !activeMission ? findNpcAt(pos.x, pos.y) : null;
  const npcHereDone = npcHere && collected[npcHere.id];

  // ---------- 이동 ----------
  const move = useCallback(
    (dx, dy) => {
      if (activeMission || screen !== "map") return;
      setPos((p) => {
        const nx = Math.min(COLS - 1, Math.max(0, p.x + dx));
        const ny = Math.min(ROWS - 1, Math.max(0, p.y + dy));
        return { x: nx, y: ny };
      });
      if (dx < 0) setFacing("left");
      if (dx > 0) setFacing("right");
      setBump(true);
      setTimeout(() => setBump(false), 150);
    },
    [activeMission, screen]
  );

  const interact = useCallback(() => {
    if (screen !== "map" || activeMission) return;
    const npc = findNpcAt(pos.x, pos.y);
    if (npc && !collected[npc.id]) {
      startMission(npc);
    }
  }, [pos, screen, activeMission, collected]);

  useEffect(() => {
    function onKey(e) {
      if (screen !== "map") return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp") move(0, -1);
      else if (e.key === "ArrowDown") move(0, 1);
      else if (e.key === "ArrowLeft") move(-1, 0);
      else if (e.key === "ArrowRight") move(1, 0);
      else if (e.key === " ") interact();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, interact, screen]);

  // ---------- 미션 ----------
  function startMission(npc) {
    const target = npc.arabic;
    const extra = 2 + Math.floor(Math.random() * 3); // 2~4개 더 보여주기
    const total = target + extra;
    const arr = Array.from({ length: total }, (_, i) => i);
    // 살짝 섞기
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setItems(arr);
    setSelected(new Set());
    setFeedback("");
    setPhase("dialogue");
    setActiveMission(npc);
  }

  function toggleItem(id) {
    if (phase !== "select") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    if (!activeMission) return;
    if (selected.size === activeMission.arabic) {
      setPhase("correct");
      setCollected((prev) => ({ ...prev, [activeMission.id]: true }));
    } else {
      const diff = selected.size - activeMission.arabic;
      setFeedback(diff > 0 ? "앗! 하나가 너무 많아!" : "앗! 조금 더 필요해!");
      wrongTimeout.current && clearTimeout(wrongTimeout.current);
      wrongTimeout.current = setTimeout(() => {
        setSelected(new Set());
        setFeedback("");
      }, 1200);
    }
  }

  function closeMission() {
    const wasLast = activeMission && Object.keys({ ...collected, [activeMission.id]: true }).length === 10;
    setActiveMission(null);
    setPhase("dialogue");
    if (wasLast) setScreen("ending");
  }

  function speak(text) {
    try {
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {
      /* 음성 미지원 브라우저는 조용히 무시 */
    }
  }

  function restart() {
    setCollected({});
    setPos({ x: 0, y: 0 });
    setFacing("right");
    setActiveMission(null);
    setReviewId(null);
    setScreen("title");
  }

  const fontImport =
    "@import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gowun+Dodum&display=swap');";

  // ---------- 화면: 타이틀 ----------
  if (screen === "title") {
    return (
      <div style={{ fontFamily: "'Gowun Dodum', sans-serif" }} className="w-full min-h-full flex items-center justify-center p-6" >
        <style>{fontImport}</style>
        <div
          className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center shadow-lg"
          style={{ background: "linear-gradient(180deg,#EAF3E7 0%, #DCEAD6 100%)", border: "3px solid #C7DEC1" }}
        >
          <div className="text-7xl mb-2 animate-bounce">🐼</div>
          <h1
            style={{ fontFamily: "'Gaegu', cursive", color: "#2F4B3C" }}
            className="text-3xl font-bold mb-1"
          >
            판다 탐험대 출동!
          </h1>
          <p style={{ color: "#5B7A64" }} className="text-sm mb-6">
            중국어 숫자 1부터 10까지 찾아라!
          </p>
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"].map((h, i) => (
              <span
                key={i}
                style={{ background: "#fff", color: "#D65B4A", border: "2px solid #E8B84B" }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
              >
                {h}
              </span>
            ))}
          </div>
          <button
            onClick={() => setScreen("map")}
            style={{ background: "#D65B4A", fontFamily: "'Gaegu', cursive" }}
            className="text-white text-xl font-bold px-10 py-3 rounded-full shadow hover:brightness-110 active:scale-95 transition"
          >
            탐험 시작
          </button>
          <div
            style={{ background: "#fff", borderColor: "#C7DEC1" }}
            className="mt-6 border-2 rounded-2xl px-4 py-3 text-sm text-left w-full"
          >
            <p style={{ color: "#2F4B3C" }}>🐼 "안녕! 나는 판디야!"</p>
            <p style={{ color: "#2F4B3C" }} className="mt-1">
              "오늘은 마을을 탐험하면서 중국어 숫자 카드를 모을 거야!"
            </p>
            <p style={{ color: "#2F4B3C" }} className="mt-1">
              "숫자 카드를 모두 모으면 탐험 성공이야!"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- 화면: 엔딩 ----------
  if (screen === "ending") {
    return (
      <div style={{ fontFamily: "'Gowun Dodum', sans-serif" }} className="w-full min-h-full flex items-center justify-center p-6">
        <style>{fontImport}</style>
        <div
          className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center shadow-lg"
          style={{ background: "linear-gradient(180deg,#FFF7E0 0%, #FFEFC2 100%)", border: "3px solid #E8B84B" }}
        >
          <div className="text-6xl mb-2">🎉🐼🎉</div>
          <h2 style={{ fontFamily: "'Gaegu', cursive", color: "#B5471B" }} className="text-2xl font-bold mb-1">
            탐험 성공!
          </h2>
          <p style={{ color: "#8A5A20" }} className="text-sm mb-4">
            중국어 숫자 1부터 10까지 완성!
          </p>
          <div className="grid grid-cols-5 gap-2 w-full mb-4">
            {NUMBERS.map((n) => (
              <div
                key={n.id}
                style={{ background: "#fff", border: "2px solid #E8B84B" }}
                className="rounded-xl py-2 flex flex-col items-center"
              >
                <span style={{ color: "#D65B4A" }} className="text-lg font-bold">
                  {n.hanzi}
                </span>
                <span style={{ color: "#8A5A20" }} className="text-[10px]">
                  {n.pinyin}
                </span>
                <span style={{ color: "#B5471B" }} className="text-[10px]">
                  {n.arabic}
                </span>
              </div>
            ))}
          </div>
          <p style={{ color: "#2F4B3C" }} className="text-sm mb-1">
            🐼 "정말 멋진 탐험이었어!"
          </p>
          <p style={{ color: "#2F4B3C" }} className="text-sm mb-6">
            "다음 탐험에서 또 만나자!"
          </p>
          <button
            onClick={restart}
            style={{ background: "#D65B4A", fontFamily: "'Gaegu', cursive" }}
            className="text-white text-lg font-bold px-8 py-3 rounded-full shadow hover:brightness-110 active:scale-95 transition"
          >
            다시 탐험하기
          </button>
        </div>
      </div>
    );
  }

  // ---------- 화면: 맵 (게임 본편) ----------
  return (
    <div style={{ fontFamily: "'Gowun Dodum', sans-serif", background: "#EAF3E7" }} className="w-full min-h-full flex flex-col items-center p-4 gap-3">
      <style>{fontImport}</style>

      <div className="w-full max-w-md flex items-center justify-between px-1">
        <h1 style={{ fontFamily: "'Gaegu', cursive", color: "#2F4B3C" }} className="text-lg font-bold">
          🐼 판다 탐험대
        </h1>
        <div style={{ color: "#5B7A64" }} className="text-xs">
          숫자 카드 {collectedCount} / 10
        </div>
      </div>

      <p style={{ color: "#5B7A64" }} className="text-xs -mt-1">
        🎮 방향키(또는 아래 버튼)로 판디를 움직여 보세요!
      </p>

      {/* 맵 */}
      <div
        className="relative rounded-2xl overflow-hidden shadow"
        style={{
          width: COLS * TILE,
          height: ROWS * TILE,
          background: "linear-gradient(180deg,#CDE7BE 0%, #B9DCA6 100%)",
          border: "3px solid #8FBF7A",
        }}
      >
        {/* 타일 그리드 라인 느낌 */}
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const x = i % COLS;
          const y = Math.floor(i / COLS);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x * TILE,
                top: y * TILE,
                width: TILE,
                height: TILE,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          );
        })}

        {/* 장식 */}
        {DECOR.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x * TILE,
              top: d.y * TILE,
              width: TILE,
              height: TILE,
            }}
            className="flex items-center justify-center text-xl opacity-80 select-none pointer-events-none"
          >
            {d.emoji}
          </div>
        ))}

        {/* NPC */}
        {NUMBERS.map((n) => (
          <div
            key={n.id}
            style={{ position: "absolute", left: n.pos.x * TILE, top: n.pos.y * TILE, width: TILE, height: TILE }}
            className="flex flex-col items-center justify-center select-none"
          >
            <div className="text-2xl">{collected[n.id] ? "✅" : n.npcEmoji}</div>
          </div>
        ))}

        {/* 플레이어 */}
        <div
          style={{
            position: "absolute",
            left: pos.x * TILE,
            top: pos.y * TILE,
            width: TILE,
            height: TILE,
            transition: "left 0.15s ease, top 0.15s ease",
          }}
          className="flex items-center justify-center"
        >
          <div
            style={{
              transform: `scaleX(${facing === "left" ? -1 : 1}) ${bump ? "translateY(-4px)" : "translateY(0)"}`,
              transition: "transform 0.12s ease",
            }}
            className="text-3xl"
          >
            🐼
          </div>
        </div>
      </div>

      {/* NPC 위에 있을 때 말풍선 안내 */}
      <div className="w-full max-w-md min-h-[40px]">
        {npcHere && !npcHereDone && (
          <div
            style={{ background: "#fff", border: "2px solid #E8B84B", color: "#8A5A20" }}
            className="rounded-xl px-3 py-2 text-xs text-center"
          >
            {npcHere.npc}: "{npcHere.line}"
            <br />
            <span className="opacity-70">스페이스바 또는 대화하기 버튼을 눌러보세요!</span>
          </div>
        )}
        {npcHere && npcHereDone && (
          <div style={{ color: "#5B7A64" }} className="text-xs text-center">
            {npcHere.place} · 이미 만난 친구예요 🐾
          </div>
        )}
      </div>

      {/* 조작 버튼 */}
      <div className="flex items-center gap-6">
        <div className="grid grid-cols-3 gap-1">
          <div />
          <CtrlBtn onClick={() => move(0, -1)}>▲</CtrlBtn>
          <div />
          <CtrlBtn onClick={() => move(-1, 0)}>◀</CtrlBtn>
          <CtrlBtn onClick={() => move(0, 1)}>▼</CtrlBtn>
          <CtrlBtn onClick={() => move(1, 0)}>▶</CtrlBtn>
        </div>
        <button
          onClick={interact}
          disabled={!npcHere || npcHereDone}
          style={{
            background: !npcHere || npcHereDone ? "#CBD9C6" : "#D65B4A",
            fontFamily: "'Gaegu', cursive",
          }}
          className="text-white font-bold px-5 py-3 rounded-full shadow disabled:cursor-not-allowed active:scale-95 transition"
        >
          대화하기
        </button>
      </div>

      {/* 숫자 카드 트레이 */}
      <div className="w-full max-w-md mt-1">
        <div
          style={{ background: "#fff", border: "2px solid #C7DEC1" }}
          className="rounded-2xl p-2 grid grid-cols-5 gap-2"
        >
          {NUMBERS.map((n) => {
            const has = !!collected[n.id];
            return (
              <button
                key={n.id}
                onClick={() => has && setReviewId(n.id)}
                style={{
                  background: has ? "#FFF7E0" : "#F1F1F1",
                  border: has ? "2px solid #E8B84B" : "2px dashed #CBD5CB",
                  color: has ? "#D65B4A" : "#9AA79C",
                }}
                className="rounded-xl aspect-square flex items-center justify-center text-lg font-bold"
              >
                {has ? n.hanzi : "?"}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- 미션 오버레이 ---------- */}
      {activeMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(47,75,60,0.55)" }}>
          <div
            style={{ background: "#fff", border: "3px solid #E8B84B" }}
            className="w-full max-w-sm rounded-3xl p-5 max-h-[90vh] overflow-y-auto"
          >
            {phase === "dialogue" && (
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-5xl">{activeMission.npcEmoji}</div>
                <p style={{ color: "#2F4B3C" }} className="font-bold">
                  {activeMission.npc}
                </p>
                <div style={{ background: "#EAF3E7", color: "#2F4B3C" }} className="rounded-xl px-3 py-2 text-sm">
                  "{activeMission.line}"
                </div>
                <button
                  onClick={() => setPhase("select")}
                  style={{ background: "#D65B4A", fontFamily: "'Gaegu', cursive" }}
                  className="text-white font-bold px-6 py-2 rounded-full mt-1 active:scale-95 transition"
                >
                  좋아, 찾아볼게!
                </button>
              </div>
            )}

            {phase === "select" && (
              <div className="flex flex-col items-center text-center gap-3">
                <p style={{ color: "#2F4B3C" }} className="text-sm">
                  {activeMission.itemName}을(를){" "}
                  <span style={{ color: "#D65B4A" }} className="font-bold">
                    {activeMission.arabic}개
                  </span>{" "}
                  선택해줘!
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                  {items.map((id) => (
                    <button
                      key={id}
                      onClick={() => toggleItem(id)}
                      style={{
                        background: selected.has(id) ? "#FFF3CE" : "#F5F7F4",
                        border: selected.has(id) ? "2px solid #E8B84B" : "2px solid #E1E8DE",
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl active:scale-90 transition"
                    >
                      {activeMission.item}
                    </button>
                  ))}
                </div>
                <p style={{ color: "#5B7A64" }} className="text-xs">
                  선택됨: {selected.size}개
                </p>
                {feedback && (
                  <p style={{ color: "#D65B4A" }} className="text-sm font-bold">
                    🐼 "{feedback}" 다시 세어보자.
                  </p>
                )}
                <button
                  onClick={submit}
                  disabled={selected.size === 0}
                  style={{ background: selected.size === 0 ? "#CBD9C6" : "#D65B4A", fontFamily: "'Gaegu', cursive" }}
                  className="text-white font-bold px-6 py-2 rounded-full active:scale-95 transition"
                >
                  확인했어!
                </button>
              </div>
            )}

            {phase === "correct" && (
              <CorrectCard mission={activeMission} onSpeak={speak} onClose={closeMission} closeLabel="확인" />
            )}
          </div>
        </div>
      )}

      {/* ---------- 카드 복습 팝업 ---------- */}
      {reviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(47,75,60,0.55)" }}>
          <div style={{ background: "#fff", border: "3px solid #E8B84B" }} className="w-full max-w-sm rounded-3xl p-5">
            <CorrectCard
              mission={NUMBERS.find((n) => n.id === reviewId)}
              onSpeak={speak}
              onClose={() => setReviewId(null)}
              closeLabel="닫기"
              reviewMode
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CtrlBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "#fff", border: "2px solid #C7DEC1", color: "#2F4B3C" }}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold active:scale-90 transition"
    >
      {children}
    </button>
  );
}

function CorrectCard({ mission, onSpeak, onClose, closeLabel, reviewMode }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {!reviewMode && <div className="text-3xl mb-1">🎉 숫자 카드 획득! 🎉</div>}
      {!reviewMode && (
        <p style={{ color: "#2F4B3C" }} className="text-sm">
          🐼 "와! 딱 맞았어!"
        </p>
      )}
      <div
        style={{ background: "#FFF7E0", border: "2px solid #E8B84B", color: "#D65B4A" }}
        className="rounded-2xl px-8 py-4 text-5xl font-bold"
      >
        {mission.hanzi}
      </div>
      <p style={{ color: "#8A5A20" }} className="text-lg">
        {mission.pinyin}
      </p>
      <p style={{ color: "#2F4B3C" }} className="text-sm">
        = {mission.arabic}
      </p>
      <div className="text-xl">{mission.item.repeat(mission.arabic)}</div>
      <button
        onClick={() => onSpeak(mission.hanzi)}
        style={{ background: "#EAF3E7", color: "#2F4B3C", border: "2px solid #C7DEC1" }}
        className="px-4 py-1.5 rounded-full text-sm font-bold active:scale-95 transition"
      >
        🔊 발음 듣기
      </button>
      <button
        onClick={onClose}
        style={{ background: "#D65B4A", fontFamily: "'Gaegu', cursive" }}
        className="text-white font-bold px-8 py-2 rounded-full mt-1 active:scale-95 transition"
      >
        {closeLabel}
      </button>
    </div>
  );
}
