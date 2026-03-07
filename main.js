document.addEventListener("DOMContentLoaded", () => {
  setFooterYear();

  const showToast = createToastController();
  bindActionButtons(showToast);

  initLightbox();
  initServerStatus();
  initAnalytics();
});

const SERVERS_API_URL = "https://player.rmzs.ru/api/servers";
const SERVERS_REFRESH_INTERVAL_MS = 15000;

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function createToastController() {
  const toast = document.getElementById("toast");
  let toastTimer = null;

  return (text) => {
    if (!toast) {
      return;
    }

    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 1400);
  };
}

async function copyText(text, showToast) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Скопировано ✅");
    return;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      showToast("Скопировано ✅");
    } catch {
      showToast("Не удалось скопировать");
    } finally {
      textarea.remove();
    }
  }
}

function connectTo(ip) {
  window.location.href = `steam://connect/${ip}`;
}

function bindActionButtons(showToast) {
  document.addEventListener("click", (event) => {
    const copyBtn = event.target.closest("[data-copy]");
    if (copyBtn) {
      const selector = copyBtn.getAttribute("data-copy");
      const ip = document.querySelector(selector)?.textContent?.trim() || "";
      if (ip) {
        copyText(ip, showToast);
      }
      return;
    }

    const connectBtn = event.target.closest("[data-connect]");
    if (connectBtn) {
      const selector = connectBtn.getAttribute("data-connect");
      const ip = document.querySelector(selector)?.textContent?.trim() || "";

      if (ip) {
        connectTo(ip);
      } else {
        showToast("IP не задан");
      }
    }
  });
}

function initLightbox() {
  const lightbox = ensureLightbox();
  if (!lightbox) {
    return;
  }

  const lightboxBody = lightbox.querySelector(".lightbox-body");

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lightboxBody.innerHTML = "";
  };

  const openLightbox = (node) => {
    lightboxBody.innerHTML = "";
    lightboxBody.appendChild(node);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const openLightboxImage = (src, alt) => {
    const image = document.createElement("img");
    image.className = "lightbox-img";
    image.src = src;
    image.alt = alt || "";
    image.addEventListener("click", closeLightbox);

    openLightbox(image);
  };

  const openLightboxVideo = (videoId) => {
    const iframe = document.createElement("iframe");
    iframe.className = "lightbox-video";
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = "YouTube video player";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    openLightbox(iframe);
  };

  document.addEventListener("click", (event) => {
    const image = event.target.closest("img.zoomable");
    if (image) {
      openLightboxImage(image.currentSrc || image.src, image.alt);
      return;
    }

    const video = event.target.closest("[data-video-id]");
    if (video) {
      const videoId = video.getAttribute("data-video-id");
      if (videoId) {
        openLightboxVideo(videoId);
      }
    }
  });

  lightbox.addEventListener("click", (event) => {
    if (
      event.target === lightbox ||
      event.target.closest("[data-lightbox-close]")
    ) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

function ensureLightbox() {
  let lightbox = document.getElementById("lightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox";
    document.body.appendChild(lightbox);
  }

  lightbox.className = "lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = [
    '<button class="lightbox-close" data-lightbox-close aria-label="Закрыть">✕</button>',
    '<div class="lightbox-body"></div>',
  ].join("");

  return lightbox;
}

function setServerField(card, field, value) {
  const element = card.querySelector(`[data-field="${field}"]`);
  if (element) {
    element.textContent = value;
  }
}

function updateServerCard(card, server) {
  const isOnline = Boolean(server.online);

  card.classList.toggle("online", isOnline);
  card.classList.toggle("offline", !isOnline);

  const statusEl = card.querySelector('[data-field="status"]');
  if (statusEl) {
    statusEl.textContent = isOnline ? "🟩" : "🟥";
    statusEl.title = isOnline ? "Online" : "Offline";
  }

  const map = server.map || "—";
  const players = server.players ?? 0;
  const maxPlayers = server.maxPlayers ?? "—";

  setServerField(card, "map", map);
  setServerField(card, "players", `${players}/${maxPlayers}`);
}

async function initServerStatus() {
  const cards = Array.from(document.querySelectorAll(".server[data-server-id]"));
  if (cards.length === 0) {
    return;
  }

  const refreshServers = async () => {
    try {
      const response = await fetch(SERVERS_API_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const list = Array.isArray(payload.servers) ? payload.servers : [];

      for (const server of list) {
        const card = document.querySelector(`.server[data-server-id="${server.id}"]`);
        if (card) {
          updateServerCard(card, server);
        }
      }

      const updated = document.getElementById("serversUpdatedAt");
      if (updated && payload.updatedAt) {
        updated.textContent = new Date(payload.updatedAt).toLocaleString("ru-RU");
      }
    } catch (error) {
      console.warn("[servers] update failed:", error);
    }
  };

  await refreshServers();
  setInterval(refreshServers, SERVERS_REFRESH_INTERVAL_MS);
}

function initAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", "G-THM8WWN17L");
}
