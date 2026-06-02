/* ==========================================================================
   MULTI-LANGUAGE TRANSLATION CORE (Traditional Chinese & English)
   ========================================================================== */

// 1. Read or initialize language preference (default: zh-TW)
window.__lang = (function() {
  try {
    return localStorage.getItem('quiz-lang') || 'zh-TW';
  } catch(e) {
    return 'zh-TW';
  }
})();

// 2. Language-independent results metadata
const _resultMeta = {
  passive: { type: "passive", min: 0, max: 6, fit: "98.5%", scores: { FUD: 35, TEC: 10, PAT: 98, RIS: 65, SPD: 10 } },
  dividend: { type: "dividend", min: 7, max: 12, fit: "96.4%", scores: { FUD: 85, TEC: 25, PAT: 90, RIS: 40, SPD: 20 } },
  value: { type: "value", min: 13, max: 19, fit: "97.2%", scores: { FUD: 98, TEC: 18, PAT: 88, RIS: 55, SPD: 30 } },
  momentum: { type: "momentum", min: 20, max: 25, fit: "95.8%", scores: { FUD: 30, TEC: 95, PAT: 30, RIS: 75, SPD: 88 } },
  short: { type: "short", min: 26, max: 30, fit: "98.1%", scores: { FUD: 20, TEC: 98, PAT: 10, RIS: 98, SPD: 98 } }
};

// 3. Translation database
window.__i18n = {
  ui: {
    'zh-TW': {
      eyebrow: '👑 專業行為財務性格評測',
      title: '最適合你的<br><span class="gold-gradient-text">買股票策略</span>是什麼？',
      subtitle: '市場從不缺乏資訊，缺乏的是對自我的認知。本測評基於現代<b>行為金融學（Behavioral Finance）</b>決策模型，透過 10 個核心交易場景，量化你的風險偏好與認知偏差，為你精準對接最契合的股票交易哲學。',
      stat_precision_val: '98.4%',
      stat_precision_lbl: '學術模型精準度',
      stat_completed_val: '14,205+',
      stat_completed_lbl: '已完成專業測評',
      btn_start: '開始專業測評 →',
      disclaimer: '※ 本測評由量化心理模型提供支持，測評結果僅供學術與投資性格剖析參考，不構成實際投資招攬或顧問建議。',
      
      // Quiz Screen
      q_count: function(n, total) { return `第 ${n} 題，共 ${total} 題`; },
      btn_prev: '← 上一題',
      
      // Result Screen
      result_badge: '📊 理財性格量化診斷書',
      result_subtitle: '最適合您的股票策略人設為',
      metric_fit: '模型適配度',
      metric_vol: '回測波動性',
      section_philosophy: '✦ 策略哲學深度解析',
      label_strength: '🎯 核心優勢',
      label_weakness: '⚠️ 潛在盲區',
      label_allocation: '💼 推薦資產配置建議',
      card_footer: '👑 專業行為財務性格評測系統產出 • 截圖儲存分享',
      share_title: '📸 儲存診斷書並與投資好友切磋',
      btn_retry: '再測一次，直面內心 ↺',
      btn_saving: '產生中...',
      toast_copy: '✅ 評測連結已複製至剪貼簿！',
      toast_save_fail: '⚠️ 自動下載失敗，請直接手動螢幕截圖儲存！',
      
      // Ads & Sharing Text
      share_text: function(res) {
        return `我完成了投資策略評測，最適合我的股票交易策略人設是【${res.title}】！快來量化你的投資心理基因吧 📈`;
      }
    },
    'en': {
      eyebrow: '👑 BEHAVIORAL FINANCE ASSESSMENT',
      title: 'What\'s Your Optimal<br><span class="gold-gradient-text">Stock Strategy</span>?',
      subtitle: 'Markets are filled with noise; clarity starts with self-awareness. Based on modern <b>Behavioral Finance</b> decision models, this assessment gauges your risk preferences and cognitive biases to align you with your optimal trading philosophy.',
      stat_precision_val: '98.4%',
      stat_precision_lbl: 'Model Precision',
      stat_completed_val: '14,205+',
      stat_completed_lbl: 'Assessments Done',
      btn_start: 'Start Assessment →',
      disclaimer: '* Powered by quantitative psychology. For educational & personality profiling only; not actual investment advice.',
      
      // Quiz Screen
      q_count: function(n, total) { return `Question ${n} of ${total}`; },
      btn_prev: '← Previous',
      
      // Result Screen
      result_badge: '📊 QUANTITATIVE FINANCIAL PROFILE',
      result_subtitle: 'YOUR STOCK STRATEGY PROFILE IS',
      metric_fit: 'Model Fit',
      metric_vol: 'Backtest Volatility',
      section_philosophy: '✦ Deep Strategy Philosophy',
      label_strength: '🎯 Core Advantages',
      label_weakness: '⚠️ Potential Blindspots',
      label_allocation: '💼 Recommended Asset Allocation',
      card_footer: '👑 Produced by Behavioral Finance Profiler • Save & Share',
      share_title: '📸 Save Your Diagnostic Profile & Share with Friends',
      btn_retry: 'Retake Assessment ↺',
      btn_saving: 'Generating...',
      toast_copy: '✅ Assessment link copied to clipboard!',
      toast_save_fail: '⚠️ Auto-download failed, please take a screenshot!',
      
      // Ads & Sharing Text
      share_text: function(res) {
        return `I just completed the Behavioral Finance Stock Strategy Assessment! My optimal strategy profile is 【${res.title}】! Quantify your investment DNA here: `;
      }
    }
  },
  
  questions: {
    'zh-TW': null, // populated below from active memory
    'en': [
      {
        badge: "1. Monitor Frequency",
        text: "Once your stock account is open, how much time do you expect to spend monitoring and analyzing the market daily?",
        hint: "Note: Exclude general news browsing; count only active portfolio research time.",
        options: [
          { label: "Barely monitor; set up auto-contributions or check quarterly", score: 0 },
          { label: "Spend 10-15 mins checking account & dividend releases after market close", score: 1 },
          { label: "Spend 1-2 hours studying financial reports, industry news, and stock metrics", score: 2 },
          { label: "Watch the screen closely during trading hours, focusing on bid-ask spreads & real-time charts", score: 3 }
        ]
      },
      {
        badge: "2. Crash Response",
        text: "If your core holding crashes by 20% due to irrational market panic, what is your first reaction?",
        hint: "Note: Be honest with your instinct, rather than giving a textbook answer.",
        options: [
          { label: "Indifferent; trust that the broad market index will recover in the long run", score: 0 },
          { label: "Reassured as long as dividend payouts hold; buy more to accumulate yield", score: 1 },
          { label: "Re-evaluate intrinsic value; if fundamentals are intact, view it as a great bargain to buy more", score: 2 },
          { label: "Sell immediately to cut losses; wait for clear signs of bottoming out before buying back", score: 3 }
        ]
      },
      {
        badge: "3. Stock Selection",
        text: "When picking a stock, what is the single most critical criterion you evaluate?",
        hint: "Note: Which attribute takes absolute priority in your investment process?",
        options: [
          { label: "Index representation and low management fees; matching market returns is best", score: 0 },
          { label: "Dividend history, current dividend yield, and healthy free cash flows", score: 1 },
          { label: "P/E ratio, P/B ratio, ROE, and whether a long-term 'business moat' exists", score: 2 },
          { label: "Trading volume, bullish moving average alignment, chart breakouts, and institutional flows", score: 3 }
        ]
      },
      {
        badge: "4. Return Expectation",
        text: "What is your target annual return rate and preferred way of making profits?",
        hint: "Note: Balancing risk and reward, which profit model brings you peace of mind?",
        options: [
          { label: "Match the long-term historical returns of the broad market (approx. 7-10% annually)", score: 0 },
          { label: "Secure stable, predictable cash distributions to build passive income (approx. 5-8% annually)", score: 1 },
          { label: "Discover deeply undervalued companies through research to capture multi-fold capital gains", score: 2 },
          { label: "Trade volatility actively for high-velocity, short-term wave gains", score: 3 }
        ]
      },
      {
        badge: "5. Asset Concentration",
        text: "How do you prefer to configure your stock portfolio?",
        hint: "Note: Diversification is heavily correlated with your sleep quality during drawdowns.",
        options: [
          { label: "Global or all-market diversification; holding hundreds of stocks with zero single-company bias", score: 0 },
          { label: "Concentrate in 5-10 stable, high-yield, large-cap blue-chip equities", score: 1 },
          { label: "Hold 3-5 high-conviction moat companies with a margin of safety for the long haul", score: 2 },
          { label: "Dynamically adjust holdings and sector weights based on hot themes and technical trends", score: 3 }
        ]
      },
      {
        badge: "6. Beating the Market",
        text: "What is your belief regarding whether individual investors can consistently beat the market?",
        hint: "Note: This shapes whether you take a passive indexing posture or active hunting stance.",
        options: [
          { label: "Markets are highly efficient; active stock picking is futile, passive index tracking is optimal", score: 0 },
          { label: "Beating the market doesn't matter; obtaining secure, steady cash flow is what counts", score: 1 },
          { label: "Markets are often driven by sentiment; disciplined research uncovers outstanding alphas", score: 2 },
          { label: "Markets move in waves; riding technical momentum with quick exits captures high gains", score: 3 }
        ]
      },
      {
        badge: "7. Reading Preferences",
        text: "What type of financial information or research do you follow most closely?",
        hint: "Note: Your information diet reveals your core decision-making logic.",
        options: [
          { label: "Rarely follow individual stocks; read books on asset allocation and indexing", score: 0 },
          { label: "Track ex-dividend dates, corporate debt ratings, and quarterly dividend ETF configurations", score: 1 },
          { label: "Scrutinize annual reports, earnings call transcripts, supply chain logic, and competitor metrics", score: 2 },
          { label: "Study candlesticks, moving averages, MACD/RSI signals, and daily broker chip flows", score: 3 }
        ]
      },
      {
        badge: "8. Trade Decision Timeline",
        text: "From discovering a stock to clicking the 'buy' button, how long does your decision take?",
        hint: "Note: Reflected in your analytical restraint versus execution speed.",
        options: [
          { label: "Set up recurring auto-buys; no active buy decision is required", score: 0 },
          { label: "Monitor for weeks, analyzing yields, and waiting for an undervalued entry price", score: 1 },
          { label: "Invest weeks or months in rigorous valuation and research, buying only when safety is high", score: 2 },
          { label: "Act immediately within minutes or seconds once volume surge or technical breakout is spotted", score: 3 }
        ]
      },
      {
        badge: "9. Leverage & Derivatives",
        text: "What is your fundamental stance on margin, options, futures, or leveraged ETFs?",
        hint: "Note: Leverage can be a toxic poison or a powerful accelerator based on risk control.",
        options: [
          { label: "Strictly avoid; investing should be low-risk, long-term, and diversified. Leverage leads to ruin", score: 0 },
          { label: "Steer clear of leverage; stick to low-beta, defensive stocks even if they seem boring", score: 1 },
          { label: "Understand these instruments but rarely use them, buying quality stocks with cash", score: 2 },
          { label: "Use them strategically to boost capital efficiency when trade probabilities are high", score: 3 }
        ]
      },
      {
        badge: "10. Core Joy of Investing",
        text: "In your stock investment journey, what brings you the greatest sense of accomplishment?",
        hint: "Note: The ultimate psychological payoff you seek from active participation.",
        options: [
          { label: "Peace of mind knowing my wealth is compounding quietly in the background without my effort", score: 0 },
          { label: "Receiving quarterly dividends, turning payouts directly into passive income stream", score: 1 },
          { label: "Validating independent analysis when a hidden gem I bought surges after market discovery", score: 2 },
          { label: "Timing entries and exits accurately, enjoying the execution thrill of active momentum wins", score: 3 }
        ]
      }
    ]
  },
  
  resultText: {
    'zh-TW': {
      passive: {
        title: "指數化被動投資策略",
        tagline: "「抱住全市場，低成本參與人類長期繁榮的被動信仰家」",
        desc: "您是市場效率假說的堅定信仰者。您深知頻繁交易和主動選股只會被交易成本與認知偏差殘食利潤，因此選擇將資金分散於全市場指數中，追求與世界同步的長線跑程。在市場喧囂中，您能維持泰然心境，不為短期震盪動搖。",
        vol: "極低且隨大盤",
        strength: "心力損耗極低，交易摩擦成本幾近於零，長線勝率極高，能徹底避開單一企業倒閉或暴雷的滅頂風險。",
        weakness: "在大牛市中無法獲得超越大盤的超額報酬（Alpha），策略表現較為平淡無奇；需有極大信念面對漫長的市場熊市。",
        allocation: "80% 全球股票指數 ETF (如 VT) + 15% 核心公債型 ETF (如 BND) + 5% 無風險現金。"
      },
      dividend: {
        title: "高股息現金流防禦策略",
        tagline: "「以豐沛配息為盾，無視市場起舞的高效現金流收割者」",
        desc: "您是極致務實的現金流追求者。您不寄望於虛無飄渺、難以預測的股價波動，而是將核心注意力集中在每期能實實在在進入口袋的股息上。您傾向用高殖利率、獲利穩健的防守型標的打造專屬防禦壁壘，享受穩定的被動收入成長。",
        vol: "低波動",
        strength: "具備強大的投資心理韌性，因為每期的實體配息能直接抵消帳面虧損焦慮；在震盪市中能提供非常踏實的防護傘。",
        weakness: "配息政策可能隨公司營運惡化而中斷，且高配息股常面臨資本利得成長放緩的代價；容易低估重複配息的稅務磨損。",
        allocation: "60% 高殖利率權值股/優質高股息 ETF + 30% 公用事業/電信產業龍頭 + 10% 貨幣市場定存。"
      },
      value: {
        title: "經典價值成長投資策略",
        tagline: "「買股票就是買企業，以超凡安全邊際對抗波動的巴菲特信徒」",
        desc: "您是深具商業洞察力的理性投資人。您深信「價格圍繞價值波動」的核心原理，熱衷於閱讀財務報表、鑽研競爭優勢、建立嚴謹的估值模型。您總是在股價低於內在價值、安全邊際充足時出手重倉買入，並極具耐心地陪伴優質企業成長。",
        vol: "中等偏低",
        strength: "買入成本極具安全邊際，抗跌能力強；由於研究紮實，不容易受恐慌情緒影響，中長線常能戰勝大盤，獲取豐厚資本利得。",
        weakness: "估值模型需要極高專業度與時間精力，且容易落入「價值陷阱」（即便宜的垃圾公司）；持股發酵的等待期可能極其漫長。",
        allocation: "60% 具備護城河的優質價值龍頭 + 20% 高研發門檻的成長股 + 20% 短期公債以維持流動性。"
      },
      momentum: {
        title: "動能追隨與趨勢交易策略",
        tagline: "「以嚴格紀律為鋼，乘風追逐強勢股浪潮的順勢乘風者」",
        desc: "您是市場的敏銳獵犬，深知「強者恆強」的動能法則。您不在意抄底，而是透過移動平均線、量價關係、籌碼日報與型態突破，順應趨勢進行中短期的強勢進出。您絕不參與市場盤整或長期走跌，注重資金周轉效率與趨勢利潤最大化。",
        vol: "中高波動",
        strength: "資金利用效率與周轉率極高，在明顯的多頭趨勢中能創造驚人的爆發力；嚴格遵循技術停損，能徹底避開系統性大崩盤。",
        weakness: "在市場處於無方向的箱型整理（震盪盤）時，極易因為頻繁假突破而反覆停損被「雙巴」；極度考驗交易紀律的鋼鐵意志力。",
        allocation: "50% 當季強勢題材與法人重倉股 + 30% 大盤動能型 ETF + 20% 現金儲備（維持交易機動性）。"
      },
      short: {
        title: "極短線與主動投機策略",
        tagline: "「以波動為燃料，在恐懼與貪婪夾縫中奪食的超短線獵手」",
        desc: "您是交易戰場上的頂尖特種兵。您以劇烈波動為生，穿梭於市場最熱、波動最大的板塊中。您極度重視即時五檔報價、盤中大單、情緒共振與微觀技術線圖，並善用槓桿或衍生性工具在短時間內博取超額利潤，追求當日或極短線的結算。",
        vol: "極高波動",
        strength: "不受任何市場長線利空干擾（如黑天鵝事件的隔夜風險），單次波段獲利極快，具備敏銳無比的盤感與極致的果斷執行力。",
        weakness: "情緒壓力和精神耗損巨大，手續費與證所稅等摩擦成本驚人；極度考驗專注度，一旦情緒失控未嚴格停損，可能面臨毀滅重創。",
        allocation: "45% 極高波動個股與期權/期貨 + 35% 熱門題材流動資金 + 20% 絕對安全的定存（保命安全鎖）。"
      }
    },
    'en': {
      passive: {
        title: "Passive Indexing Strategy",
        tagline: "“A long-term global growth indexer holding the world economy”",
        desc: "You are a staunch believer in the Efficient Market Hypothesis. Understanding that active trading and stock picking often erode returns through high friction costs and behavioral errors, you diversify broadly across whole-market index funds to capture global compounding quietly. Market noise never moves you.",
        vol: "Very Low (Index Tracking)",
        strength: "Near-zero effort and friction costs, returns tracking the broad market, and zero risk of single stock default.",
        weakness: "No outperformance (Alpha) during bull markets; requires absolute discipline to hold index funds through deep recessions.",
        allocation: "80% Global Equity Index ETF (e.g., VT) + 15% Core Bond ETF (e.g., BND) + 5% Liquid Cash."
      },
      dividend: {
        title: "Dividend & Cash Flow Strategy",
        tagline: "“A cash flow harvester shielding portfolios with stable payouts”",
        desc: "You are an extremely pragmatic income investor. Instead of speculating on capital gains, you focus on receiving reliable, tangible cash dividends. You prefer low-beta defensive leaders, letting compounding distributions secure your passive income.",
        vol: "Low Volatility",
        strength: "Outstanding psychological resilience; regular cash distributions offset paper drawdown anxiety and secure steady returns in bear markets.",
        weakness: "Dividend cuts are possible if corporate earnings deteriorate; high-yield stocks may have slower long-term capital growth.",
        allocation: "60% High-Yield Equity / Dividend ETFs + 30% Utility/Telecom Leaders + 10% Money Market Funds."
      },
      value: {
        title: "Classic Value Strategy",
        tagline: "“A Buffett disciple acquiring quality business with safe margins”",
        desc: "You are a highly analytical, rational investor. Believing that price eventually reflects intrinsic value, you study competitive moats and balance sheets, buying quality companies only when a wide margin of safety is present.",
        vol: "Low-Medium Volatility",
        strength: "Substantial safety margin, excellent risk-adjusted entry prices, and high probability of beating the market in the long haul.",
        weakness: "Demands extensive research time and financial literacy; risks falling into value traps (cheap but structurally declining companies).",
        allocation: "60% Moat-driven Value Leaders + 20% High-growth Companies + 20% Short-term Treasuries."
      },
      momentum: {
        title: "Momentum & Trend Strategy",
        tagline: "“A sharp trend follower riding the strongest market waves”",
        desc: "You are a sharp momentum follower. Guided by the law of inertia, you ride strong trends using moving averages, breakouts, and institutional flows, prioritizing capital efficiency and moving out of stagnant or falling assets quickly.",
        vol: "Medium-High Volatility",
        strength: "High capital efficiency and turnover; explosive gains during bull runs while cutting losses quickly to sidestep crashes.",
        weakness: "Vulnerable to whip-saws (getting chopped up) during sideways, volatile markets; demands extreme discipline in executing stops.",
        allocation: "50% Strong Momentum Stocks + 30% Dynamic Sector ETFs + 20% Cash (held for tactical entries)."
      },
      short: {
        title: "Short-term Speculation Strategy",
        tagline: "“A short-term hunter extracting quick profits from volatility”",
        desc: "You thrive on high volatility, navigating fast-moving sectors with technical charts, order flows, and market sentiment, using derivatives or leverage to capture intraday fluctuations and closing positions before overnight risks.",
        vol: "Extremely High Volatility",
        strength: "Zero exposure to overnight macroeconomic black swan events, rapid compounding capability, and outstanding market intuition.",
        weakness: "High psychological stress and mental fatigue; high friction costs; a single slip in executing stops can result in severe drawdowns.",
        allocation: "45% Highly Volatile Assets/Derivatives + 35% Tactical Cash + 20% Liquid Savings."
      }
    }
  }
};

// 4. Helper Function: Merge Meta and localized texts
window.__getResult = function(key) {
  const meta = _resultMeta[key];
  if (!meta) return null;
  const texts = window.__i18n.resultText[window.__lang][key] || window.__i18n.resultText['zh-TW'][key];
  return Object.assign({}, meta, texts);
};

// 5. Dynamic Language Changer
window.setLanguage = function(lang) {
  if (!window.__i18n.ui[lang]) return;
  window.__lang = lang;
  
  try {
    localStorage.setItem('quiz-lang', lang);
  } catch(e) {}

  // Update switcher button active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  const ui = window.__i18n.ui[lang];

  // Update HTML contents (for title/subtitle with markup tags)
  ['title', 'subtitle'].forEach(key => {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (el) el.innerHTML = ui[key];
  });

  // Update plain text contents
  ['eyebrow', 'stat_precision_lbl', 'stat_completed_lbl', 'btn_start', 'disclaimer', 'btn_prev', 'result_badge', 'result_subtitle', 'metric_fit', 'metric_vol', 'section_philosophy', 'label_strength', 'label_weakness', 'label_allocation', 'card_footer', 'share_title', 'btn_retry'].forEach(key => {
    document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => {
      el.textContent = ui[key];
    });
  });

  // Update dynamic values if elements are active
  const startBtn = document.getElementById('btn-start');
  if (startBtn) {
    startBtn.innerHTML = ui.btn_start;
  }
  
  const retryBtn = document.querySelector('.cta-btn.secondary');
  if (retryBtn) {
    retryBtn.innerHTML = ui.btn_retry;
  }

  // Preserve assessment state and rerender dynamically
  const quizActive = document.getElementById('screen-quiz').classList.contains('active');
  const resultActive = document.getElementById('screen-result').classList.contains('active');

  if (quizActive && typeof renderQuestion === 'function') {
    renderQuestion(currentQ);
  }
  
  if (resultActive && window.__pendingResultKey && typeof renderResult === 'function') {
    renderResult(window.__pendingResultKey);
  }
};
