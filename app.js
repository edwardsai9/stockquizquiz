/* ==========================================================================
   INTERACTIVE STOCK TRADING STYLE QUIZ: CORE APPLICATION LOGIC
   ========================================================================== */

// ── 1. QUIZ DATA STRUCTURE (10 QUESTIONS & 6 OUTCOMES) ──

const questions = [
  {
    badge: "1. 看盤頻率",
    text: "買完股票後，你通常隔多久會打開交易 APP 關心一下？",
    hint: "提示：誠實面對內心的第一反應，此處不算工作必要時間。",
    options: [
      { label: "幾乎不看，設定好自動扣款就刪除 APP，半年後才裝回來", score: 0 },
      { label: "一天看個一兩次，主要關心有沒有發股利或帳戶被動成長", score: 1 },
      { label: "收盤後仔細看，研究法說會或財報是否有新的數據變動", score: 2 },
      { label: "盤中開著即時報價，心跳跟著綠紅 K 線上下跳動", score: 3 }
    ]
  },
  {
    badge: "2. 面對暴跌",
    text: "若你持有的核心持股單日暴跌 10%，你的直覺反應是？",
    hint: "提示：想像這件事情今天就真實發生在你的帳戶中！",
    options: [
      { label: "無感，反正我做的是長期定額，繼續裝死相信大盤會回來", score: 0 },
      { label: "太好了！配息率又變高了，把私房錢拿出來加碼多領利息！", score: 1 },
      { label: "冷靜打開估值模型評估內在價值，若安全邊際充足就加碼", score: 2 },
      { label: "天崩地裂！立刻砍倉出清，保護所剩無幾的私房本金", score: 3 }
    ]
  },
  {
    badge: "3. 選股關鍵",
    text: "在挑選一檔新股票時，哪一個特質最能打動你的心？",
    hint: "提示：這代表了你在投資拼圖中排在第一順位的要素。",
    options: [
      { label: "大家都在買、規模超大的市場大盤 ETF，買了睡得著覺", score: 0 },
      { label: "歷史配息紀錄超級穩健，年年準時發大紅包的高股息股", score: 1 },
      { label: "具備強大商業壁壘、產業護城河，且目前本益比合理的個股", score: 2 },
      { label: "剛突破歷史高點、成交量暴增，股價正在風口上的強勢股", score: 3 }
    ]
  },
  {
    badge: "4. 獲利預期",
    text: "你理想中的股票投資賺錢速度與獲利模式是？",
    hint: "提示：平衡風險與回報後，最讓你感到踏實的利潤模式。",
    options: [
      { label: "像滾雪球一樣，跟著大盤每年穩健增長 7-10% 即可", score: 0 },
      { label: "像收租一樣，每季或每年有穩定的股息現金流入袋", score: 1 },
      { label: "深度研究挖掘潛力成長股，用時間換取數倍的資本利得", score: 2 },
      { label: "利用市場波動快進快出，追求在幾天內賺取 20% 的波段價差", score: 3 }
    ]
  },
  {
    badge: "5. 資產配置",
    text: "如果現在有 100 萬的閒置資金，你會怎麼分配在股票上？",
    hint: "提示：資產分散程度通常與你的睡眠品質高度相關。",
    options: [
      { label: "直接買追蹤全市場的被動指數 ETF，分散到數百檔股票中", score: 0 },
      { label: "挑選 5-10 檔歷史悠久、獲利與配息都穩健的大型權值股", score: 1 },
      { label: "集中持有 3-5 檔自己研究得非常透徹、成長空間大的潛力股", score: 2 },
      { label: "全倉押注在當下最熱門的題材股或籌碼強勢股，靈活調配", score: 3 }
    ]
  },
  {
    badge: "6. 打敗市場",
    text: "你相信一般個人投資人真的能夠持續擊敗大盤市場嗎？",
    hint: "提示：這決定了你將採取跟隨大盤還是主動出擊的姿態。",
    options: [
      { label: "散戶不可能擊敗大盤，老實跟隨大盤指數才是最優解", score: 0 },
      { label: "能不能擊敗大盤不重要，拿到實實在在的配息現金流才最真", score: 1 },
      { label: "能，只要肯花時間做足功課，就能利用市場的非理性撿便宜", score: 2 },
      { label: "能，只要掌握資金流向與技術型態趨勢，順勢交易就能賺大錢", score: 3 }
    ]
  },
  {
    badge: "7. 閱讀習慣",
    text: "你平時最常關注、研讀或參考的財經投資資訊是？",
    hint: "提示：你吸收的資訊取向反映了你的決策邏輯。",
    options: [
      { label: "很少關注個股資訊，主要閱讀資產配置與指數化投資的書籍", score: 0 },
      { label: "追蹤各標的除權息日程、高股息 ETF 成分股季度調整明細", score: 1 },
      { label: "鑽研公司年報、法說會報告、產業鏈上下游及基本面財務數據", score: 2 },
      { label: "分析 K 線圖、均線排列、RSI/MACD 技術指標與籌碼主力動向", score: 3 }
    ]
  },
  {
    badge: "8. 決策時間",
    text: "從你注意到一檔新股票，到你真正下單買入，通常經歷多久？",
    hint: "提示：反映出你的分析克制力與執行敏捷度。",
    options: [
      { label: "不需要手動做買入決策，我早就設定好定期定額自動扣款", score: 0 },
      { label: "會觀察幾週，算出合理殖利率，等股價跌到便宜的甜甜價才買", score: 1 },
      { label: "耗費數週甚至數月進行深度估值與研究，直到安全邊際充足", score: 2 },
      { label: "一旦看到成交量暴增、線圖突破，幾秒鐘內就能果斷跟進下單", score: 3 }
    ]
  },
  {
    badge: "9. 槓桿態度",
    text: "對於「融資、權證、選擇權」等開槓桿的工具，你的基本態度是？",
    hint: "提示：槓桿是雙面刃，反映你的風險偏好。",
    options: [
      { label: "絕對不碰！投資應求穩健長期分散，開槓桿簡直是自尋死路", score: 0 },
      { label: "避開這些高風險工具，我寧可選擇波動極低的安全防守型資產", score: 1 },
      { label: "了解原理但極少使用，堅持以現股買入具有長線成長價值的標的", score: 2 },
      { label: "提高資金效率的利器！在機會明朗、勝率極高時會善用槓桿博取暴利", score: 3 }
    ]
  },
  {
    badge: "10. 成就感來源",
    text: "在股票投資的過程中，哪件事情能帶給你最大的成就感與樂趣？",
    hint: "提示：每個人在市場中追尋的核心心態價值大不相同。",
    options: [
      { label: "什麼事都沒做，但帳戶隨著時間與複利穩健增長的心安感", score: 0 },
      { label: "每到除權息季節，手機收到配息現金簡訊的喜悅", score: 1 },
      { label: "驗證了自己的獨立思考，買進的冷門優質股被市場發掘而暴漲", score: 2 },
      { label: "精準判斷趨勢拐點，快進快出成功獲利，享受博弈般極致執行的快感", score: 3 }
    ]
  }
];

const results = [
  { min: 0, max: 5, type: "passive" },
  { min: 6, max: 10, type: "dividend" },
  { min: 11, max: 15, type: "value" },
  { min: 16, max: 20, type: "momentum" },
  { min: 21, max: 25, type: "short" },
  { min: 26, max: 30, type: "leverage" }
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
  
  const sparkleCount = 35;
  for (let i = 0; i < sparkleCount; i++) {
    const star = document.createElement("div");
    star.className = "sparkle";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDuration = (3 + Math.random() * 5) + "s";
    star.style.animationDelay = Math.random() * 4 + "s";
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
    btn.innerHTML = `<span class="opt-label opt-label-${labels[oi].toLowerCase()}">${labels[oi]}</span><span>${opt.label}</span>`;
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
    result_type: target.type, // passive, dividend, value, momentum, short, leverage
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
  document.getElementById("res-desc").textContent = res.desc;

  // Update result sticker image source dynamically
  const stickerImg = document.getElementById("result-sticker");
  if (stickerImg) {
    stickerImg.src = `res_${resKey}.png`;
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
  const text = _ui ? _ui.share_text(res) : `我完成了股市交易風格測評，最適合我的股票戰士人設是【${res.title}】！快來看看你的股市基因是什麼吧 📈`;
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
    toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(24,20,17,0.95);border:1px solid rgba(212,175,55,0.4);color:#fff;padding:14px 24px;border-radius:16px;font-size:13px;z-index:99999;opacity:0;transition:all 0.3s;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);text-align:center;max-width:320px;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-weight:500;";
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
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(14,12,10,0.96);z-index:100000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;";
  
  const isEn = window.__lang === "en";
  const labelText = isEn ? "📸 Long press above image to save to your album" : "📸 請長按上方圖片儲存至相簿";
  const btnText = isEn ? "← Back to Results" : "← 返回結果頁";

  overlay.innerHTML = `
    <img src="${dataUrl}" alt="Diagnostic Report" style="max-width:92%;max-height:68vh;border-radius:16px;border:1px solid rgba(212,175,55,0.3);box-shadow:0 10px 40px rgba(0,0,0,0.6);">
    <p style="color:#D4AF37;margin-top:20px;font-size:14px;font-weight:600;letter-spacing:1px;display:flex;align-items:center;gap:6px;">${labelText}</p>
    <button onclick="document.getElementById('img-overlay').remove()" style="margin-top:20px;color:#D4AF37;font-size:13px;font-weight:700;background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.35);border-radius:999px;padding:12px 28px;cursor:pointer;transition:all 0.2s;">${btnText}</button>
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

    const filename = window.__lang === "en" ? "Stock_Trading_Style_Diagnostic_Profile.png" : "股市交易風格診斷書.png";
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
    backgroundColor: "#181411", // Matching GTM stone background
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
