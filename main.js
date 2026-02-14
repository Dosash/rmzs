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
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  // Если lightbox не добавлен в HTML — просто пропускаем
  if (!lightbox || !lightboxImg || !lightboxClose) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      lightboxImg.src = "";
      lightboxImg.alt = "";
    }, 50);
  }

  // Клик по картинке с классом .zoomable
  document.addEventListener("click", (e) => {
    const img = e.target.closest("img.zoomable");
    if (!img) return;
    openLightbox(img.currentSrc || img.src, img.alt);
  });

  // Закрытие
  lightboxClose.addEventListener("click", closeLightbox);

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
  lightboxImg.addEventListener("click", closeLightbox);
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
      else showToast("IP не задан");
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
setServerField(card, "map", s.map || "—");
setServerField(card, "players", `${s.players ?? 0}/${s.maxPlayers ?? "—"}`);

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