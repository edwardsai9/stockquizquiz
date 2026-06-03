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

// 2. Language-independent results metadata (6 Outcomes)
const _resultMeta = {
  passive: { type: "passive", min: 0, max: 5, fit: "98.5%", scores: { FUD: 25, TEC: 15, PAT: 98, RIS: 30, SPD: 10 } },
  dividend: { type: "dividend", min: 6, max: 10, fit: "96.4%", scores: { FUD: 85, TEC: 20, PAT: 90, RIS: 40, SPD: 15 } },
  value: { type: "value", min: 11, max: 15, fit: "97.2%", scores: { FUD: 98, TEC: 25, PAT: 85, RIS: 55, SPD: 20 } },
  momentum: { type: "momentum", min: 16, max: 20, fit: "95.8%", scores: { FUD: 30, TEC: 80, PAT: 40, RIS: 75, SPD: 90 } },
  short: { type: "short", min: 21, max: 25, fit: "98.1%", scores: { FUD: 15, TEC: 95, PAT: 15, RIS: 90, SPD: 98 } },
  leverage: { type: "leverage", min: 26, max: 30, fit: "99.2%", scores: { FUD: 20, TEC: 98, PAT: 10, RIS: 98, SPD: 98 } }
};

// 3. Translation database
window.__i18n = {
  ui: {
    'zh-TW': {
      eyebrow: '👑 股市生存性格趣味測評',
      title: '最適合你的<br><span class="gold-gradient-text">股票交易風格</span>是什麼？',
      subtitle: '買股票是修行，也是博弈！本測評用 10 個趣味的日常股市抉擇，幫你解鎖靈魂深處的股市戰士人格，看你到底是穩健大師，還是槓桿狂魔！',
      stat_precision_val: '98.4%',
      stat_precision_lbl: '大數據模型吻合度',
      stat_completed_val: '14,205+',
      stat_completed_lbl: '已完成趣味測評',
      btn_start: '開始測評，直面內心 →',
      disclaimer: '※ 本測評為趣味性格剖析，不構成實際投資招攬、財務顧問或具體買賣建議。投資有風險，下單需謹慎。',
      
      // Quiz Screen
      q_count: function(n, total) { return `第 ${n} 題，共 ${total} 題`; },
      btn_prev: '← 上一題',
      
      // Result Screen
      result_badge: '📊 股市人格量化診斷書',
      result_subtitle: '最適合您的股票交易風格人設為',
      metric_fit: '適配百分比',
      metric_vol: '回測波動性',
      section_philosophy: '🔮 投資人格「內心大白話」',
      card_footer: '👑 專業行為財務性格評測系統產出 • 截圖儲存分享',
      share_title: '📸 儲存診斷書並與投資好友切磋',
      btn_retry: '再測一次，命運翻盤 ↺',
      btn_saving: '產生中...',
      toast_copy: '✅ 評測連結已複製至剪貼簿！',
      toast_save_fail: '⚠️ 自動下載失敗，請直接手動螢幕截圖儲存！',
      
      // Ads & Sharing Text
      share_text: function(res) {
        return `我完成了股市交易風格測評，最適合我的股票戰士人設是【${res.title}】！快來看看你的股市基因是什麼吧 📈`;
      }
    },
    'en': {
      eyebrow: '👑 STOCK INVESTOR PERSONALITY QUIZ',
      title: 'What\'s Your True<br><span class="gold-gradient-text">Stock Trading Style</span>?',
      subtitle: 'Investing is a journey of self-discovery. Answer 10 fun stock-market scenarios to reveal your inner trader profile—from passive indexing masters to high-stakes leverage warlords!',
      stat_precision_val: '98.4%',
      stat_precision_lbl: 'Data Model Fit Rate',
      stat_completed_val: '14,205+',
      stat_completed_lbl: 'Assessments Done',
      btn_start: 'Start Quiz, Reveal Yourself →',
      disclaimer: '* For educational & entertainment profiling only; not actual investment advice. Trading stocks involves risk.',
      
      // Quiz Screen
      q_count: function(n, total) { return `Question ${n} of ${total}`; },
      btn_prev: '← Previous',
      
      // Result Screen
      result_badge: '📊 TRADER QUANT DIAGNOSTIC PROFILE',
      result_subtitle: 'YOUR STOCK TRADER PROFILE IS',
      metric_fit: 'Match Percentage',
      metric_vol: 'Backtest Volatility',
      section_philosophy: '🔮 Your Trading Soul in Plain English',
      card_footer: '👑 Produced by Behavioral Finance Profiler • Save & Share',
      share_title: '📸 Save Your Diagnostic Profile & Share with Friends',
      btn_retry: 'Retake Quiz, Rewrite Destiny ↺',
      btn_saving: 'Generating...',
      toast_copy: '✅ Assessment link copied to clipboard!',
      toast_save_fail: '⚠️ Auto-download failed, please take a screenshot!',
      
      // Ads & Sharing Text
      share_text: function(res) {
        return `I just completed the Stock Trading Style Quiz! My optimal strategy profile is 【${res.title}】! Quantify your trading DNA here: `;
      }
    }
  },
  
  questions: {
    'zh-TW': null, // populated dynamically from app.js memory on load
    'en': [
      {
        badge: "1. App Checking",
        text: "After buying a stock, how often do you open your trading app?",
        hint: "Honest answer only—no judging!",
        options: [
          { label: "Rarely. Set up auto-invest, delete the app, check back in 6 months.", score: 0 },
          { label: "Once or twice a day, mostly checking if cash dividends hit the account.", score: 1 },
          { label: "After market close, carefully reading corporate earnings and metrics.", score: 2 },
          { label: "Keep it open all day, my heart racing with every red and green candle.", score: 3 }
        ]
      },
      {
        badge: "2. Crash Response",
        text: "If your core holding suddenly plunges 10% in a single day, your first reaction is...",
        hint: "Imagine it actually happening to you today!",
        options: [
          { label: "Shrug. I do long-term monthly index savings anyway; time to play dead.", score: 0 },
          { label: "Awesome! Lower price means higher dividend yield. Buying more to collect dividends!", score: 1 },
          { label: "Calmly analyze valuation models. If it's cheap, I buy more to lower cost.", score: 2 },
          { label: "Panic! The sky is falling! Cut losses and sell everything now to protect my cash.", score: 3 }
        ]
      },
      {
        badge: "3. Stock Selection",
        text: "What trait attracts you most when picking a new stock?",
        hint: "Your absolute first priority.",
        options: [
          { label: "A super popular, giant index ETF that helps me sleep peacefully.", score: 0 },
          { label: "A legendary track record of paying out dividends every single year.", score: 1 },
          { label: "A rock-solid industry competitive moat with reasonable valuation.", score: 2 },
          { label: "Rallying for days with massive breakouts—ready to jump on board immediately.", score: 3 }
        ]
      },
      {
        badge: "4. Profit Style",
        text: "What is your ideal speed and style of making money in stocks?",
        hint: "Be realistic about your timeline.",
        options: [
          { label: "Slow compounding matching the broad market index (7-10% a year).", score: 0 },
          { label: "Steady dividend payments flowing into my bank account like monthly rent.", score: 1 },
          { label: "Diligent research to find a 10x multibagger growth stock over years.", score: 2 },
          { label: "Quick swing trading to lock in a 20% gain in a few days.", score: 3 }
        ]
      },
      {
        badge: "5. Portfolio Setup",
        text: "If you are given $1 million to invest, how would you allocate it?",
        hint: "Think about how you distribute risk.",
        options: [
          { label: "Put it all in a broad-market index ETF across hundreds of stocks.", score: 0 },
          { label: "Pick 5-10 blue-chip giants known for paying safe dividends.", score: 1 },
          { label: "Concentrate heavily in 3-5 high-conviction growth companies.", score: 2 },
          { label: "All-in on whichever stock is trending hot on social media today.", score: 3 }
        ]
      },
      {
        badge: "6. Beating Market",
        text: "Do you believe retail investors can consistently beat the market?",
        hint: "Your core market philosophy.",
        options: [
          { label: "No. Markets are efficient. Sticking to index funds is the best.", score: 0 },
          { label: "Doesn't matter. Collecting cash dividends is the only real win.", score: 1 },
          { label: "Yes, deep fundamental research exploits market inefficiencies.", score: 2 },
          { label: "Yes, by reading technical charts and following hot capital flows.", score: 3 }
        ]
      },
      {
        badge: "7. Media Diet",
        text: "What kind of financial information do you read most often?",
        hint: "What gets you excited to read?",
        options: [
          { label: "Rarely check individual stocks, only read about asset allocation and passive indexing.", score: 0 },
          { label: "Dividend calendar releases and high-yield index component updates.", score: 1 },
          { label: "Corporate earnings reports, supply chain logic, and conference calls.", score: 2 },
          { label: "Technical analysis videos, RSI/MACD charts, and breakout alerts.", score: 3 }
        ]
      },
      {
        badge: "8. Purchase Decision",
        text: "From hearing about a stock to clicking 'Buy', how long does it take?",
        hint: "Reflects your patience versus impulse.",
        options: [
          { label: "Instant. It's automated monthly. Zero manual decisions.", score: 0 },
          { label: "A few weeks. Calculate dividend yields and wait for a dip.", score: 1 },
          { label: "Weeks of deep valuation research before putting cash in.", score: 2 },
          { label: "Seconds! Once I see a breakout volume, I hit the buy button.", score: 3 }
        ]
      },
      {
        badge: "9. Leverage View",
        text: "What is your attitude toward margins, options, and warrants?",
        hint: "The multiplier effect.",
        options: [
          { label: "Strictly avoid. Leverage is the fastest way to go bankrupt.", score: 0 },
          { label: "Never touch. I only buy low-volatility stable assets.", score: 1 },
          { label: "Understand them but stick to spot trading quality stocks with cash.", score: 2 },
          { label: "The ultimate wealth accelerator! Max it out on high-conviction trades.", score: 3 }
        ]
      },
      {
        badge: "10. Core Joy",
        text: "What brings you the greatest satisfaction in stock investing?",
        hint: "The psychological reward you chase.",
        options: [
          { label: "Peace of mind seeing my assets compound quietly in the background without my effort.", score: 0 },
          { label: "Receiving dividend notifications and seeing cash hit my account.", score: 1 },
          { label: "Proving my analysis right when an undervalued hidden gem surges.", score: 2 },
          { label: "Timing entries and exits perfectly for quick, active trading profits.", score: 3 }
        ]
      }
    ]
  },
  
  resultText: {
    'zh-TW': {
      passive: {
        title: "佛系定存大師",
        tagline: "「抱住全市場，裝死定額的無為信仰家」",
        desc: "買了直接把 App 刪掉，你就是傳說中的「裝死界天花板」！對你來說，看盤簡直是浪費生命，研究財報像看催眠天書。你最常做的事就是定期定額自動扣款，然後假裝自己根本沒這筆錢。恭喜你，你的交易心態好到可以直接成仙了！",
        vol: "極低（貼近大盤）",
        strength: "幾乎不花時間心力，交易手續費極低，長線勝率高達 90% 以上，免除崩盤焦慮。",
        weakness: "牛市時無法賺取翻倍的超額利潤，過程極度枯燥，且需要信仰挺過長達數年的大熊市。",
        allocation: "80% 全球大盤 ETF (如 VT/VOO) + 15% 穩健債券 + 5% 現金預備。"
      },
      dividend: {
        title: "定息包租公",
        tagline: "「以利息為盾，熱愛每季領紅包的現金流收割者」",
        desc: "股價跌到阿嬤都不認得你也不慌，因為你唯一在乎的是：「配息進帳了沒？」你把股市當成你的自動金雞母，每當股價暴跌，你反而興奮大喊：「又特價了！多買幾張多領利息！」年年躺著領大紅包就是你最大的快樂！",
        vol: "低波動",
        strength: "每期收到的股息能帶來強大的心理安全感，在熊市震盪時最不容易恐慌拋售標的。",
        weakness: "高配息股通常成長性較弱，容易賺了股息卻賠了差價；且容易低估頻繁配息產生的稅務與手續費摩擦成本。",
        allocation: "70% 高股息 ETF/穩健權值股 + 20% 公用事業/基礎設施股 + 10% 高利率定存。"
      },
      value: {
        title: "巴菲特傳人",
        tagline: "「算價值、挖護城河，極具安全邊際的理性評論家」",
        desc: "你是股市裡的「考古學家」，別人在瘋搶發光發熱的明星股，你偏偏愛去市場的垃圾堆裡挖寶！專門挑被低估的賺錢好公司。你買股票就像大媽去菜市場搶打折菜，不便宜、不劃算你絕對不下單。買完就耐心地跟它談一場天荒地老的戀愛，用超強理智熬死所有投機客！",
        vol: "中等偏低",
        strength: "買入成本極具防禦力，不易被市場情緒割韭菜；精準選股在中長線常能創造超凡的回報。",
        weakness: "研究分析極耗心力與財經素養；容易落入「價值陷阱」（即股價便宜但基本面持續惡化），且等待發酵的時期可能無比漫長。",
        allocation: "60% 具備護城河的優質價值股 + 20% 高研發門檻的成長股 + 20% 短期債券。"
      },
      momentum: {
        title: "衝浪急先鋒",
        tagline: "「踩在風口浪尖，追隨強勢股突破的順勢乘風者」",
        desc: "「哪裡熱鬧你就往哪裡擠！」你是天生的股市衝浪手，信奉強者恆強。你最討厭買了不動的死魚股，只要看到成交量暴增、股價正在風口上，你就會二話不說踩著浪頭衝進去！一旦發現風向不對，你拍拍屁股溜得比誰都快！",
        vol: "中高波動",
        strength: "資金效率極高，在大多頭行情中能實現資金的快速翻倍，絕不參與股票的漫長盤整期。",
        weakness: "在箱型整理或震盪市場中容易被「假突破」雙向洗盤（雙巴），需要有極強的停損執行力與心理承受力。",
        allocation: "50% 當季強勢熱門個股 + 30% 動能型 ETF + 20% 機動現金儲備。"
      },
      short: {
        title: "當沖戰神",
        tagline: "「以波動為生，在盤中五檔與即時K線搏殺的極短線獵手」",
        desc: "「手起刀落，賺了就跑！」你是持股絕對不過夜的閃電俠！你的雙眼每天緊盯 K 線的跳動，盤中進去撈一把、賺個便當錢就拍拍屁股收工。半夜美股暴跌、黑天鵝來襲關你屁事？你早就空倉躺平呼呼大睡了。天下武功，唯快不破！",
        vol: "極高波動",
        strength: "持倉不過夜，完美規避了美股大跌或半夜突發黑天鵝利空的隔夜風險，資金周轉率快至極致。",
        weakness: "精神和體力消耗巨大，摩擦成本（手續費、稅金）極高，對心態要求極為嚴苛，一次失控可能導致巨大虧損。",
        allocation: "50% 熱門當沖波動標的 + 30% 當日週轉流動資金 + 20% 絕對安全的定存。"
      },
      leverage: {
        title: "少年股神",
        tagline: "「融資期權全開，以小博大、翻轉命運的冒險家」",
        desc: "「搏一搏，單人房變別墅！」對你來說，慢慢變富簡直是慢性折磨。你的人生字典裡只有「梭哈」與「滿倉全開槓桿」！你看準了就期權、融資通通拉滿，資產要嘛像火箭一樣噴向宇宙，要嘛像流星一樣光速歸零，玩的就是心跳與刺激！",
        vol: "毀滅性高波動",
        strength: "在多頭爆發或趨勢明朗時，能用極少本金在短時間內創造十倍、百倍的暴富神話。",
        weakness: "容錯率極低，一旦市場反向波動，將面臨斷頭、爆倉或權證歸零的滅頂之災，心理承受壓力居全市場之冠。",
        allocation: "40% 槓桿標的（期權/權證/融資現股） + 40% 流動儲備 + 20% 誓死不動的保命定存。"
      }
    },
    'en': {
      passive: {
        title: "Zen Index Master",
        tagline: "“The buy-and-hold passive believer who plays dead to grow wealth”",
        desc: "You are the ultimate 'play dead' legend. You buy a stock, delete the trading app, and check back in a year. While other investors are panicking, you're sleeping like a baby. Who cares about charts? You're already enlightened!",
        vol: "Very Low (Index-Matching)",
        strength: "Zero stress, minimal transaction costs, high long-term historical win rate, and immune to single-company disasters.",
        weakness: "No outperformance (Alpha) during bull runs; requires iron discipline to hold index funds through multi-year recessions.",
        allocation: "80% Global Stock Index ETFs (e.g. VT/VOO) + 15% Core Bonds + 5% Emergency Cash."
      },
      dividend: {
        title: "Dividend Landlord",
        tagline: "“Pragmatic income harvester treating dividends as rental income”",
        desc: "You don't care if the stock price drops to the center of the earth. Your only question is: 'Did my dividend hit?' While others cry during market crashes, you smile and buy more: 'Yay, discount dividends!' Just like collecting rental income.",
        vol: "Low Volatility",
        strength: "Steady passive income provides great peace of mind, making you highly resilient against panic selling during bear markets.",
        weakness: "High-yield stocks often have lower capital growth; risk of dividend cuts during earnings recessions; and high tax friction.",
        allocation: "70% High-Dividend ETFs/Blue-Chips + 20% Defensive Utility Leaders + 10% High-Yield Cash."
      },
      value: {
        title: "Buffett Disciple",
        tagline: "“Rational value hunter purchasing quality business with safety margins”",
        desc: "You are the market archaeologist! While others chase high-flying hype, you dig through the bargain bin with a magnifying glass. You buy stocks like buying discount groceries, and you're ready to hold them until the end of time to outlast all speculators.",
        vol: "Low-Medium Volatility",
        strength: "Highly protected by margin of safety; deep research shields you from market panics, yielding excellent risk-adjusted long-term returns.",
        weakness: "Demands high financial literacy and massive research time; risks falling into value traps (structurally declining cheap stocks)."
      },
      momentum: {
        title: "Momentum Surfer",
        tagline: "“Trend hunter chasing breakout patterns and riding explosive waves”",
        desc: "Wherever the party is, that's where you are! You ride the waves of volume and breakouts, hunting for explosive momentum. If the wind stops blowing, you run faster than anyone else, looking for the next rocket ship.",
        vol: "Medium-High Volatility",
        strength: "Exceptional capital efficiency; captures explosive upside trends quickly while avoiding dead money during long sideways consolidations.",
        weakness: "Vulnerable to sudden pullbacks and false breakouts during choppy sideways markets, requiring absolute discipline to cut losses.",
        allocation: "50% High-Momentum Growth Stocks + 30% Sector ETFs + 20% Tactical Cash."
      },
      short: {
        title: "Day Trading Warlord",
        tagline: "“Lightning-fast scalper extracting daily gains from order book ticks”",
        desc: "You are a financial special forces trader. You trade high-volatility tickers in minutes, grab your daily profits, and close all positions before the bell. Overnight crash? Doesn't affect you—you're already asleep with cash!",
        vol: "Extremely High Volatility",
        strength: "Zero overnight risk from macro black swans or bad earnings; highly active cash compounding; independent of long-term market trends.",
        weakness: "Severe mental and physical exhaustion; very high commission and tax friction; a single emotional breakdown can wipe out weeks of profits.",
        allocation: "50% Active Tickers + 30% Daily Operating Capital + 20% Secure Cash Reserves."
      },
      leverage: {
        title: "Leverage Warlord",
        tagline: "“High-stakes options and margin player chasing exponential growth”",
        desc: "Slow compounding? Too boring! Your investing motto is 'go big or go home.' You load up on margin and options, aiming to shoot your portfolio to the moon or vaporize it into stardust. You play for the ultimate thrills!",
        vol: "Ruinous Volatility",
        strength: "Capable of creating legendary wealth and turning small sums into millions in short periods during clear breakout trends.",
        weakness: "Extremely low margin for error; a slight adverse market move can lead to margin calls, liquidation, or options expiring worthless.",
        allocation: "40% Leveraged Assets (Options/Margin) + 40% Secondary Capital + 20% Strict Emergency Cash."
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
