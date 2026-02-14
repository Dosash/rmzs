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
