const script = [
    { name: "桜庭シュウ", text: "みんな、お昼ご飯出来たよ", center: "シュウ.png", spk: "center" },
    { name: "川瀬ミナギ", text: "わーい！もうお腹ペコペコだよ〜", left: "ミナギ笑.png", right: "ヤト.png", spk: "left" },
    { name: "阿曇ヤト", text: "シュウちゃんの料理、相変わらず美味しいな", left: "ミナギ笑.png", right: "ヤト.png", spk: "right" },
    { name: "白城カナタ", text: "バランスもいいですし。いつもありがとうございます", left: "イオ.png", right: "カナタ.png", spk: "right", fadeLeft: true, fadeRight: true },
    { name: "小金イオ", text: "…これ、凄い美味しい。好きな味だ", left: "イオ.png" , right: "カナタ.png", spk: "left" },
    { name: "桜庭シュウ", text: "ふふっ、沢山食べるんだよ", center: "シュウ笑.png", spk: "center" },
    { name: "阿曇ヤト", text: "お店とか開いたら絶対繁盛するよね", left: "ミナギ.png", right: "ヤト笑.png", spk: "right" },
    { name: "川瀬ミナギ", text: "うんうん、俺たち毎日通うし", left: "ミナギ笑.png", right: "ヤト.png", spk: "left" },
    { name: "小金イオ", text: "シュウさんの料理ならずっと食べたい", left: "イオ笑.png" , right: "カナタ.png", spk: "left", fadeLeft: true, fadeRight: true },
    { name: "白城カナタ", text: "ええ、同感ですね", left: "イオ笑.png" , right: "カナタ笑.png", spk: "right" },
    { name: "桜庭シュウ", text: "みんな、嬉しいこと言ってくれるね。ありがとう", center: "シュウ笑.png", spk: "center" }
];
let idx = -1, txt = "", cIdx = 0, timer = null, isTyping = false, isEnd = false, isAuto = false, isSkip = false, aTimer = null;
let isMenuOpen = false;

window.onload = function() {
    const area = document.getElementById("menu-area");
    area.style.width = "5vw";
    area.style.height = "5vw";
    area.style.backgroundImage = "url('透かし_off.png')";
    document.getElementById("b-auto").style.width = "0";
    document.getElementById("b-skip").style.width = "0";
    document.getElementById("menu").style.gap = "0";
};

function clickWin(isManual) {
    if (isEnd) return;
    if (isManual && !isTyping) { sAuto(); sSkip(); }

    if (isTyping) { 
        clearInterval(timer); 
        document.getElementById("message-text").innerText = script[idx].text; 
        document.getElementById("next-arrow").style.display = "block"; 
        isTyping = false; 
        if (isAuto) startATimer(); 
        return; 
    }
    
    idx++; 
    if (idx >= script.length) { 
        isEnd = true; sAuto(); sSkip(); 
        document.getElementById("next-arrow").style.display = "none"; 
        document.getElementById("fade-overlay").style.opacity = 1; 
        setTimeout(() => { const b = document.getElementById("retry-btn"); b.style.display = "block"; setTimeout(() => { b.style.opacity = 1; }, 50); }, 1000); 
        return; 
    }
    
    const data = script[idx];
    document.getElementById("speaker-name").innerText = data.name;
    document.getElementById("next-arrow").style.display = "none";
    upSlot("char-left", data.left, "left", data.spk, data.fadeLeft); 
    upSlot("char-center", data.center, "center", data.spk, data.fadeCenter); 
    upSlot("char-right", data.right, "right", data.spk, data.fadeRight);
    
    const textEl = document.getElementById("message-text"); textEl.innerText = ""; txt = data.text; cIdx = 0; isTyping = true;
    clearInterval(timer);
    timer = setInterval(() => {
        if (cIdx < txt.length) { textEl.innerText += txt.charAt(cIdx); cIdx++; }
        else { 
            clearInterval(timer); isTyping = false; 
            document.getElementById("next-arrow").style.display = "block"; 
            if (isSkip) { clearTimeout(aTimer); aTimer = setTimeout(function(){ clickWin(false); }, 100); } 
            else if (isAuto) { startATimer(); } 
        }
    }, isSkip ? 1 : 30);
}

function upSlot(id, src, pos, active, forceFade) {
    const el = document.getElementById(id);
    
    if (src) {

        if (forceFade && !isSkip) {
            el.style.transition = "none";
            el.style.opacity = 0;
            
            setTimeout(function() {
                el.src = src;

                el.onload = function() {
                    el.style.transition = "opacity 0.3s, filter 0.3s, transform 0.2s ease-out";
                    el.style.opacity = 1;
                };
            }, 50);
        } else {

            el.src = src;
            el.style.transition = "opacity 0.3s, filter 0.3s, transform 0.2s ease-out";
            el.style.opacity = 1;
        }

        const isSpk = (pos === active);
        el.style.filter = isSpk ? "brightness(1)" : "brightness(0.75)";
        if (pos === "center") { 
            el.style.transform = isSpk ? "translateX(-50%) translateY(-0.7%)" : "translateX(-50%) translateY(0)"; 
        } else { 
            el.style.transform = isSpk ? "translateY(-0.7%)" : "translateY(0)"; 
        }
    } else { 
        el.style.opacity = 0; 
    }
}

function tMenu(e) {
    e.stopPropagation(); if(isEnd) return;
    isMenuOpen = !isMenuOpen;
    
    const autoBtn = document.getElementById("b-auto");
    const skipBtn = document.getElementById("b-skip");
    const menuContainer = document.getElementById("menu");
    const area = document.getElementById("menu-area");
    
    if (isMenuOpen) {
        autoBtn.classList.add("show");
        skipBtn.classList.add("show");
        autoBtn.style.width = "5vw";
        skipBtn.style.width = "5vw";
        menuContainer.style.gap = "0.5vw";
 
        area.style.width = "16vw";
        area.style.height = "5vw";
        area.style.backgroundImage = "url('透かし_on.png')";
    } else {
        autoBtn.classList.remove("show");
        skipBtn.classList.remove("show");
        autoBtn.style.width = "0";
        skipBtn.style.width = "0";
        menuContainer.style.gap = "0";

        area.style.width = "5vw";
        area.style.height = "5vw";
        area.style.backgroundImage = "url('透かし_off.png')";
    }
}

function tAuto(e) { 
    e.stopPropagation(); if(isEnd) return; 
    sSkip(); isAuto = !isAuto; 
    document.getElementById("b-auto").classList.toggle("active", isAuto); 
    if (isAuto && !isTyping) { clickWin(false); } 
}

function tSkip(e) { 
    e.stopPropagation(); if(isEnd) return; 
    sAuto(); isSkip = !isSkip; 
    document.getElementById("b-skip").classList.toggle("active", isSkip); 
    if (isSkip && !isTyping) { clickWin(false); } 
}

function startATimer() { clearTimeout(aTimer); aTimer = setTimeout(function(){ clickWin(false); }, 1800); }
function sAuto() { isAuto = false; clearTimeout(aTimer); document.getElementById("b-auto").classList.remove("active"); }
function sSkip() { isSkip = false; clearTimeout(aTimer); document.getElementById("b-skip").classList.remove("active"); }

function resetGame() { 
    const b = document.getElementById("retry-btn"); 
    b.style.opacity = 0; setTimeout(() => { b.style.display = "none"; }, 800); 
    document.getElementById("fade-overlay").style.opacity = 0; 
    document.getElementById("char-left").style.opacity = 0; document.getElementById("char-center").style.opacity = 0; document.getElementById("char-right").style.opacity = 0; 
    idx = -1; isEnd = false; sAuto(); sSkip(); 
    isMenuOpen = false;
    document.getElementById("b-auto").classList.remove("show"); 
    document.getElementById("b-skip").classList.remove("show"); 
    
    document.getElementById("b-auto").style.width = "0";
    document.getElementById("b-skip").style.width = "0";
    document.getElementById("menu").style.gap = "0";
    const area = document.getElementById("menu-area");
    area.style.width = "5vw";
    area.style.height = "5vw"; 
    area.style.backgroundImage = "url('透かし_off.png')";
    
    document.getElementById("speaker-name").innerHTML = "<br>"; 
    document.getElementById("message-text").innerText = "クリックして会話をスタート"; 
    document.getElementById("next-arrow").style.display = "none"; 
}
