/* ============================================================
   판다 탐험대 - 대나무 언덕 (1차시) 게임 엔진
   - 빌드 도구 없이 바로 브라우저에서 동작하는 순수 자바스크립트입니다.
   - 코드에 한국어 주석을 달아두었으니, 내용을 바꾸고 싶으면
     아래 VOCAB / STEPS 부분만 수정하면 됩니다.
   ============================================================ */

/* ---------- 1. 오늘 배우는 단어(한자/병음/뜻) ---------- */
const VOCAB = {
  nihao:     { hanzi: "你好",   pinyin: "nǐ hǎo",        meaning: "안녕 / 안녕하세요" },
  nimenhao:  { hanzi: "你们好", pinyin: "nǐmen hǎo",     meaning: "여러분, 안녕하세요" },
  laoshihao: { hanzi: "老师好", pinyin: "lǎoshī hǎo",    meaning: "선생님, 안녕하세요" },
  tongxuehao:{ hanzi: "同学们好", pinyin: "tóngxuémen hǎo", meaning: "학생 여러분, 안녕하세요" },
  zhongguo:  { hanzi: "中国",   pinyin: "Zhōngguó",      meaning: "중국" },
  hanyu:     { hanzi: "汉语",   pinyin: "Hànyǔ",         meaning: "중국어" },
  ma1:       { hanzi: "妈",     pinyin: "mā",             meaning: "엄마" },
  ma2:       { hanzi: "麻",     pinyin: "má",             meaning: "삼(식물)" },
  ma3:       { hanzi: "马",     pinyin: "mǎ",             meaning: "말(동물)" },
  ma4:       { hanzi: "骂",     pinyin: "mà",             meaning: "꾸짖다" },
};

/* ---------- 2. 등장인물 ---------- */
const SPEAKERS = {
  panda:   { name: "판디",       img: "assets/panda_hero.png",   side: "left"  },
  teacher: { name: "리리 선생님", img: "assets/teacher_npc.png",  side: "right" },
  friend:  { name: "메이",       img: "assets/friend_npc.png",   side: "right" },
};

/* ---------- 3. 1차시 대본 (순서대로 진행) ---------- */
const STEPS = [
  { type: "dialogue", speaker: "panda",
    text: "안녕! 나는 판디야! 오늘은 '대나무 언덕'에서 중국어를 처음 만나볼 거야." },

  { type: "dialogue", speaker: "panda",
    text: "저기 선생님이 보인다! 같이 인사하러 가보자." },

  { type: "dialogue", speaker: "teacher",
    text: "你好! 내 이름은 리리 선생님이야. 만나서 반가워!",
    vocab: "nihao", follow: true },

  { type: "choice", speaker: "teacher",
    prompt: "방금 선생님이 한 인사말은 무엇이었을까요?",
    playVocab: "nihao",
    options: [
      { label: "你好 (nǐ hǎo)", correct: true },
      { label: "谢谢 (xièxie)", correct: false },
      { label: "再见 (zàijiàn)", correct: false },
    ] },

  { type: "dialogue", speaker: "teacher",
    text: "이번엔 선생님을 만났을 때 쓰는 인사말을 배워보자: 老师好!",
    vocab: "laoshihao", follow: true },

  { type: "choice", speaker: "panda",
    prompt: "판디가 선생님을 만났어요. 뭐라고 인사해야 할까요?",
    options: [
      { label: "你好 (nǐ hǎo)", correct: false },
      { label: "老师好 (lǎoshī hǎo)", correct: true },
      { label: "同学们好 (tóngxuémen hǎo)", correct: false },
    ] },

  { type: "dialogue", speaker: "friend",
    text: "안녕! 나는 메이야, 너랑 같은 반 친구야! 同学们好!",
    vocab: "tongxuehao", follow: true },

  { type: "choice", speaker: "friend",
    prompt: "선생님이 교실 문을 열고 들어와 학생들에게 인사했어요. 친구들은 뭐라고 대답할까요?",
    options: [
      { label: "老师好 (lǎoshī hǎo)", correct: true },
      { label: "你好 (nǐ hǎo)", correct: false },
      { label: "中国 (Zhōngguó)", correct: false },
    ] },

  { type: "dialogue", speaker: "panda",
    text: "그리고 친구들이 여러 명 모여 있을 때는 '你们好'라고 인사할 수도 있어! 조금 더 넓게 쓰는 인사말이야.",
    vocab: "nimenhao", follow: true },

  { type: "choice", speaker: "panda",
    prompt: "교실에 있는 여러 친구들에게 두루 인사하고 싶을 때 쓸 수 있는 말은 무엇일까요?",
    options: [
      { label: "你们好 (nǐmen hǎo)", correct: true },
      { label: "汉语 (Hànyǔ)", correct: false },
      { label: "中国 (Zhōngguó)", correct: false },
    ] },

  { type: "dialogue", speaker: "panda",
    text: "이번엔 우리가 배우는 말에 대해 알아보자! 이 나라의 이름은 바로 이거야.",
    vocab: "zhongguo" },

  { type: "dialogue", speaker: "panda",
    text: "그리고 우리가 배우고 있는 이 언어의 이름은 이거야!",
    vocab: "hanyu" },

  { type: "choice", speaker: "panda",
    prompt: "다음 중 '중국어'라는 뜻을 가진 단어는 무엇일까요?",
    options: [
      { label: "中国 (Zhōngguó)", correct: false },
      { label: "汉语 (Hànyǔ)", correct: true },
      { label: "你好 (nǐ hǎo)", correct: false },
    ] },

  { type: "dialogue", speaker: "panda",
    text: "이제 신기한 비밀 하나! 중국어는 같은 소리라도 높낮이(성조)가 다르면 뜻이 완전히 달라져. 아래 네 글자를 모두 눌러서 소리를 들어보자!" },

  { type: "tone" },

  { type: "dialogue", speaker: "panda",
    text: "우와, 신기하지? 이제 오늘 배운 걸 모두 확인하는 마지막 퀴즈를 풀어보자!" },

  { type: "choice",
    prompt: "'你好'는 무슨 뜻일까요?",
    options: [
      { label: "안녕하세요", correct: true },
      { label: "고맙습니다", correct: false },
      { label: "잘 가요", correct: false },
    ] },

  { type: "choice",
    prompt: "선생님을 만났을 때 하는 인사말은 무엇일까요?",
    options: [
      { label: "老师好", correct: true },
      { label: "同学们好", correct: false },
      { label: "汉语", correct: false },
    ] },

  { type: "choice",
    prompt: "'汉语'는 무슨 뜻일까요?",
    options: [
      { label: "중국", correct: false },
      { label: "중국어", correct: true },
      { label: "안녕", correct: false },
    ] },

  { type: "choice",
    prompt: "'妈 (mā)'는 무슨 뜻일까요?",
    options: [
      { label: "엄마", correct: true },
      { label: "말(동물)", correct: false },
      { label: "꾸짖다", correct: false },
    ] },

  { type: "result" },
];

/* ---------- 4. 상태 ---------- */
const SAVE_KEY = "panda-bamboo-hill-save-v1";
let state = {
  stepIndex: 0,
  stars: 0,
  cards: [],   // 지금까지 배운 vocab key 목록 (중복 없음)
};

function addCard(key) {
  if (!state.cards.includes(key)) state.cards.push(key);
}
function addStar() {
  state.stars += 1;
  document.getElementById("star-count").textContent = state.stars;
}
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* 저장 불가해도 게임은 계속 진행 */ }
}
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.stepIndex === "number") return parsed;
  } catch (e) { /* 무시 */ }
  return null;
}

/* ---------- 5. 음성 듣기 (중국어 TTS) ---------- */
function speak(text) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.82;
    window.speechSynthesis.speak(u);
  } catch (e) { /* 음성 미지원 브라우저는 조용히 무시 */ }
}

/* ---------- 6. 화면 요소 ---------- */
const el = {
  screenTitle: document.getElementById("screen-title"),
  screenVn: document.getElementById("screen-vn"),
  screenResult: document.getElementById("screen-result"),
  btnStart: document.getElementById("btn-start"),
  portrait: document.getElementById("portrait"),
  vocabCard: document.getElementById("vocab-card"),
  vocabHanzi: document.getElementById("vocab-hanzi"),
  vocabPinyin: document.getElementById("vocab-pinyin"),
  vocabMeaning: document.getElementById("vocab-meaning"),
  btnSpeak: document.getElementById("btn-speak"),
  tonePanel: document.getElementById("tone-panel"),
  speakerName: document.getElementById("speaker-name"),
  dialogueText: document.getElementById("dialogue-text"),
  followPrompt: document.getElementById("follow-prompt"),
  choiceArea: document.getElementById("choice-area"),
  btnNext: document.getElementById("btn-next"),
  resultStars: document.getElementById("result-stars"),
  resultCards: document.getElementById("result-cards"),
  btnRestart: document.getElementById("btn-restart"),
  btnCards: document.getElementById("btn-cards"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalCards: document.getElementById("modal-cards"),
  btnModalClose: document.getElementById("btn-modal-close"),
};

function showScreen(name) {
  [el.screenTitle, el.screenVn, el.screenResult].forEach((s) => s.classList.remove("active"));
  if (name === "title") el.screenTitle.classList.add("active");
  if (name === "vn") el.screenVn.classList.add("active");
  if (name === "result") el.screenResult.classList.add("active");
}

/* ---------- 7. 단계(step) 렌더링 ---------- */
function renderStep() {
  const step = STEPS[state.stepIndex];
  if (!step) { renderResult(); return; }

  if (step.type === "result") { renderResult(); return; }

  showScreen("vn");
  el.choiceArea.classList.add("hidden");
  el.choiceArea.innerHTML = "";
  el.followPrompt.classList.add("hidden");
  el.btnNext.classList.add("hidden");
  el.tonePanel.classList.add("hidden");
  el.vocabCard.classList.add("hidden");

  // 말하는 사람 초상화 + 이름
  if (step.speaker) {
    const sp = SPEAKERS[step.speaker];
    el.portrait.src = sp.img;
    el.portrait.alt = sp.name;
    el.portrait.classList.remove("hidden", "left");
    if (sp.side === "left") el.portrait.classList.add("left");
    el.speakerName.textContent = sp.name;
  } else {
    el.portrait.classList.add("hidden");
    el.speakerName.textContent = "";
  }

  if (step.type === "dialogue") {
    el.dialogueText.textContent = step.text;
    if (step.vocab) {
      const v = VOCAB[step.vocab];
      el.vocabHanzi.textContent = v.hanzi;
      el.vocabPinyin.textContent = v.pinyin;
      el.vocabMeaning.textContent = v.meaning;
      el.vocabCard.classList.remove("hidden");
      addCard(step.vocab);
      el.btnSpeak.onclick = () => speak(v.hanzi);
    }
    if (step.follow) el.followPrompt.classList.remove("hidden");
    el.btnNext.classList.remove("hidden");
    el.btnNext.onclick = () => { state.stepIndex++; save(); renderStep(); };
  }

  if (step.type === "choice") {
    el.dialogueText.textContent = step.prompt;
    el.choiceArea.classList.remove("hidden");

    if (step.playVocab) {
      const listenBtn = document.createElement("button");
      listenBtn.className = "speak-btn";
      listenBtn.style.marginBottom = "10px";
      listenBtn.textContent = "🔊 다시 들어보기";
      listenBtn.onclick = () => speak(VOCAB[step.playVocab].hanzi);
      el.choiceArea.appendChild(listenBtn);
      // 처음 진입 시 자동으로 한 번 들려준다
      speak(VOCAB[step.playVocab].hanzi);
    }

    const feedback = document.createElement("div");
    feedback.id = "feedback-msg";

    step.options.forEach((opt) => {
      const b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = opt.label;
      b.onclick = () => {
        if (opt.correct) {
          b.classList.add("correct");
          Array.from(el.choiceArea.querySelectorAll(".choice-btn")).forEach((other) => {
            if (other !== b) other.classList.add("dim");
          });
          feedback.textContent = '🐼 "와! 딱 맞았어!"';
          feedback.className = "ok";
          addStar();
          el.btnNext.classList.remove("hidden");
          el.btnNext.onclick = () => { state.stepIndex++; save(); renderStep(); };
        } else {
          b.classList.add("wrong");
          feedback.textContent = '🐼 "앗! 다시 한번 생각해볼까?"';
          feedback.className = "bad";
          setTimeout(() => b.classList.remove("wrong"), 900);
        }
      };
      el.choiceArea.appendChild(b);
    });
    el.choiceArea.appendChild(feedback);
  }

  if (step.type === "tone") {
    el.dialogueText.textContent = "글자를 눌러서 소리와 뜻을 확인해 보세요. (네 개 모두 눌러보세요!)";
    el.tonePanel.classList.remove("hidden");
    el.tonePanel.innerHTML = "";
    const keys = ["ma1", "ma2", "ma3", "ma4"];
    const doneSet = new Set();

    keys.forEach((k) => {
      const v = VOCAB[k];
      const b = document.createElement("button");
      b.className = "tone-btn";
      b.innerHTML = `<div class="th">${v.hanzi}</div><div class="tp">${v.pinyin}</div><div class="tm">${doneSet.has(k) ? v.meaning : "눌러서 뜻 보기"}</div>`;
      b.onclick = () => {
        speak(v.hanzi);
        if (!doneSet.has(k)) {
          doneSet.add(k);
          addCard(k);
          b.classList.add("done");
          b.querySelector(".tm").textContent = v.meaning;
        }
        if (doneSet.size === keys.length) {
          if (!state._toneStarGiven) { addStar(); state._toneStarGiven = true; }
          el.btnNext.classList.remove("hidden");
        }
      };
      el.tonePanel.appendChild(b);
    });

    el.btnNext.onclick = () => { state.stepIndex++; save(); renderStep(); };
  }
}

/* ---------- 8. 결과 화면 ---------- */
function renderResult() {
  showScreen("result");
  el.resultStars.textContent = "⭐".repeat(Math.min(state.stars, 20)) + ` (${state.stars})`;
  el.resultCards.innerHTML = "";
  state.cards.forEach((key) => el.resultCards.appendChild(makeMiniCard(key)));
}

function makeMiniCard(key) {
  const v = VOCAB[key];
  const card = document.createElement("div");
  card.className = "mini-card";
  card.innerHTML = `<div class="mh">${v.hanzi}</div><div class="mp">${v.pinyin}</div><div class="mm">${v.meaning}</div>`;
  const btn = document.createElement("button");
  btn.textContent = "🔊 듣기";
  btn.onclick = () => speak(v.hanzi);
  card.appendChild(btn);
  return card;
}

/* ---------- 9. 학습 카드 모아보기 모달 ---------- */
function openCardsModal() {
  el.modalCards.innerHTML = "";
  if (state.cards.length === 0) {
    const p = document.createElement("p");
    p.textContent = "아직 배운 표현이 없어요. 탐험을 시작해 보세요!";
    el.modalCards.appendChild(p);
  } else {
    state.cards.forEach((key) => el.modalCards.appendChild(makeMiniCard(key)));
  }
  el.modalOverlay.classList.remove("hidden");
}
el.btnCards.onclick = openCardsModal;
el.btnModalClose.onclick = () => el.modalOverlay.classList.add("hidden");
el.modalOverlay.onclick = (e) => { if (e.target === el.modalOverlay) el.modalOverlay.classList.add("hidden"); };

/* ---------- 10. 시작 / 재시작 ---------- */
function startFresh() {
  state = { stepIndex: 0, stars: 0, cards: [] };
  document.getElementById("star-count").textContent = "0";
  save();
  renderStep();
}

el.btnStart.onclick = () => {
  const resumed = loadSave();
  if (resumed && resumed.stepIndex > 0 && resumed.stepIndex < STEPS.length) {
    state = resumed;
    document.getElementById("star-count").textContent = state.stars;
    renderStep();
  } else {
    startFresh();
  }
};

el.btnRestart.onclick = () => {
  startFresh();
  showScreen("title");
};

/* ---------- 11. 초기화: 이어하기 가능 여부에 따라 타이틀 버튼 문구 변경 ---------- */
(function init() {
  const resumed = loadSave();
  if (resumed && resumed.stepIndex > 0 && resumed.stepIndex < STEPS.length) {
    el.btnStart.textContent = "이어서 탐험하기 ▶";
  } else {
    el.btnStart.textContent = "탐험 시작";
  }
  showScreen("title");
})();
