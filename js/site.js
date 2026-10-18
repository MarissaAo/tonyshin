const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

const closeMenu = () => {
  if (!menu || !menuBtn) return;
  menu.classList.remove("active");
  menuBtn.classList.remove("active");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open menu");
};

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("active");
    menuBtn.classList.toggle("active", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

const page = document.body.dataset.page;
const currentNav = page === "home" || page === "story" ? "frames" : page;

document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === currentNav) {
    link.setAttribute("aria-current", "page");
  }
});

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url}`);
  }
  return response.json();
}

function formatDate(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function byNewest(a, b) {
  if (a.date === b.date) return b.id.localeCompare(a.id);
  return a.date < b.date ? 1 : -1;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function makeCard(post, featured) {
  const link = el("a", featured ? "card card-feature" : "card");
  link.href = `story.html?id=${encodeURIComponent(post.id)}`;

  const media = el("div", "card-media");
  const image = document.createElement("img");
  image.src = post.image;
  image.alt = post.alt || post.title;
  image.width = post.width || 1200;
  image.height = post.height || 900;
  if (!featured) image.loading = "lazy";
  media.append(image);

  if (post.video) {
    media.append(el("span", "play-badge", "Play"));
  }

  const body = el("div", "card-body");
  const time = el("time", "card-date", formatDate(post.date));
  time.dateTime = post.date;
  body.append(time, el(featured ? "h2" : "h3", "card-title", post.title));
  if (post.summary) body.append(el("p", "card-summary", post.summary));
  body.append(el("span", "card-more", "Read this day"));

  link.append(media, body);
  return link;
}

async function renderJournal() {
  const journal = document.querySelector("#journal");
  const status = document.querySelector("#journal-status");
  const count = document.querySelector("#day-count");
  if (!journal) return;

  try {
    const posts = (await loadJson("data/posts.json")).sort(byNewest);
    journal.replaceChildren();

    if (!posts.length) {
      status.textContent = "No days have been added yet.";
      return;
    }

    status.hidden = true;
    const word = posts.length === 1 ? "day" : "days";
    if (count) {
      count.textContent = `${posts.length} ${word}, kept from time to time.`;
    }

    const [latest, ...earlier] = posts;
    const feature = el("section", "feature");
    feature.append(el("p", "eyebrow", "Latest"), makeCard(latest, true));
    journal.append(feature);

    if (earlier.length) {
      const section = el("section", "earlier");
      section.append(el("p", "eyebrow", "Earlier"));
      const grid = el("div", "grid");
      earlier.forEach((post) => grid.append(makeCard(post, false)));
      section.append(grid);
      journal.append(section);
    }
  } catch (error) {
    console.error(error);
    status.textContent = "The journal could not be opened. Refresh the page in a moment.";
  }
}

function mediaFor(post) {
  if (post.video) {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = post.image;
    video.setAttribute("aria-label", post.alt || post.title);
    const source = document.createElement("source");
    source.src = post.video;
    source.type = "video/mp4";
    video.append(source, "Your browser cannot play this clip.");
    return video;
  }

  const image = document.createElement("img");
  image.src = post.image;
  image.alt = post.alt || post.title;
  image.width = post.width || 1200;
  image.height = post.height || 900;
  return image;
}

async function renderStory() {
  const article = document.querySelector("#story-article");
  const status = document.querySelector("#story-status");
  if (!article) return;

  const id = new URLSearchParams(window.location.search).get("id");

  try {
    const posts = (await loadJson("data/posts.json")).sort(byNewest);
    const index = posts.findIndex((post) => post.id === id);
    const post = index === -1 ? null : posts[index];

    if (!post) {
      status.textContent = "That day is not in the journal.";
      const back = el("a", "text-link", "Back to all frames");
      back.href = "index.html#frames";
      status.after(back);
      return;
    }

    document.title = `${post.title} · Tony Shin`;
    status.hidden = true;
    article.hidden = false;

    const back = el("a", "text-link", "All frames");
    back.href = "index.html#frames";

    const time = el("time", "story-date", formatDate(post.date));
    time.dateTime = post.date;

    const figure = el("figure", "story-figure");
    figure.append(mediaFor(post));

    article.append(back, time, el("h1", "story-title", post.title), figure);
    (post.body || []).forEach((paragraph) => {
      article.append(el("p", "story-copy", paragraph));
    });

    const newer = posts[index - 1];
    const older = posts[index + 1];
    const pager = el("nav", "pager");
    pager.setAttribute("aria-label", "Other days");

    if (newer) {
      const link = el("a", "pager-link", `Newer · ${newer.title}`);
      link.href = `story.html?id=${encodeURIComponent(newer.id)}`;
      pager.append(link);
    } else {
      pager.append(el("span", "pager-link is-empty", ""));
    }

    if (older) {
      const link = el("a", "pager-link pager-next", `Older · ${older.title}`);
      link.href = `story.html?id=${encodeURIComponent(older.id)}`;
      pager.append(link);
    }

    article.append(pager);
  } catch (error) {
    console.error(error);
    status.textContent = "This day could not be opened. Refresh the page in a moment.";
  }
}

async function renderQuote() {
  const quoteContent = document.querySelector(".quote-content");
  const quoteAuthor = document.querySelector(".quote-author");
  if (!quoteContent) return;

  let quotes = [];

  const show = (entry) => {
    if (!entry) return;
    quoteContent.textContent = entry.quote;
    if (quoteAuthor) quoteAuthor.textContent = entry.author || "";
  };

  try {
    quotes = await loadJson("data/quotes.json");
    if (!quotes.length) return;
    show(quotes[Math.floor(Math.random() * quotes.length)]);
  } catch (error) {
    console.error(error);
  }

  const button = document.querySelector(".quote-next");
  button?.addEventListener("click", () => {
    if (quotes.length < 2) return;
    const current = quoteContent.textContent;
    let next = quotes[Math.floor(Math.random() * quotes.length)];
    let guard = 0;
    while (next.quote === current && guard < 6) {
      next = quotes[Math.floor(Math.random() * quotes.length)];
      guard += 1;
    }
    show(next);
  });
}

function setupNoteForm() {
  const form = document.querySelector("#note-form");
  if (!form) return;

  const status = document.querySelector("#note-status");
  const preview = document.querySelector("#note-preview");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const message = form.message.value.trim();

    if (!message) {
      status.textContent = "Write a few words first.";
      form.message.focus();
      return;
    }

    const note = name ? `${name}:\n${message}` : message;
    preview.hidden = false;
    preview.textContent = note;

    try {
      await navigator.clipboard.writeText(note);
      status.textContent = "Copied. Paste it into a message when you want to send it on.";
    } catch (error) {
      console.error(error);
      status.textContent = "Select the note below and copy it. This page does not send mail.";
    }
  });
}

renderJournal();
renderStory();
renderQuote();
setupNoteForm();
