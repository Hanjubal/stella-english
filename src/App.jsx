import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   스텔라 영어 따라치기 v2
   - 페이지 번호 검색
   - 영어 문장 + 한글 해석 둘 다 보여주고 따라치기
   - 대소문자 무시
   - 코인 + 콤보
   ═══════════════════════════════════════════════════ */

const speak = (text, lang = "en-US") => {
  window.speechSynthesis?.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = 0.75;
  window.speechSynthesis?.speak(u);
};

const norm = s => s.replace(/[.,!?;:'"''""\-—()[\]{}…·]+/g, "").replace(/\s+/g, " ").trim().toLowerCase();

// ═══ 교과서 전체 데이터 — 페이지별 ═══
const PAGES = [
  {
    page: 16, lesson: "Lesson 1", title: "Who Is in Your Heart? (1)",
    lines: [
      { en: "I am Jihun", kr: "나는 지훈이야" },
      { en: "My best friend is Minsu", kr: "나의 가장 친한 친구는 민수야" },
      { en: "Minsu and I love rock music", kr: "민수와 나는 록 음악을 좋아해" },
      { en: "We are members of the school band", kr: "우리는 학교 밴드의 멤버야" },
      { en: "I play the guitar and Minsu plays the drums", kr: "나는 기타를 치고 민수는 드럼을 쳐" },
      { en: "We have so much fun together", kr: "우리는 함께 정말 즐거운 시간을 보내" },
      { en: "With Minsu I laugh all the time", kr: "민수와 함께 있으면 나는 항상 웃어" },
      { en: "Together we are happy", kr: "함께라서 우리는 행복해" },
    ],
  },
  {
    page: 17, lesson: "Lesson 1", title: "Who Is in Your Heart? (2)",
    lines: [
      { en: "My neighbor Mrs. Schmidt is special to me", kr: "이웃인 슈미트 할머니는 나에게 특별해" },
      { en: "She always nods and smiles at me", kr: "그녀는 항상 나에게 고개를 끄덕이고 미소 지어" },
      { en: "When I am sad she bakes a cake for me", kr: "내가 슬플 때 그녀는 나를 위해 케이크를 구워 줘" },
      { en: "With Mrs. Schmidt I feel the magic of kindness", kr: "슈미트 할머니와 함께하면 친절의 마법을 느껴" },
      { en: "Together we are happy", kr: "함께라서 우리는 행복해" },
    ],
  },
  {
    page: 18, lesson: "Lesson 1", title: "Who Is in Your Heart? (3)",
    lines: [
      { en: "Hope is my guide dog and my best friend", kr: "호프는 나의 안내견이자 가장 친한 친구야" },
      { en: "She is always by my side", kr: "그녀는 항상 내 곁에 있어" },
      { en: "She mostly sleeps in class", kr: "그녀는 수업 시간에 대부분 자" },
      { en: "But the teachers don't mind", kr: "하지만 선생님들은 신경 쓰지 않아" },
      { en: "On weekends we go to the park and play together", kr: "주말에 우리는 공원에 가서 함께 놀아" },
      { en: "With Hope I feel free and safe", kr: "호프와 함께 있으면 자유롭고 안전해" },
      { en: "Together we are happy", kr: "함께라서 우리는 행복해" },
    ],
  },
  {
    page: 32, lesson: "Lesson 2", title: "Healthy and Yummy Snacks (1)",
    lines: [
      { en: "Hello everyone", kr: "안녕하세요 여러분" },
      { en: "I am making caprese skewers", kr: "나는 카프레제 꼬치를 만들고 있어" },
      { en: "They are from Italy", kr: "이것들은 이탈리아에서 온 거야" },
      { en: "Anyone can make these", kr: "누구나 이것을 만들 수 있어" },
      { en: "They are low in calories", kr: "칼로리가 낮아" },
      { en: "They will become healthy snacks", kr: "이것들은 건강한 간식이 될 거야" },
    ],
  },
  {
    page: 33, lesson: "Lesson 2", title: "Healthy and Yummy Snacks (2)",
    lines: [
      { en: "Unlike other chips my tofu chips are healthy", kr: "다른 칩과 달리 내 두부 칩은 건강해" },
      { en: "I don't fry my chips but bake them", kr: "나는 칩을 튀기지 않고 구워" },
      { en: "I don't use any flour", kr: "나는 밀가루를 전혀 사용하지 않아" },
      { en: "They are crispy and delicious", kr: "바삭하고 맛있어" },
      { en: "Try them and you will love them", kr: "한번 먹어 봐 좋아하게 될 거야" },
    ],
  },
  {
    page: 34, lesson: "Lesson 2", title: "Healthy and Yummy Snacks (3)",
    lines: [
      { en: "Hello everyone I am Miguel from Brazil", kr: "안녕하세요 여러분 나는 브라질에서 온 미겔이야" },
      { en: "I am making an acai bowl right now", kr: "나는 지금 아사이 볼을 만들고 있어" },
      { en: "It is a thick acai berry smoothie in a bowl", kr: "그릇에 담긴 걸쭉한 아사이 베리 스무디야" },
      { en: "You can add other healthy foods like nuts and bananas", kr: "견과류와 바나나 같은 건강한 음식을 추가할 수 있어" },
      { en: "Acai berries are a superfood", kr: "아사이 베리는 슈퍼푸드야" },
    ],
  },
  {
    page: 48, lesson: "Lesson 3", title: "Different Attitudes (도입)",
    lines: [
      { en: "The school dance contest is next month", kr: "학교 댄스 대회가 다음 달이야" },
      { en: "Let's enter the dance contest", kr: "댄스 대회에 참가하자" },
      { en: "Are you kidding", kr: "농담이야" },
      { en: "We are all terrible dancers", kr: "우리는 모두 춤을 못 춰" },
    ],
  },
  {
    page: 49, lesson: "Lesson 3", title: "Different Attitudes (부정적 상황)",
    lines: [
      { en: "We are making too many mistakes", kr: "우리는 실수를 너무 많이 하고 있어" },
      { en: "We are hopeless", kr: "우리는 가망이 없어" },
      { en: "By the way where is Minsu", kr: "그런데 민수는 어디 있어" },
      { en: "He is sick", kr: "그는 아파" },
      { en: "I saw him last night and he was all right", kr: "어젯밤에 그를 봤는데 멀쩡했어" },
      { en: "I am so tired", kr: "나는 너무 피곤해" },
      { en: "We are not getting anywhere", kr: "우리는 전혀 나아지지 않고 있어" },
      { en: "We are just wasting our time", kr: "우리는 그냥 시간을 낭비하고 있어" },
      { en: "Why don't we just quit", kr: "그냥 그만두는 게 어때" },
    ],
  },
  {
    page: 50, lesson: "Lesson 3", title: "Different Attitudes (긍정적 상황)",
    lines: [
      { en: "Yuna and her teammates are practicing hard in the practice room", kr: "유나와 팀원들이 연습실에서 열심히 연습하고 있다" },
      { en: "I made a mistake again", kr: "또 실수했어" },
      { en: "I am sorry", kr: "미안해" },
      { en: "Cheer up you can do it", kr: "힘내 너는 할 수 있어" },
      { en: "Don't worry we all make mistakes", kr: "걱정 마 우리 모두 실수해" },
      { en: "Come on let's do it one more time", kr: "자 한 번 더 하자" },
      { en: "We are almost there", kr: "거의 다 됐어" },
      { en: "The contest is over now", kr: "대회가 이제 끝났다" },
      { en: "Good job we made it", kr: "잘했어 우리가 해냈어" },
      { en: "We finished the dance without a big mistake", kr: "큰 실수 없이 춤을 끝냈어" },
      { en: "I feel great", kr: "기분이 최고야" },
      { en: "We did our best and I am so proud of all of us", kr: "우리는 최선을 다했고 나는 우리 모두가 자랑스러워" },
      { en: "Thank you for your support everyone", kr: "모두 응원해 줘서 고마워" },
    ],
  },
  {
    page: 64, lesson: "Lesson 4", title: "The Colorful Villages (1) — Banwol Island",
    lines: [
      { en: "What are you going to do this summer", kr: "이번 여름에 뭐 할 거야" },
      { en: "I am going to take swimming lessons", kr: "나는 수영 강습을 받을 거야" },
      { en: "I am looking forward to it", kr: "나는 그것을 기대하고 있어" },
      { en: "The island is purple", kr: "그 섬은 보라색이야" },
      { en: "The bridges and roofs are all purple", kr: "다리와 지붕이 모두 보라색이야" },
      { en: "Visitors can explore it on foot", kr: "방문객들은 걸어서 탐험할 수 있어" },
    ],
  },
  {
    page: 65, lesson: "Lesson 4", title: "The Colorful Villages (2) — Ronda",
    lines: [
      { en: "Yesterday my family and I came to Ronda in Spain", kr: "어제 우리 가족과 나는 스페인의 론다에 왔어" },
      { en: "Most buildings here are white", kr: "이곳의 대부분의 건물들은 하얀색이야" },
      { en: "They are so beautiful against the blue sky", kr: "파란 하늘을 배경으로 정말 아름다워" },
      { en: "Ronda is on cliffs so the views are fantastic", kr: "론다는 절벽 위에 있어서 경치가 환상적이야" },
      { en: "All the food here is great", kr: "이곳의 모든 음식이 훌륭해" },
      { en: "I especially like the churros", kr: "나는 특히 추로스를 좋아해" },
    ],
  },
  {
    page: 67, lesson: "Lesson 4", title: "The Colorful Villages (3) — Chefchaouen",
    lines: [
      { en: "I am in Chefchaouen the Blue Pearl of Morocco", kr: "나는 모로코의 푸른 진주 쉐프샤우엔에 있어" },
      { en: "I enjoyed taking pictures of the blue streets", kr: "나는 파란 거리의 사진 찍는 것을 즐겼어" },
      { en: "I also enjoyed walking through the narrow streets", kr: "좁은 거리를 걷는 것도 즐겼어" },
      { en: "They were full of interesting shops", kr: "흥미로운 가게들로 가득했어" },
      { en: "I bought some souvenirs", kr: "기념품을 몇 개 샀어" },
      { en: "Now I am drinking mint tea at a tea house", kr: "지금 나는 찻집에서 민트차를 마시고 있어" },
      { en: "Tomorrow I am going to get up early", kr: "내일 나는 일찍 일어날 거야" },
      { en: "I am going to enjoy a beautiful sunrise", kr: "아름다운 일출을 즐길 거야" },
    ],
  },
  {
    page: 80, lesson: "Lesson 5", title: "Who Threw a Cake at the Mona Lisa?",
    lines: [
      { en: "A man threw a cake at the Mona Lisa", kr: "한 남자가 모나리자에 케이크를 던졌어" },
      { en: "The painting was not damaged", kr: "그 그림은 손상되지 않았어" },
      { en: "The Mona Lisa is behind glass", kr: "모나리자는 유리 뒤에 있어" },
      { en: "Think like Sherlock Holmes", kr: "셜록 홈즈처럼 생각해 봐" },
      { en: "Look at the clues carefully", kr: "단서를 주의 깊게 살펴봐" },
      { en: "Who is the suspect", kr: "용의자가 누구야" },
    ],
  },
  {
    page: 96, lesson: "Lesson 6", title: "Join the Zero-Waste Challenge",
    lines: [
      { en: "We produce too much trash every day", kr: "우리는 매일 너무 많은 쓰레기를 만들어" },
      { en: "Join the zero-waste challenge", kr: "제로 웨이스트 챌린지에 참여해" },
      { en: "Use a reusable bottle instead of plastic", kr: "플라스틱 대신 재사용 가능한 병을 사용해" },
      { en: "Bring your own bag when you go shopping", kr: "쇼핑할 때 자신의 가방을 가져가" },
      { en: "Small changes can make a big difference", kr: "작은 변화가 큰 차이를 만들 수 있어" },
      { en: "It is good for the earth and good for us", kr: "그것은 지구에도 좋고 우리에게도 좋아" },
    ],
  },
  {
    page: 112, lesson: "Lesson 7", title: "Let's Make a Movie!",
    lines: [
      { en: "A lot of people are working hard to create this movie", kr: "많은 사람들이 이 영화를 만들기 위해 열심히 일하고 있어" },
      { en: "The director tells the actors what to do", kr: "감독은 배우들에게 무엇을 할지 알려줘" },
      { en: "Find your dream and follow it", kr: "너의 꿈을 찾고 그것을 따라가" },
      { en: "Everyone has a special talent", kr: "모든 사람은 특별한 재능이 있어" },
      { en: "What do you want to be in the future", kr: "너는 미래에 뭐가 되고 싶어" },
    ],
  },
  {
    page: 128, lesson: "Lesson 8", title: "Goldilocks Learns Her Lesson",
    lines: [
      { en: "People didn't give Goldilocks many likes", kr: "사람들은 골디락스에게 좋아요를 많이 주지 않았어" },
      { en: "It was getting dark and it started to rain", kr: "어두워지고 있었고 비가 내리기 시작했어" },
      { en: "She found a small house in the forest", kr: "그녀는 숲에서 작은 집을 발견했어" },
      { en: "This porridge is too hot", kr: "이 죽은 너무 뜨거워" },
      { en: "This bed is too hard", kr: "이 침대는 너무 딱딱해" },
      { en: "Be smart online", kr: "온라인에서 현명하게 행동해" },
      { en: "Think before you post", kr: "게시하기 전에 생각해" },
    ],
  },
];

const C = {
  bg: "#0a0e1a", card: "#111827", cardL: "#1a2235",
  ok: "#4ade80", no: "#f87171",
  txt: "#e2e8f0", dim: "#94a3b8", mute: "#64748b",
  bdr: "rgba(255,255,255,0.06)",
  en: "#60a5fa", enBg: "rgba(96,165,250,0.08)",
  gold: "#fbbf24", goldBg: "rgba(251,191,36,0.1)",
  combo: "#c084fc", kr: "#6ee7b7",
};
const F = "'Pretendard Variable','Noto Sans KR',system-ui,sans-serif";

export default function App() {
  const [phase, setPhase] = useState(0);
  const [pi, setPi] = useState(0);
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [comp, setComp] = useState(false);
  const [fb, setFb] = useState(null);
  const [coin, setCoin] = useState(() => {
    try { return parseInt(localStorage.getItem("stella_coin")) || 0; } catch { return 0; }
  });
  const [totalSentences, setTotalSentences] = useState(() => {
    try { return parseInt(localStorage.getItem("stella_total")) || 0; } catch { return 0; }
  });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState("");
  const [showCoinAnim, setShowCoinAnim] = useState(null);
  const ref = useRef(null);
  const searchRef = useRef(null);

  // 코인 & 총 문장 수 저장
  useEffect(() => {
    try { localStorage.setItem("stella_coin", String(coin)); } catch {}
  }, [coin]);
  useEffect(() => {
    try { localStorage.setItem("stella_total", String(totalSentences)); } catch {}
  }, [totalSentences]);

  const pg = PAGES[pi];
  const cur = pg?.lines?.[idx] || { en: "", kr: "" };

  useEffect(() => { ref.current?.focus(); }, [phase, idx, step, fb]);

  // 자동 발음 — 영어 문장 나올 때
  useEffect(() => {
    if (phase === 1 && step === 0 && cur.en) {
      setTimeout(() => speak(cur.en, "en-US"), 300);
    }
  }, [phase, idx]);

  const reset = () => {
    setIdx(0); setStep(0); setTyped(""); setFb(null);
    setCombo(0); setMaxCombo(0); setScore(0); setErrors([]);
  };

  const addCoin = (amt) => {
    setCoin(c => c + amt);
    setShowCoinAnim(amt);
    setTimeout(() => setShowCoinAnim(null), 800);
  };

  const submit = () => {
    if (comp) return;
    const t = typed.trim(); if (!t) return;
    const target = step === 0 ? cur.en : cur.kr;
    const ok = norm(t) === norm(target);

    if (ok) {
      setScore(s => s + 1);
      setTotalSentences(t => t + 1);
      setCombo(c => { const nc = c + 1; if (nc > maxCombo) setMaxCombo(nc); return nc; });
      const bonus = combo >= 4 ? 50 : 0;
      addCoin(100 + bonus);
      setFb({ ok: true, msg: combo >= 4 ? `${combo + 1} 콤보! +${100 + bonus}🪙` : `+100🪙` });
    } else {
      setCombo(0);
      if (step === 1) setErrors(e => [...e, { en: cur.en, kr: cur.kr, typed: t }]);
      setFb({ ok: false, msg: target });
    }

    setTimeout(() => {
      setFb(null); setTyped("");
      if (step === 0) {
        setStep(1);
      } else {
        setStep(0);
        if (idx + 1 < pg.lines.length) setIdx(idx + 1);
        else {
          if (score + (ok ? 1 : 0) === pg.lines.length * 2) addCoin(50);
          setPhase(2);
        }
      }
    }, 900);
  };

  // 페이지 검색
  const filteredPages = search.trim()
    ? PAGES.filter(p => String(p.page).includes(search.trim()) || p.title.toLowerCase().includes(search.trim().toLowerCase()) || p.lesson.toLowerCase().includes(search.trim().toLowerCase()))
    : PAGES;

  // 스타일
  const box = { maxWidth: 520, margin: "0 auto", minHeight: "100dvh", display: "flex", flexDirection: "column", fontFamily: F, background: C.bg, color: C.txt };
  const iStyle = {
    width: "100%", boxSizing: "border-box", background: C.cardL,
    border: `1.5px solid ${fb ? (fb.ok ? C.ok : C.no) : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "14px 16px", fontSize: 17, fontFamily: F, color: C.txt, outline: "none",
  };

  // 레벨 계산
  const getLevel = () => {
    if (totalSentences >= 500) return { name: "영어 마스터", emoji: "👑", next: null };
    if (totalSentences >= 300) return { name: "영어 박사", emoji: "🎓", next: 500 };
    if (totalSentences >= 150) return { name: "번개 타자", emoji: "⚡", next: 300 };
    if (totalSentences >= 80) return { name: "타자 고수", emoji: "🔥", next: 150 };
    if (totalSentences >= 30) return { name: "열심 학생", emoji: "📚", next: 80 };
    if (totalSentences >= 10) return { name: "타자 견습생", emoji: "✏️", next: 30 };
    return { name: "초보 타자", emoji: "🐣", next: 10 };
  };
  const level = getLevel();

  // ═══ 목록 ═══
  if (phase === 0) return (
    <div style={box}>
      <style>{`@keyframes fadeUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}`}</style>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.bdr}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 3, color: C.mute }}>STELLA ENGLISH</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>영어 따라치기</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 16 }}>🪙</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>{coin}</span>
          </div>
        </div>

        {/* 스텔라 상태창 */}
        <div style={{
          background: C.card, borderRadius: 14, padding: "16px 18px", marginBottom: 12,
          border: `1px solid ${C.bdr}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24 }}>{level.emoji}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>스텔라</div>
                <div style={{ fontSize: 12, color: C.en, fontWeight: 600 }}>{level.name}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>🪙 {coin.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.dim }}>
            <div>✅ 완료 <span style={{ color: C.ok, fontWeight: 700 }}>{totalSentences}</span>문장</div>
            {level.next && <div>다음 레벨까지 <span style={{ color: C.en, fontWeight: 700 }}>{level.next - totalSentences}</span>문장</div>}
          </div>
          {level.next && (
            <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
              <div style={{ height: "100%", borderRadius: 2, background: C.en, width: `${Math.min(100, (totalSentences / level.next) * 100)}%`, transition: "width 0.3s" }} />
            </div>
          )}
        </div>

        <input
          ref={searchRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 페이지 번호 또는 제목 검색 (예: 50)"
          style={{
            width: "100%", boxSizing: "border-box", background: C.cardL,
            border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10,
            padding: "10px 14px", fontSize: 14, fontFamily: F, color: C.txt, outline: "none",
          }}
        />
      </div>
      <div style={{ flex: 1, padding: "12px 20px", overflowY: "auto" }}>
        {filteredPages.length === 0 && (
          <div style={{ textAlign: "center", color: C.mute, padding: 40, fontSize: 14 }}>해당 페이지가 없어요</div>
        )}
        {filteredPages.map((p, i) => {
          const ri = PAGES.indexOf(p);
          return (
            <button key={p.page + p.title} onClick={() => { setPi(ri); reset(); setPhase(1); }} style={{
              background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14,
              padding: "14px 18px", cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ background: C.enBg, border: `1px solid ${C.en}33`, borderRadius: 6, padding: "2px 8px", fontSize: 12, color: C.en, fontWeight: 700 }}>p.{p.page}</div>
                  <div style={{ fontSize: 11, color: C.mute }}>{p.lesson}</div>
                </div>
                <div style={{ fontSize: 11, color: C.dim }}>{p.lines.length}문장</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.txt, marginTop: 6 }}>{p.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ═══ 진행 ═══
  if (phase === 1) return (
    <div style={box}>
      <style>{`@keyframes fadeUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}`}</style>
      {/* 헤더 */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.bdr}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => { setPhase(0); reset(); }} style={{ background: "none", border: "none", color: C.dim, fontSize: 13, cursor: "pointer", fontFamily: F }}>← 목록</button>
        <div style={{ fontSize: 12, color: C.en, fontWeight: 600 }}>p.{pg.page} · {step === 0 ? "🇺🇸 영어" : "🇰🇷 한글"}</div>
        <div style={{ fontSize: 12, color: C.dim }}>{idx + 1}/{pg.lines.length}</div>
      </div>
      {/* 코인바 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 20px", background: "rgba(251,191,36,0.04)", borderBottom: `1px solid ${C.bdr}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 14 }}>🪙</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{coin}</span>
          {showCoinAnim && <span style={{ fontSize: 12, color: C.ok, fontWeight: 700, animation: "fadeUp 0.8s ease-out forwards" }}>+{showCoinAnim}</span>}
        </div>
        {combo > 0 && <div style={{ fontSize: 12, color: C.combo, fontWeight: 700 }}>🔥 {combo} 콤보{combo >= 5 ? "!!" : combo >= 3 ? "!" : ""}</div>}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20, justifyContent: "center" }}>
        {/* 진행 dots */}
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 16 }}>
          {Array.from({ length: pg.lines.length }, (_, i) => (
            <div key={i} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, background: i <= idx ? C.en : "rgba(255,255,255,0.08)", opacity: i < idx ? 0.4 : 1 }} />
          ))}
        </div>

        {/* 문장 카드 — 영어 + 한글 둘 다 보여줌 */}
        <div style={{ background: C.card, borderRadius: 16, padding: "24px", marginBottom: 16, border: `1px solid ${C.bdr}` }}>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.7, color: C.en, marginBottom: 10 }}>{cur.en}</div>
          <div style={{ fontSize: 15, color: C.kr, lineHeight: 1.6 }}>{cur.kr}</div>
          <button onClick={() => speak(cur.en, "en-US")} style={{
            background: C.enBg, border: `1px solid ${C.en}33`, borderRadius: 8,
            padding: "5px 14px", cursor: "pointer", marginTop: 12, fontSize: 12, color: C.en, fontFamily: F,
          }}>🔊 한번 더 듣기</button>
        </div>

        {/* 지금 뭘 쳐야 하는지 안내 */}
        <div style={{ fontSize: 12, color: step === 0 ? C.en : C.kr, fontWeight: 600, marginBottom: 6, textAlign: "center" }}>
          {step === 0 ? "👆 영어 문장을 그대로 치세요" : "👆 한글 해석을 그대로 치세요"}
        </div>

        {/* 입력 */}
        <input ref={ref} value={typed} onChange={e => setTyped(e.target.value)}
          onCompositionStart={() => setComp(true)} onCompositionEnd={e => { setComp(false); setTyped(e.target.value); }}
          onKeyDown={e => { if (e.key === "Enter" && !comp) submit(); }}
          placeholder={step === 0 ? "영어를 치세요" : "한글을 치세요"}
          style={iStyle} autoComplete="off" spellCheck={false} />

        {fb && (
          <div style={{
            marginTop: 10, padding: "10px 14px", borderRadius: 10, textAlign: "center",
            background: fb.ok ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.08)",
            color: fb.ok ? C.ok : C.no, fontSize: 14, fontWeight: 600,
          }}>
            {fb.ok ? "✓ " : "정답: "}{fb.msg}
          </div>
        )}
        {!fb && (
          <button onClick={submit} style={{
            background: typed.trim() ? C.enBg : "transparent",
            border: `1.5px solid ${C.en}`, borderRadius: 10,
            color: C.en, padding: "11px 20px", fontSize: 14, fontFamily: F, cursor: "pointer", fontWeight: 600,
            width: "100%", marginTop: 12,
          }}>확인</button>
        )}

        {/* 실시간 비교 */}
        {typed.length > 0 && !fb && (
          <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, wordBreak: "break-all" }}>
            {[...(step === 0 ? cur.en : cur.kr)].map((ch, i) => {
              const tc = [...typed][i];
              const chL = ch.toLowerCase();
              const tcL = tc?.toLowerCase();
              return <span key={i} style={{ color: tc == null ? C.mute : tcL === chL ? C.ok : C.no, fontWeight: tc && tcL !== chL ? 700 : 400 }}>{ch}</span>;
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ═══ 결과 ═══
  if (phase === 2) {
    const total = pg.lines.length * 2;
    const pct = Math.round((score / total) * 100);
    return (
      <div style={box}>
        <style>{`@keyframes fadeUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}`}</style>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 24px", justifyContent: "center" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48 }}>{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.en }}>{pct}점</div>
            <div style={{ fontSize: 14, color: C.dim, marginTop: 4 }}>p.{pg.page} · {pg.title}</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[
              { l: "정답", v: `${score}/${total}`, c: C.ok },
              { l: "최대콤보", v: `${maxCombo}🔥`, c: C.combo },
            ].map(s => (
              <div key={s.l} style={{ flex: 1, background: C.card, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.bdr}` }}>
                <div style={{ fontSize: 11, color: C.mute, marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          {pct === 100 && (
            <div style={{ textAlign: "center", padding: "10px", background: C.goldBg, borderRadius: 10, marginBottom: 14, fontSize: 14, color: C.gold, fontWeight: 600 }}>🏆 만점 보너스 +50🪙</div>
          )}

          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span style={{ fontSize: 18 }}>🪙</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: C.gold, marginLeft: 6 }}>{coin}</span>
          </div>

          {errors.length > 0 && (
            <div style={{ marginBottom: 16, maxHeight: 180, overflowY: "auto" }}>
              <div style={{ fontSize: 12, color: C.no, fontWeight: 600, marginBottom: 6 }}>틀린 것 다시 보기</div>
              {errors.map((e, i) => (
                <div key={i} style={{ background: C.card, borderRadius: 10, padding: "10px 14px", marginBottom: 5, border: `1px solid ${C.bdr}` }}>
                  <div style={{ fontSize: 13, color: C.en }}>{e.en}</div>
                  <div style={{ fontSize: 12, color: C.ok }}>✓ {e.kr}</div>
                  <div style={{ fontSize: 12, color: C.no }}>✗ {e.typed}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { reset(); setPhase(1); }} style={{
              flex: 1, background: "transparent", border: `1.5px solid ${C.en}`, borderRadius: 10,
              color: C.en, padding: "11px", fontSize: 14, fontFamily: F, cursor: "pointer", fontWeight: 600,
            }}>다시 하기</button>
            <button onClick={() => { setPhase(0); reset(); }} style={{
              flex: 1, background: "transparent", border: `1.5px solid ${C.dim}`, borderRadius: 10,
              color: C.dim, padding: "11px", fontSize: 14, fontFamily: F, cursor: "pointer", fontWeight: 600,
            }}>다른 페이지</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
