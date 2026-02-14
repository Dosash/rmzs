document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) Год в футере
  // =========================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // =========================
  // 2) Toast (уведомление)
  // =========================
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Скопировано ✅");
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Скопировано ✅");
    }
  }

  function connectTo(ip) {
    // Откроет Steam / Garry’s Mod
    window.location.href = "steam://connect/" + ip;
  }

  // Делегирование кликов по кнопкам Copy / Connect
  document.addEventListener("click", (e) => {
    const copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) {
      const selector = copyBtn.getAttribute("data-copy");
      const ip = document.querySelector(selector)?.textContent?.trim() || "";
      if (ip) copyText(ip);
      return;
    }

    const connectBtn = e.target.closest("[data-connect]");
    if (connectBtn) {
      const selector = connectBtn.getAttribute("data-connect");
      const ip = document.querySelector(selector)?.textContent?.trim() || "";
      if (ip) connectTo(ip);
      else showToast("IP не задан");
      return;
    }
  });

  // =========================
  // 3) Lightbox (увеличение картинок)
  // =========================
  let lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightboxImg");
  let lightboxClose = document.getElementById("lightboxClose");

  // Если lightbox не добавлен в HTML, создаем его динамически
  if (!lightbox || !lightboxImg || !lightboxClose) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.id = "lightbox";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = '<button class="lightbox-close" id="lightboxClose" aria-label="Закрыть">✕</button><img class="lightbox-img" id="lightboxImg" alt="">';
    document.body.appendChild(box);

    lightbox = box;
    lightboxImg = box.querySelector("#lightboxImg");
    lightboxClose = box.querySelector("#lightboxClose");
  }

  function openLightboxImage(src, alt) {
    lightbox.innerHTML = '<button class="lightbox-close" id="lightboxClose" aria-label="Закрыть">✕</button><img class="lightbox-img" id="lightboxImg" alt="">';
    lightboxImg = lightbox.querySelector("#lightboxImg");
    lightboxClose = lightbox.querySelector("#lightboxClose");
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightboxImg.addEventListener("click", closeLightbox);
    bindLightboxClose();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function openLightboxVideo(videoId) {
    lightbox.innerHTML = '<button class="lightbox-close" id="lightboxClose" aria-label="Закрыть">✕</button><iframe class="lightbox-img" style="width:min(1100px,92vw);height:min(62vw,86vh);max-height:86vh;aspect-ratio:16/9;border:0;" src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    lightboxClose = lightbox.querySelector("#lightboxClose");
    bindLightboxClose();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      lightbox.innerHTML = '<button class="lightbox-close" id="lightboxClose" aria-label="Закрыть">✕</button><img class="lightbox-img" id="lightboxImg" alt="">';
      lightboxImg = lightbox.querySelector("#lightboxImg");
      lightboxClose = lightbox.querySelector("#lightboxClose");
      bindLightboxClose();
      lightboxImg.addEventListener("click", closeLightbox);
    }, 50);
  }

  function bindLightboxClose() {
    if (!lightboxClose) return;
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // Клик по картинке с классом .zoomable
  document.addEventListener("click", (e) => {
    const img = e.target.closest("img.zoomable");
    if (img) {
      openLightboxImage(img.currentSrc || img.src, img.alt);
      return;
    }

    const video = e.target.closest("[data-video-id]");
    if (video) {
      const videoId = video.getAttribute("data-video-id");
      if (videoId) openLightboxVideo(videoId);
    }
  });

  bindLightboxClose();

  // Клик по фону
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  // Клик по самой картинке (удобно на мобиле)
  if (lightboxImg) lightboxImg.addEventListener("click", closeLightbox);
});


// =========================
// Начало основного кода, который выполняет проверку онлайн-статуса сервера и количество игроков.
// =========================

const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(text){
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  async function copyText(text){
    try{
      await navigator.clipboard.writeText(text);
      showToast("Скопировано ✅");
    }catch(e){
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Скопировано ✅");
    }
  }

  function connectTo(ip){
    window.location.href = "steam://connect/" + ip;
  }

  document.addEventListener("click", (e) => {
    const copyBtn = e.target.closest("[data-copy]");
    if(copyBtn){
      const selector = copyBtn.getAttribute("data-copy");
      const ip = document.querySelector(selector)?.textContent?.trim() || "";
      if(ip) copyText(ip);
    }

    const connectBtn = e.target.closest("[data-connect]");
    if(connectBtn){
      const selector = connectBtn.getAttribute("data-connect");
      const ip = document.querySelector(selector)?.textContent?.trim() || "";
      if(ip) connectTo(ip);
      else showToast("IP РЅРµ Р·Р°РґР°РЅ");
    }
  });

  // ===== LIVE DATA: map + players =====
  const SERVERS_API_URL = "https://player.rmzs.ru/api/servers";

  function setServerField(card, field, value){
    const el = card.querySelector(`[data-field="${field}"]`);
    if(el) el.textContent = value ?? "—";
  }

  async function refreshServers(){
    try{
      const res = await fetch(SERVERS_API_URL, { cache: "no-store" });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const list = Array.isArray(data.servers) ? data.servers : [];
      for(const s of list){
        const card = document.querySelector(`.server[data-server-id="${s.id}"]`);
        if(!card) continue;

        const isOnline = !!s.online;

// классы для стилей
card.classList.toggle("offline", !isOnline);
card.classList.toggle("online", isOnline);

// смайлик статуса
const statusEl = card.querySelector('[data-field="status"]');
if(statusEl){
  statusEl.textContent = isOnline ? "🟩" : "🟥";     // зелёный/красный смайл
  statusEl.title = isOnline ? "Online" : "Offline";
}

// остальные поля
setServerField(card, "map", s.map || "вЂ”");
setServerField(card, "players", `${s.players ?? 0}/${s.maxPlayers ?? "вЂ”"}`);

      }

      const updated = document.getElementById("serversUpdatedAt");
      if(updated && data.updatedAt){
        updated.textContent = new Date(data.updatedAt).toLocaleString("ru-RU");
      }
    }catch(err){
      // Если API недоступен — просто не обновляем, сайт продолжит работать
      console.warn("[servers] update failed:", err);
    }
  }

  // первая загрузка + автообновление
  refreshServers();
  setInterval(refreshServers, 15000);

  // =========================
  // Конец основного кода, который выполняет проверку онлайн-статуса сервера и количество игроков.
  // =========================

  // =========================
  // 4) Google Analytics
  // =========================

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-THM8WWN17L');

 // =========================
 // Конец кода для Google Analytics
 // =========================


