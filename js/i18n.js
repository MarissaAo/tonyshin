let ui = {};
let currentLang = localStorage.getItem("lang") || "en";

function getPostTitle(post) {
  if (currentLang === "zh-TW") {
    return post.titleZh || post.title;
  }
  if (currentLang === "ko") {
    return post.titleKo || post.title;
  }
  return post.title;
}

function getPostMessage(post) {
  if (currentLang === "zh-TW") {
    return post.messageZh || post.message;
  }
  if (currentLang === "ko") {
    return post.messageKo || post.message;
  }
  return post.message;
}

async function initI18n() {
  const res = await fetch("/data/ui.json");
  ui = await res.json();
  applyTranslations(currentLang);
}

function applyTranslations(lang) {
  currentLang = lang;
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const text = ui[lang] && ui[lang][key];
    if (text) element.textContent = text;
  });

  const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    const text = ui[lang] && ui[lang][key];
    if (text) element.placeholder = text;
  });
  document.documentElement.lang = lang;

  if (typeof applyFilters === "function") {
    applyFilters();
  }

  if (typeof applyPostTitle === "function") {
    applyPostTitle();
  }

  if (typeof applyPostMessage === "function") {
    applyPostMessage();
  }
}

const langLinks = document.querySelectorAll(".lang-link");
langLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const label = link.textContent.trim();
    const langMap = {
      ENG: "en",
      中: "zh-TW",
      한: "ko",
    };
    const lang = langMap[label];
    if (lang) {
      localStorage.setItem("lang", lang);
      applyTranslations(lang);
    }
  });
});

initI18n();
