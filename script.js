/* =========================
   R4 - Castle Home (enhanced)
   ========================= */

/* ===== EDIT HERE ===== */
const LINKS = {
  clover: "https://example.com",
  heart:  "https://youtu.be/cUfDOS2SINM",
};

const DIA_IMAGES = ["assets/scheduler/dia.jpg"]; // 1장
const SPADE_IMAGES = [
  "assets/concept/hero.jpg",
  "assets/concept/spade.jpg",
  "assets/concept/R4_Marine_Blue.jpg",
];

/* ===== TEXT ===== */
const TITLES = {
  wand:  "S2 1st EP 【R4】 SPOILER SECRET MUSIC F♡R CURE",
  dia:   "S2 1st EP 【R4】 SCHEDULER",
  spade: "S2 1st EP 【R4】 CONCEPT PHOTO",
  clover:"S2 1st EP 【R4】 HIGHLIGHT MEDLEY",
  heart: "S2 1st EP 【R4】 MV",
};

const DESCS = {
  wand:  "PLAY 하면 다른 창문 눌러도 계속 재생돼.",
  dia:   "포토부스처럼 슬롯에서 인쇄되어 올라오는 스케줄러 (1장). 탭하면 확대.",
  spade: "컨셉 포토: 와바박 생성 + 카드 통째로 드래그 이동 + 탭하면 확대.",
  clover:"외부 링크로 열림",
  heart: "외부 링크로 열림",
};

/* ===== DOM ===== */
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const panelTitle = document.getElementById("panelTitle");
const panelDesc = document.getElementById("panelDesc");
const panelBody = document.getElementById("panelBody");
const resetBtn = document.getElementById("resetBtn");

const spoilerAudio = document.getElementById("spoilerAudio");
const shutterAudio = document.getElementById("shutterAudio");
const flash = document.getElementById("flash");

// lightbox
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");

// cursor layer
const cursorLayer = document.querySelector(".cursorLayer");

/* ===== Overlay control ===== */
function openOverlay(key){
  panelTitle.textContent = TITLES[key] || "R4";
  panelDesc.textContent = DESCS[key] || "";
  panelBody.innerHTML = "";

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");

  if(key === "wand") return renderAudio();
  if(key === "dia") return renderDIA();
  if(key === "spade") return renderSPADE();
  if(key === "clover") return renderLink(LINKS.clover);
  if(key === "heart") return renderLink(LINKS.heart);
}

function closeOverlay(){
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  panelBody.innerHTML = "";
}

closeBtn?.addEventListener("click", closeOverlay);
overlay?.addEventListener("click", (e)=>{ if(e.target === overlay) closeOverlay(); });
window.addEventListener("keydown", (e)=>{ if(e.key==="Escape"){ closeOverlay(); closeLightbox(); }});

resetBtn?.addEventListener("click", ()=>{
  closeOverlay();
  closeLightbox();
});

/* ===== windows click + sparkle from window ===== */
document.querySelectorAll(".win").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const r = btn.getBoundingClientRect();
    sparkleBurst(r.left + r.width*0.5, r.top + r.height*0.45, 18);
    openOverlay(btn.dataset.key);
  });

  // 이미지 로드 실패하면 (콘솔 에러 방지용) 살짝 흐리게
  const img = btn.querySelector("img");
  if(img){
    img.onerror = ()=>{ img.style.opacity = ".25"; };
  }
});

/* ===== Lightbox ===== */
lbClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e)=>{ if(e.target === lightbox) closeLightbox(); });

function openLightbox(src){
  lbImg.src = src;
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox(){
  lbImg.removeAttribute("src");
  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden", "true");
}

/* ===== Audio (persistent) ===== */
if (spoilerAudio){
  spoilerAudio.loop = true;
  spoilerAudio.preload = "auto";
  spoilerAudio.volume = 0.85;
}
if (shutterAudio){
  shutterAudio.volume = 0.9;
}

async function toggleSpoiler(btn){
  if(!spoilerAudio){
    alert("assets/spoiler.mp3 파일이 없어.");
    return;
  }
  try{
    if(spoilerAudio.paused){
      await spoilerAudio.play();
      btn.textContent = "■ STOP";
    }else{
      spoilerAudio.pause();
      btn.textContent = "▶ PLAY";
    }
  }catch(e){
    alert("브라우저 정책 때문에 자동재생이 막힐 수 있어. 버튼 다시 눌러줘.");
  }
}

/* ===== Render blocks ===== */
function renderAudio(){
  const row = document.createElement("div");
  row.className = "magicRow";
  row.style.display = "flex";
  row.style.gap = "12px";
  row.style.flexWrap = "wrap";
  row.style.alignItems = "center";

  const playBtn = document.createElement("button");
  playBtn.className = "magicBtn";
  playBtn.type = "button";
  playBtn.textContent = (spoilerAudio && !spoilerAudio.paused) ? "■ STOP" : "▶ PLAY";
  playBtn.style.borderRadius="999px";
  playBtn.style.border="1px solid rgba(255,255,255,.18)";
  playBtn.style.background="rgba(255,255,255,.08)";
  playBtn.style.color="#fff";
  playBtn.style.padding="12px 16px";
  playBtn.style.cursor="pointer";
  playBtn.addEventListener("click", ()=> toggleSpoiler(playBtn));

  const vol = document.createElement("input");
  vol.type = "range";
  vol.min = "0"; vol.max="1"; vol.step="0.01";
  vol.value = String(spoilerAudio?.volume ?? 0.85);
  vol.style.width = "180px";
  vol.addEventListener("input", ()=>{ if(spoilerAudio) spoilerAudio.volume = parseFloat(vol.value); });

  row.appendChild(playBtn);
  row.appendChild(vol);

  panelBody.appendChild(row);
}

function renderLink(url){
  const a = document.createElement("a");
  a.href = url || "#";
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = "OPEN ↗";
  a.style.display="inline-block";
  a.style.borderRadius="999px";
  a.style.border="1px solid rgba(255,255,255,.18)";
  a.style.background="rgba(255,255,255,.08)";
  a.style.color="#fff";
  a.style.padding="12px 16px";
  a.style.textDecoration="none";
  panelBody.appendChild(a);
}

/* =========================
   DIA: 확실히 “슬롯에서 인쇄”
   ========================= */
function showFlash(){
  if(!flash) return;
  flash.classList.remove("hidden");
  flash.classList.add("show");
  setTimeout(()=>{
    flash.classList.remove("show");
    flash.classList.add("hidden");
  }, 260);
}
async function playShutter(){
  try{
    if(shutterAudio){
      shutterAudio.currentTime = 0;
      await shutterAudio.play();
    }
  }catch(e){}
}

function renderDIA(){
  const booth = document.createElement("div");
  booth.className = "booth";
  panelBody.appendChild(booth);

  // 카드(인쇄물)
  const src = DIA_IMAGES[0];

  const card = document.createElement("div");
  card.className = "printCard"; // ★ 기본은 숨김 상태

  const img = new Image();
  img.src = src;
  img.alt = "DIA 01";
  img.loading = "lazy";
  img.addEventListener("click", ()=> openLightbox(src));

  const cap = document.createElement("div");
  cap.className = "printCap";
  cap.textContent = "DIA 01";

  card.appendChild(img);
  card.appendChild(cap);

  // ★ 순서 중요: 카드 먼저 붙이고, 슬롯을 나중에 붙여서 슬롯이 “위에 덮이게”
  booth.appendChild(card);

  const slot = document.createElement("div");
  slot.className = "slot";
  booth.appendChild(slot);

  // ★ 효과(별가루/셔터/플래시)
  const r = booth.getBoundingClientRect();
  sparkleBurst(r.left + r.width*0.5, r.top + r.height*0.78, 26);
  playShutter();
  showFlash();

  // ★ 다음 프레임에 printing 클래스 붙여서 애니메이션 100% 강제 발동
  requestAnimationFrame(() => {
    card.classList.add("printing");
  });
}


/* =========================
   SPADE: 와바박 생성 + drag + tap zoom
   ========================= */
function renderSPADE(){
  const booth = document.createElement("div");
  booth.className = "booth";
  panelBody.appendChild(booth);

  let i = 0;
  const timer = setInterval(()=>{
    if(i >= SPADE_IMAGES.length){
      clearInterval(timer);
      return;
    }
    dropPolaroid(booth, SPADE_IMAGES[i], `SPADE ${String(i+1).padStart(2,"0")}`);
    i++;
  }, 90);
}

function dropPolaroid(area, src, label){
  const card = document.createElement("div");
  card.className = "polaroid";
  card.style.setProperty("--rot", (-10 + Math.random()*20).toFixed(2) + "deg");
  card._moved = false;

  // random pos within booth
  const a = area.getBoundingClientRect();
  const w = a.width || 900;
  const h = a.height || 560;
  const cardW = window.matchMedia("(max-width:520px)").matches ? 170 : 190;
  const cardH = 220;

  const x = clamp(rand(14, w - cardW - 14), 10, w - cardW - 10);
  const y = clamp(rand(14, h - cardH - 14), 10, h - cardH - 10);

  card.style.left = `${x}px`;
  card.style.top = `${y}px`;

  // delete
  const del = document.createElement("button");
  del.className = "pDel";
  del.type = "button";
  del.textContent = "×";
  del.addEventListener("click", (e)=>{
    e.stopPropagation();
    card.style.transition = "transform .18s, opacity .18s";
    card.style.opacity = "0";
    card.style.transform = "scale(.96) rotate(var(--rot))";
    setTimeout(()=>card.remove(), 180);
  });

  // img
  const img = new Image();
  img.src = src;
  img.alt = label;
  img.loading = "lazy";
  img.draggable = false;
  img.addEventListener("dragstart", (e)=>e.preventDefault());

  // caption
  const cap = document.createElement("div");
  cap.className = "pCap";
  cap.textContent = label;

  card.appendChild(img);
  card.appendChild(del);
  card.appendChild(cap);

  area.appendChild(card);

  // spawn sparkle
  const rect = card.getBoundingClientRect();
  sparkleBurst(rect.left + rect.width*0.72, rect.top + rect.height*0.28, 14);

  // drag + tap zoom
  makeDraggable(card, area);

  card.addEventListener("pointerup", (e)=>{
    if(e.target && e.target.classList && e.target.classList.contains("pDel")) return;
    if(card._moved) return;
    openLightbox(src);
  });
}

function makeDraggable(card, area){
  let pid = null;
  let down = false;
  let startX=0, startY=0;
  let baseLeft=0, baseTop=0;
  const threshold = 6;

  card.addEventListener("pointerdown", (e)=>{
    if(e.target && e.target.classList && e.target.classList.contains("pDel")) return;
    pid = e.pointerId;
    card.setPointerCapture(pid);
    down = true;
    card._moved = false;
    startX = e.clientX; startY = e.clientY;
    baseLeft = parseFloat(card.style.left || "0");
    baseTop  = parseFloat(card.style.top  || "0");
  });

  card.addEventListener("pointermove", (e)=>{
    if(!down || e.pointerId !== pid) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if(!card._moved && Math.hypot(dx,dy) > threshold) card._moved = true;
    if(!card._moved) return;

    const a = area.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    const maxLeft = a.width - r.width;
    const maxTop  = a.height - r.height;

    card.style.left = `${clamp(baseLeft + dx, 0, maxLeft)}px`;
    card.style.top  = `${clamp(baseTop  + dy, 0, maxTop)}px`;
  });

  card.addEventListener("pointerup", (e)=>{
    if(e.pointerId !== pid) return;
    setTimeout(()=>{ card._moved = false; }, 0);
    down = false; pid = null;
  });

  card.addEventListener("pointercancel", ()=>{
    down = false; pid = null;
  });
}

/* ===== sparkles ===== */
function sparkleBurst(x, y, count=12){
  for(let i=0;i<count;i++){
    const s = document.createElement("div");
    s.className = "cursorStar";
    s.style.left = x+"px";
    s.style.top  = y+"px";
    cursorLayer.appendChild(s);

    const a = Math.random()*Math.PI*2;
    const d = 18 + Math.random()*48;
    s.animate([
      { transform:`translate(-50%,-50%) scale(1) rotate(0deg)`, opacity: 1 },
      { transform:`translate(${Math.cos(a)*d}px, ${Math.sin(a)*d}px) scale(.22) rotate(240deg)`, opacity: 0 }
    ], { duration: 560, easing:"cubic-bezier(.2,.9,.2,1)" });

    setTimeout(()=>s.remove(), 980);
  }
}

/* cursor trail */
let lastX=0, lastY=0, lastT=0;
function spawnStar(x,y){
  const s = document.createElement("div");
  s.className = "cursorStar";
  s.style.left = x+"px";
  s.style.top  = y+"px";
  cursorLayer.appendChild(s);
  setTimeout(()=>s.remove(), 980);
}
function onMove(x,y){
  const now = performance.now();
  if(now - lastT < 14) return;
  const dx = x - lastX, dy = y - lastY;
  if(Math.hypot(dx,dy) < 4) return;
  lastX=x; lastY=y; lastT=now;
  spawnStar(x,y);
  if(Math.random()<0.32) spawnStar(x + (Math.random()*18-9), y + (Math.random()*18-9));
}
window.addEventListener("mousemove", (e)=>onMove(e.clientX,e.clientY), {passive:true});
window.addEventListener("touchmove", (e)=>{
  const t = e.touches && e.touches[0];
  if(t) onMove(t.clientX,t.clientY);
},{passive:true});

/* utils */
function rand(min, max){ return min + Math.random()*(max-min); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
