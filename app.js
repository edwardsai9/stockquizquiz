/* ==========================================================================
   INTERACTIVE STOCK STRATEGY QUIZ: CORE APPLICATION LOGIC (i18n Compliant)
   ========================================================================== */

// ── 1. QUIZ DATA STRUCTURE (10 QUESTIONS & 5 OUTCOMES) ──

const questions = [
  {
    badge: "維度一：看盤頻率與心力",
    text: "當你開立股票帳戶後，你預期每天會花多少時間關注市場動態與看盤？",
    hint: "提示：指您主動研究投資的時間，非一般瀏覽財經新聞或工作必要時間。",
    options: [
      { label: "幾乎不看盤，設定自動扣款或每季檢查一次即可", score: 0 },
      { label: "每天收盤後花 10-15 分鐘看一次帳戶與配息公告", score: 1 },
      { label: "每天花 1-2 小時研讀財報、產業新聞與個股動態", score: 2 },
      { label: "盤中密切盯盤，隨時注意五檔報價與即時技術線圖", score: 3 }
    ]
  },
  {
    badge: "維度二：極端行情應對",
    text: "若你持有的核心持股因市場非理性崩盤大跌 20%，你的第一反應是？",
    hint: "提示：誠實面對內心的第一反應，而非書本上的教科書答案。",
    options: [
      { label: "無感或維持原本作法，相信大盤長期而言必會重回成長軌跡", score: 0 },
      { label: "只要公司配息政策沒變、跌倒就繼續穩健領息，甚至有些開心", score: 1 },
      { label: "重新評估公司內在價值，若基本面沒變，視為難得的「大打折」加碼點", score: 2 },
      { label: "立即出清以規避資金進一步失血，等底部訊號明確再買回來", score: 3 }
    ]
  },
  {
    badge: "維度三：股票篩選準則",
    text: "在挑選一檔個股時，你最看重的核心指標或評估依據是？",
    hint: "提示：哪一項特質在你的投資拼圖中排在第一順位？",
    options: [
      { label: "大盤指數代表性與低管理費，越貼近市場整體表現越好", score: 0 },
      { label: "歷史配息穩定度、現金殖利率，以及自由現金流是否豐沛", score: 1 },
      { label: "本益比、股價淨值比、ROE，以及未來是否有長期的「商業護城河」", score: 2 },
      { label: "成交量、均線多頭排列、突破型態，以及法人或主力籌碼動向", score: 3 }
    ]
  },
  {
    badge: "維度四：獲利預期與目標",
    text: "你對股票投資的預期年化報酬率與理想的獲利模式是？",
    hint: "提示：平衡風險與回報後，最讓你感到踏實的利潤模式。",
    options: [
      { label: "追求與市場大盤同步的長期平均報酬（年化約 7-10%）", score: 0 },
      { label: "追求穩定且可預測的現金股息流入，打造被動收入（年化約 5-8%）", score: 1 },
      { label: "透過深度研究挖掘被低估的優質公司，獲取倍數資本利得", score: 2 },
      { label: "利用市場波動進行積極的價差交易，追求短時間內的高額波段回報", score: 3 }
    ]
  },
  {
    badge: "維度五：資產配置集中度",
    text: "你傾向如何配置你的股票投資組合？",
    hint: "提示：資產分散程度與你的睡眠品質高度相關。",
    options: [
      { label: "全球或全市場分散，持股成百上千，幾乎不集中在單一企業上", score: 0 },
      { label: "集中在 5-10 檔獲利穩健、高殖利率的大型權值股上", score: 1 },
      { label: "嚴選 3-5 檔具有極高安全邊際與核心優勢的卓越企業，重倉長期持有", score: 2 },
      { label: "根據當下熱門題材與強勢技術型態，靈活快速調配持股比例與個股", score: 3 }
    ]
  },
  {
    badge: "維度六：擊敗市場之信念",
    text: "你如何看待「一般個人投資人是否能持續擊敗大盤」？",
    hint: "提示：這決定了你將採取被動跟隨，還是主動獵殺的姿態。",
    options: [
      { label: "市場極其有效率，主動選股多是徒勞，被動跟隨全市場才是最優解", score: 0 },
      { label: "擊不擊敗大盤並不重要，拿到安全且持續的配息現金流才最實在", score: 1 },
      { label: "市場經常因群體情緒波動而價格失真，理性的個人研究能挖掘超額報酬", score: 2 },
      { label: "市場充斥著趨勢與慣性，只要順應動能、嚴紀律進出，便能賺取暴利", score: 3 }
    ]
  },
  {
    badge: "維度七：資訊研讀取向",
    text: "你平時最常研讀、關注或參考的財經投資資訊是？",
    hint: "提示：你吸收知識的偏好透露了你的決策邏輯。",
    options: [
      { label: "很少主動關注特定個股資訊，主要閱讀資產配置與被動指數投資書籍", score: 0 },
      { label: "關注除權息日程、財務穩定性報告與高股息 ETF 成分股的季度變動", score: 1 },
      { label: "鑽研公司年報、法說會簡報、產業鏈上下游關係與競爭對手財務數據", score: 2 },
      { label: "分析 K 線圖、均線排列、RSI/MACD 技術指標，以及每天的籌碼報表", score: 3 }
    ]
  },
  {
    badge: "維度八：交易決策歷程",
    text: "從你注意到一檔股票，到你真正下單買入，通常需要經歷多久的歷程？",
    hint: "提示：反映出你的理性克制力與執行敏捷度。",
    options: [
      { label: "早就設定好定期定額或系統化自動扣款計畫，完全不需要手動做買入決策", score: 0 },
      { label: "會觀察幾週，分析利差與合理殖利率，等股價來到相對低點的甜甜價再出手", score: 1 },
      { label: "耗費數週甚至數月進行嚴謹的研究、估值與推論，直到安全邊際充足才買入", score: 2 },
      { label: "一旦看到量能突增、型態突破，幾分鐘甚至幾秒鐘內就能果斷決定跟進", score: 3 }
    ]
  },
  {
    badge: "維度九：槓桿與衍生工具",
    text: "對於「融資、期權、期貨或高波動的槓桿工具」，你的基本態度是？",
    hint: "提示：槓桿是毒藥還是加速器，取決於你的風險控制能力。",
    options: [
      { label: "絕對不碰，投資應該是穩健且長期分散風險的，槓桿只會引來毀滅", score: 0 },
      { label: "避開這些高風險工具，寧可選擇波動極低、甚至有些無聊的防守型股票", score: 1 },
      { label: "了解這些工具的原理但極少使用，堅持以現股買入具有長線成長的標的", score: 2 },
      { label: "視為提高資金效率的利器，在機會明朗、勝率極高時會善用槓桿加速獲利", score: 3 }
    ]
  },
  {
    badge: "維度十：獲利之樂趣來源",
    text: "在股票投資的過程中，哪件事能帶給你最大的成就感與樂趣？",
    hint: "提示：每個人在市場中追尋的核心價值都大不相同。",
    options: [
      { label: "帳戶隨著時間與複利悄悄穩健成長，完全不耗費心力的心安感", score: 0 },
      { label: "每季或每年收到厚實的股息簡訊，直接轉化為自由支配的被動收入", score: 1 },
      { label: "驗證了自己的獨立思考，買進的冷門優質股終於被市場發現而暴漲的喜悅", score: 2 },
      { label: "精準判斷趨勢拐點，快進快出成功獲利，享受博弈般極致執行的快感", score: 3 }
    ]
  }
];

const results = [
  { min: 0, max: 6, type: "passive" },
  { min: 7, max: 12, type: "dividend" },
  { min: 13, max: 19, type: "value" },
  { min: 20, max: 25, type: "momentum" },
  { min: 26, max: 30, type: "short" }
];

// Initialize Traditional Chinese questions on load
if (window.__i18n && window.__i18n.questions) {
  window.__i18n.questions['zh-TW'] = questions;
}

// ── 2. STATE VARIABLES ──

let currentQ = 0;
let answers = new Array(questions.length).fill(null);
let _saving = false; // screenshot loading lock

// ── 3. INTRO INITIALIZATION ──

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  startCounterAnimation();
});

// Subtle gold sparks backgrounds generator
function initParticles() {
  const container = document.getElementById("bg-particles");
  if (!container) return;
  
  const sparkleCount = 25;
  for (let i = 0; i < sparkleCount; i++) {
    const star = document.createElement("div");
    star.className = "sparkle";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDuration = (4 + Math.random() * 8) + "s";
    star.style.animationDelay = Math.random() * 6 + "s";
    container.appendChild(star);
  }
}

// Stats Counter animation
function startCounterAnimation() {
  const counterEl = document.getElementById("page-counter");
  if (!counterEl) return;
  
  let currentVal = 14205;
  setInterval(() => {
    currentVal += Math.floor(Math.random() * 3) + 1;
    counterEl.textContent = currentVal.toLocaleString() + "+";
  }, 3500);
}

// ── 4. SCREEN SWITCHER ──

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + name).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── 5. QUIZ FLOW CONTROL ──

function startQuiz() {
  showScreen("quiz");
  renderQuestion(0);
  
  // GTM dataLayer: Track Quiz Start
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'quiz_start',
    language: window.__lang || 'zh-TW'
  });
}

function renderQuestion(idx) {
  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  const q = _qs[idx];
  currentQ = idx;

  // Render question text, badge and progress details
  const _ui = window.__i18n && window.__i18n.ui[window.__lang];
  document.getElementById("q-count").textContent = _ui ? _ui.q_count(idx + 1, _qs.length) : `第 ${idx + 1} 題，共 ${_qs.length} 題`;
  
  const pct = Math.round((idx / _qs.length) * 100);
  document.getElementById("q-pct").textContent = `${pct}%`;
  document.getElementById("progress-fill").style.width = pct + "%";

  document.getElementById("q-badge").textContent = q.badge;
  document.getElementById("q-illust").src = `q${idx + 1}.png`;
  document.getElementById("q-text").textContent = q.text;
  document.getElementById("q-hint").textContent = q.hint;

  // Render dynamic option buttons
  const wrap = document.getElementById("options-wrap");
  wrap.innerHTML = "";
  const labels = ["A", "B", "C", "D"];
  
  q.options.forEach((opt, oi) => {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (answers[idx] === oi ? " selected" : "");
    btn.innerHTML = `<span class="opt-label">${labels[oi]}</span><span>${opt.label}</span>`;
    btn.onclick = () => selectOption(oi);
    wrap.appendChild(btn);
  });

  // Toggle prev button state
  document.getElementById("btn-prev").disabled = idx === 0;

  // Trigger entering fadeUp card animation
  const card = document.getElementById("question-card");
  card.style.animation = "none";
  card.offsetHeight; // Force reflow
  card.style.animation = "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards";
}

function selectOption(oi) {
  answers[currentQ] = oi;
  
  // GTM dataLayer: Track Question Answered
  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'quiz_answer',
    question_index: currentQ + 1,
    selected_option: oi, // 0: A, 1: B, 2: C, 3: D
    selected_text: _qs[currentQ].options[oi].label,
    dimension: _qs[currentQ].badge
  });
  
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach((btn, i) => {
    btn.classList.toggle("selected", i === oi);
  });

  // Auto advance with 450ms delay for feedback
  setTimeout(() => {
    const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
    if (currentQ < _qs.length - 1) {
      renderQuestion(currentQ + 1);
    } else {
      document.getElementById("progress-fill").style.width = "100%";
      document.getElementById("q-pct").textContent = "100%";
      setTimeout(showResult, 200);
    }
  }, 450);
}

function prevQ() {
  if (currentQ > 0) {
    renderQuestion(currentQ - 1);
  }
}

// ── 6. COMPUTING RESULTS & RADAR DRAWING ──

function showResult() {
  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  
  // 1. Calculate aggregate score
  let totalScore = 0;
  answers.forEach((ai, qi) => {
    if (ai !== null) {
      totalScore += _qs[qi].options[ai].score;
    }
  });

  // 2. Identify corresponding result type
  const target = results.find(r => totalScore >= r.min && totalScore <= r.max) || results[results.length - 1];

  // Set card visual type for styled border glowing
  const card = document.getElementById("result-card");
  card.setAttribute("data-type", target.type);

  // 3. Render result card details dynamically based on language
  renderResult(target.type);

  // 4. Switch Screen
  showScreen("result");

  // GTM dataLayer: Track Quiz Completion and Results
  const res = window.__getResult(target.type);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'quiz_complete',
    total_score: totalScore,
    result_type: target.type, // passive, dividend, value, momentum, short
    result_title: res ? res.title : '',
    result_fit: res ? res.fit : ''
  });

  // 5. Spawn Interstitial Ad after 3s (Compliant with game-ads SKILL)
  setTimeout(() => {
    showAdInterstitial();
  }, 3000);
}

// Separate Render Result function to support multi-language live changes
function renderResult(resKey) {
  window.__pendingResultKey = resKey;
  const res = window.__getResult(resKey);
  if (!res) return;

  // Inject localized texts into card
  document.getElementById("res-title").textContent = res.title;
  document.getElementById("res-tagline").textContent = res.tagline;
  document.getElementById("res-fit").textContent = res.fit;
  document.getElementById("res-vol").textContent = res.vol;
  document.getElementById("res-desc").textContent = res.desc;
  document.getElementById("res-strength").textContent = res.strength;
  document.getElementById("res-weakness").textContent = res.weakness;
  document.getElementById("res-allocation").textContent = res.allocation;

  // Redraw canvas radar chart dynamically
  setTimeout(() => {
    drawRadar(res.scores);
  }, 50);
}

// Custom Premium Radar drawing on Canvas
function drawRadar(scores) {
  const canvas = document.getElementById("radar-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  const size = 360; // Logical resolution of 360px for premium high-density display
  canvas.width = size * 2;
  canvas.height = size * 2;
  // Removed dynamic style width/height overrides to let responsive CSS (width: 100%) scale it naturally
  ctx.scale(2, 2);

  const cx = size / 2;
  const cy = size / 2 + 6; // Center slightly adjusted to prevent top text clipping
  const maxR = size / 2 - 64; // Safe 64px padding to guarantee textAlign "center" fits perfectly in 360px logical bounds
  
  const isEn = window.__lang === "en";
  const labels = [
    { text: isEn ? "Fund (FUD)" : "基本面 (FUD)" },
    { text: isEn ? "Speed (SPD)" : "執行速度 (SPD)" },
    { text: isEn ? "Risk (RIS)" : "風險耐受 (RIS)" },
    { text: isEn ? "Patience (PAT)" : "長線耐心 (PAT)" },
    { text: isEn ? "Tech (TEC)" : "技術分析 (TEC)" }
  ];
  
  const keys = ["FUD", "SPD", "RIS", "PAT", "TEC"];
  const numAxes = keys.length;
  const angleStep = (Math.PI * 2) / numAxes;

  ctx.clearRect(0, 0, size, size);

  // ── Draw concentric pentagons (Web grid with brightened outer boundary) ──
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  ctx.lineWidth = 1;
  
  levels.forEach((lvl, index) => {
    ctx.beginPath();
    // High-contrast outer boundary ring
    if (index === levels.length - 1) {
      ctx.strokeStyle = "rgba(197, 168, 128, 0.38)";
      ctx.lineWidth = 1.5;
    } else {
      ctx.strokeStyle = "rgba(197, 168, 128, 0.22)";
      ctx.lineWidth = 1;
    }
    for (let i = 0; i < numAxes; i++) {
      const r = maxR * lvl;
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  });

  // ── Draw radial axis lines ──
  ctx.beginPath();
  ctx.strokeStyle = "rgba(197, 168, 128, 0.22)"; // Brighter axis lines
  ctx.lineWidth = 1;
  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // ── Render Radar Labels (Upscaled to bold 13.5px & bright Champagne Gold) ──
  ctx.font = "bold 13.5px 'Outfit', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#DFBA7E"; // Swapped to stunning bright gold
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const cos = Math.cos(angle);
    
    // Safety distance offset for label placement
    const textDist = Math.abs(cos) > 0.1 ? (maxR + 16) : (maxR + 12);
    const x = cx + cos * textDist;
    const y = cy + Math.sin(angle) * textDist;
    
    ctx.fillText(labels[i].text, x, y);
  }

  // ── Draw Covered Data Pentagon with Premium Neon Glow ──
  ctx.save(); // Save context state to apply shadow safely
  ctx.beginPath();
  for (let i = 0; i < numAxes; i++) {
    const key = keys[i];
    const scoreVal = scores[key] || 50;
    const r = maxR * (scoreVal / 100);
    const angle = i * angleStep - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Premium neon glow shadow
  ctx.shadowBlur = 18;
  ctx.shadowColor = "rgba(197, 168, 128, 0.65)"; // Glowing gold shadow

  const fillGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
  fillGrad.addColorStop(0, "rgba(19, 26, 42, 0.4)"); // Semi-transparent sapphire center
  fillGrad.addColorStop(1, "rgba(197, 168, 128, 0.55)"); // Strong gold edge
  ctx.fillStyle = fillGrad;
  ctx.fill();

  ctx.strokeStyle = "rgba(223, 186, 126, 0.95)"; // Extremely bright gold border
  ctx.lineWidth = 3; // Thicker border
  ctx.stroke();
  ctx.restore(); // Restore state to turn off shadow for vertices

  // ── Draw technical dots at vertices (Premium white core jewel look) ──
  for (let i = 0; i < numAxes; i++) {
    const key = keys[i];
    const scoreVal = scores[key] || 50;
    const r = maxR * (scoreVal / 100);
    const angle = i * angleStep - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    
    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2); // Larger vertex dots
    ctx.fillStyle = "#FFFFFF"; // High contrast white core
    ctx.fill();
    ctx.strokeStyle = "rgba(197, 168, 128, 1)"; // Golden ring
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// ── 7. RESET SYSTEM ──

function resetQuiz() {
  answers = new Array(questions.length).fill(null);
  currentQ = 0;
  showScreen("intro");
}

// ── 8. SOCIAL SHARING CORE UTILITIES (social-share SKILL compliant) ──

function isLineIAB() {
  return /Line/i.test(navigator.userAgent);
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function copyTextFallback(str) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str).catch(() => execCopyFallback(str));
  }
  return execCopyFallback(str);
}

function execCopyFallback(str) {
  return new Promise((resolve) => {
    const ta = document.createElement("textarea");
    ta.value = str;
    ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
    } catch(e) {}
    document.body.removeChild(ta);
    resolve();
  });
}

function openUrl(url) {
  window.open(url, "_blank");
}

function shareTo(platform) {
  // GTM dataLayer: Track Share Action
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'quiz_share',
    share_platform: platform, // fb, line, threads, copy
    result_type: window.__pendingResultKey
  });

  const url = window.location.href;
  const res = window.__getResult(window.__pendingResultKey);
  const _ui = window.__i18n && window.__i18n.ui[window.__lang];
  const text = _ui ? _ui.share_text(res) : `我完成了投資策略評測，最適合我的股票交易策略人設是【${res.title}】！快來量化你的投資心理基因吧 📈`;
  const fullText = encodeURIComponent(text + " " + url);

  if (platform === "copy") {
    copyTextFallback(text + "\n" + url).then(() => {
      showShareToast(_ui ? _ui.toast_copy : "✅ 評測連結已複製至剪貼簿！");
    });
    return;
  }

  if (platform === "threads") {
    const shareUrl = `https://www.threads.net/intent/post?text=${fullText}`;
    openUrl(shareUrl);
    return;
  }

  if (platform === "line") {
    let shareUrl = "";
    if (isMobile()) {
      shareUrl = `line://msg/text/${encodeURIComponent(text + "\n" + url)}`;
    } else if (isLineIAB()) {
      shareUrl = `https://line.me/R/share?text=${fullText}`;
    } else {
      shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    }
    
    if (isMobile()) {
      window.location.href = shareUrl;
    } else {
      openUrl(shareUrl);
    }
    return;
  }

  if (platform === "fb") {
    if (isMobile()) {
      window.location.href = `fb://share/?link=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      setTimeout(() => {
        openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
      }, 1500);
      return;
    }
    openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
    return;
  }
}

function showShareToast(msg) {
  let toast = document.getElementById("share-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "share-toast";
    toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(19,26,42,0.95);border:1px solid rgba(197,168,128,0.4);color:#fff;padding:14px 24px;border-radius:16px;font-size:13px;z-index:99999;opacity:0;transition:all 0.3s;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);text-align:center;max-width:320px;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-weight:500;";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 4000);
}

// ── 9. RESULT CARD CAPTURE & OVERLAY ──

function showImageOverlay(dataUrl) {
  const old = document.getElementById("img-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "img-overlay";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(11,15,25,0.95);z-index:100000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;";
  
  const isEn = window.__lang === "en";
  const labelText = isEn ? "📸 Long press above image to save to your album" : "📸 請長按上方圖片儲存至相簿";
  const btnText = isEn ? "← Back to Results" : "← 返回結果頁";

  overlay.innerHTML = `
    <img src="${dataUrl}" alt="Diagnostic Report" style="max-width:92%;max-height:68vh;border-radius:16px;border:1px solid rgba(197,168,128,0.3);box-shadow:0 10px 40px rgba(0,0,0,0.6);">
    <p style="color:#C5A880;margin-top:20px;font-size:14px;font-weight:600;letter-spacing:1px;display:flex;align-items:center;gap:6px;">${labelText}</p>
    <button onclick="document.getElementById('img-overlay').remove()" style="margin-top:20px;color:#C5A880;font-size:13px;font-weight:700;background:rgba(197,168,128,0.06);border:1px solid rgba(197,168,128,0.35);border-radius:999px;padding:12px 28px;cursor:pointer;transition:all 0.2s;">${btnText}</button>
  `;
  document.body.appendChild(overlay);
}

function downloadCanvasImage(canvas, filename) {
  try {
    canvas.toBlob(function(blob) {
      if (!blob) {
        fallbackDataURLDownload(canvas, filename);
        return;
      }
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 500);
    }, "image/png");
  } catch(e) {
    fallbackDataURLDownload(canvas, filename);
  }
}

function fallbackDataURLDownload(canvas, filename) {
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 500);
}

async function saveResultImage() {
  if (_saving) return;
  _saving = true;

  // GTM dataLayer: Track Save Image Action
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'quiz_save_image',
    result_type: window.__pendingResultKey
  });

  const btn = document.querySelector(".share-save");
  const origHTML = btn.innerHTML;
  const _ui = window.__i18n && window.__i18n.ui[window.__lang];
  btn.innerHTML = `<span style="font-size:12px;">${_ui ? _ui.btn_saving : "產生中..."}</span>`;
  btn.disabled = true;

  try {
    const canvas = await captureResultCard();
    const dataUrl = canvas.toDataURL("image/png");

    if (isMobile() || isLineIAB()) {
      showImageOverlay(dataUrl);
      btn.innerHTML = origHTML;
      btn.disabled = false;
      _saving = false;
      return;
    }

    const filename = window.__lang === "en" ? "Stock_Strategy_Diagnostic_Profile.png" : "投資策略性格診斷書.png";
    downloadCanvasImage(canvas, filename);
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" style="color:#06C755;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.disabled = false;
      _saving = false;
    }, 2000);
  } catch (e) {
    console.error("Capture failure:", e);
    btn.innerHTML = origHTML;
    btn.disabled = false;
    _saving = false;
    showShareToast(_ui ? _ui.toast_save_fail : "⚠️ 自動下載失敗，請直接手動螢幕截圖儲存！");
  }
}

async function captureResultCard() {
  const card = document.getElementById("result-card");
  
  const options = {
    scale: 2,
    backgroundColor: "#131A2A",
    useCORS: true,
    logging: false,
    allowTaint: true
  };
  return html2canvas(card, options);
}

// ── 10. GAME ADS INTEGRATION (game-ads SKILL compliant) ──

function showAdInterstitial() {
  const el = document.getElementById("ad-interstitial");
  if (!el) return;
  
  el.style.display = "flex";
  
  const closeBtn = el.querySelector(".ad-inter-close");
  closeBtn.disabled = true;
  closeBtn.textContent = "5";
  closeBtn.style.cursor = "not-allowed";
  closeBtn.style.opacity = "0.5";
  
  let count = 5;
  const timer = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(timer);
      closeBtn.textContent = "✕";
      closeBtn.disabled = false;
      closeBtn.style.cursor = "pointer";
      closeBtn.style.opacity = "1";
    } else {
      closeBtn.textContent = count;
    }
  }, 1000);
}

function closeAdInterstitial() {
  const el = document.getElementById("ad-interstitial");
  if (!el) return;
  
  el.style.opacity = "0";
  el.style.transition = "opacity 0.3s";
  setTimeout(() => {
    el.style.display = "none";
    el.style.opacity = "1";
    el.style.transition = "";
  }, 300);
}
