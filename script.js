const stageTitle = document.getElementById("stageTitle");
const stageDesc  = document.getElementById("stageDesc");
const stageBody  = document.getElementById("stageBody");
const resetBtn   = document.getElementById("resetBtn");

const spoilerAudio = document.getElementById("spoilerAudio");

// lightbox
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e)=>{ if(e.target===lightbox) closeLightbox(); });

function openLightbox(src){
  lbImg.src = src;
  lightbox.classList.remove("hidden");
}
function closeLightbox(){
  lbImg.removeAttribute("src");
  lightbox.classList.add("hidden");
}

const TITLES = {
  wand:  'S2 1st EP 【R4】 SPOILER SECRET MUSIC F♡R CURE',
  dia:   'S2 1st EP 【R4】 SCHEDULER',
  spade: 'S2 1st EP 【R4】 CONCEPT PHOTO',
  clover:'S2 1st EP 【R4】 HIGHLIGHT MEDLEY',
  heart: 'S2 1st EP 【R4】 MV'
};

// ✅ 여기 링크만 너 걸로 바꿔
const LINKS = {
  clover: "https://example.com",
  heart:  "https://example.com"
};

// ✅ 사진 목록: 파일이 없어도 placeholder로 뜨니 “안 보임” 안 생김
const DIA_IMAGES = [
  "assets/scheduler/01.jpg",
  "assets/scheduler/02.jpg",
  "assets/scheduler/03.jpg",
  "assets/scheduler/04.jpg",
  "assets/scheduler/05.jpg",
];

const SPADE_IMAGES = [
  "assets/concept/01.jpg",
  "assets/concept/02.jpg",
  "assets/concept/03.jpg",
  "assets/concept/04.jpg",
  "assets/concept/05.jpg",
];

document.querySelectorAll(".dockItem").forEach(b=>{
  b.addEventListener("click", ()=>render(b.dataset.key));
});

resetBtn.addEventListener("click", resetAll);

function resetAll(){
  stopAudio();
  stageTitle.textContent = "R4";
  stageDesc.textContent = "아이콘을 눌러 컨텐츠를 열어줘.";
  stageBody.innerHTML = `
    <div class="empty">
      <div class="emptyBig">R4</div>
      <div class="emptySmall">작은 아이콘을 눌러 시작.</div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior:"smooth" });
}

function stopAudio(){
  if (!spoilerAudio) return;
  spoilerAudio.pause();
  spoilerAudio.currentTime = 0;
}

function render(key){
  stopAudio();
  stageTitle.textContent = TITLES[key] || "R4";

  stageBody.innerHTML = "";

  if (key === "wand") {
    stageDesc.textContent = "PLAY를 눌러야 모바일에서도 재생됨";
    renderAudio();
    scrollToStage();
    return;
  }

  if (key === "dia") {
    stageDesc.textContent = "사진 클릭: 크게 보기 · X: 삭제";
    renderGrid(DIA_IMAGES, "DIA");
    scrollToStage();
    return;
  }

  if (key === "spade") {
    stageDesc.textContent = "사진 클릭: 크게 보기 · X: 삭제";
    renderGrid(SPADE_IMAGES, "SPADE");
    scrollToStage();
    return;
  }

  if (key === "clover") {
    stageDesc.textContent = "외부 링크로 이동";
    renderLink(LINKS.clover);
    scrollToStage();
    return;
  }

  if (key === "heart") {
    stageDesc.textContent = "외부 링크로 이동";
    renderLink(LINKS.heart);
    scrollToStage();
    return;
  }
}

function scrollToStage(){
  document.getElementById("stage").scrollIntoView({ behavior:"smooth", block:"start" });
}

function renderAudio(){
  const box = document.createElement("div");
  box.className = "box";

  const t = document.createElement("div");
  t.className = "boxTitle";
  t.textContent = "SPOILER MUSIC";

  const n = document.createElement("div");
  n.className = "boxNote";
  n.textContent = "파일: assets/spoiler.mp3 (없으면 안내가 뜸)";

  const btn = document.createElement("button");
  btn.className = "btn";
  btn.type = "button";
  btn.textContent = "▶ PLAY";

  btn.addEventListener("click", async ()=>{
    try{
      if (!spoilerAudio) {
        alert("오디오 태그가 없어. index.html에 spoilerAudio 확인!");
        return;
      }

      // 파일이 없거나 경로 틀리면 play에서 실패할 수 있음
      if (spoilerAudio.paused) {
        await spoilerAudio.play();
        btn.textContent = "■ STOP";
      } else {
        stopAudio();
        btn.textContent = "▶ PLAY";
      }
    } catch(e){
      console.error(e);
      alert("음악이 안 나오면 assets/spoiler.mp3 파일명/경로(대소문자) 확인해.");
    }
  });

  box.appendChild(t);
  box.appendChild(n);
  box.appendChild(btn);
  stageBody.appendChild(box);
}

function renderLink(url){
  const box = document.createElement("div");
  box.className = "box";

  const n = document.createElement("div");
  n.className = "boxNote";
  n.textContent = "OPEN 버튼을 누르면 새 탭으로 열림";

  const a = document.createElement("a");
  a.className = "btn";
  a.href = url || "#";
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = "OPEN ↗";

  box.appendChild(n);
  box.appendChild(a);
  stageBody.appendChild(box);
}

function renderGrid(list, tag){
  const grid = document.createElement("div");
  grid.className = "grid";

  list.forEach((src, i)=>{
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${i * 55}ms`; // 와다다

    const del = document.createElement("button");
    del.className = "del";
    del.type = "button";
    del.textContent = "×";

    del.addEventListener("click", (e)=>{
      e.stopPropagation();
      card.style.transition = "transform .18s, opacity .18s";
      card.style.transform = "scale(.96)";
      card.style.opacity = "0";
      setTimeout(()=>card.remove(), 180);
    });

    const label = document.createElement("div");
    label.className = "tag";
    label.textContent = `${tag} ${String(i+1).padStart(2,"0")}`;

    const img = new Image();
    img.className = "thumbImg";
    img.alt = `${tag} ${i+1}`;
    img.loading = "lazy";
    img.src = src;

    img.addEventListener("click", ()=>openLightbox(src));

    img.onerror = () => {
      // 이미지가 없으면 placeholder를 넣어서 "안 보임" 방지
      img.remove();
      const ph = document.createElement("div");
      ph.className = "placeholder";
      ph.innerHTML = `MISSING<br><b>${src}</b>`;
      card.appendChild(ph);
    };

    card.appendChild(img);
    card.appendChild(del);
    card.appendChild(label);
    grid.appendChild(card);
  });

  stageBody.appendChild(grid);
}

// 처음 상태
resetAll();
