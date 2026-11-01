const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

const quoteContent = document.querySelector(".quote-content");
const quoteAuthor = document.querySelector(".author");

let allPosts = [];
let currentCategory = "all";
let searchText = "";

function getFilteredPosts() {
  return allPosts.filter(function (post) {
    const matchCategory =
      currentCategory === "all" || post.category === currentCategory;
    const q = searchText.toLowerCase();
    const matchSearch =
      q === "" ||
      post.title.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });
}

function renderGrid(postList, container) {
  postList.forEach(function (post, index) {
    const div = document.createElement("div");
    div.classList.add("photobox", `box${index + 1}`);

    const link = document.createElement("a");
    link.setAttribute("href", `post.html?id=${post.id}`);

    const img = document.createElement("img");
    img.setAttribute("src", post.cover);
    img.setAttribute("alt", post.title);

    const date = document.createElement("div");
    date.classList.add("date");
    date.textContent = post.date;

    const subject = document.createElement("div");
    subject.classList.add("subject");
    subject.textContent = post.title;

    container.appendChild(div);
    div.appendChild(link);
    link.appendChild(img);
    div.appendChild(date);
    div.appendChild(subject);
  });
}

function renderPosts(postList) {
  const postContainer = document.querySelector("#post-container");
  const oldPost = document.querySelector(".old-post");
  const btn = document.querySelector(".show-more");
  const showLess = document.querySelector(".show-less");

  postContainer.innerHTML = "";
  oldPost.innerHTML = "";

  renderGrid(postList.slice(0, 5), postContainer);

  const rest = postList.slice(5);
  for (let i = 0; i < Math.min(10, rest.length); i = i + 5) {
    const div = document.createElement("div");
    div.classList.add("post");
    oldPost.appendChild(div);
    renderGrid(rest.slice(i, i + 5), div);
  }

  let shown = Math.min(10, rest.length);
  showLess.style.display = "none";
  btn.style.display = rest.length > 10 ? "block" : "none";

  btn.onclick = function () {
    const div = document.createElement("div");
    div.classList.add("post");
    oldPost.appendChild(div);
    renderGrid(rest.slice(shown, shown + 5), div);
    shown = shown + 5;
    showLess.style.display = "block";
    if (shown >= rest.length) btn.style.display = "none";
  };

  showLess.onclick = function () {
    const grids = oldPost.querySelectorAll(".post");
    for (let i = grids.length - 1; i >= 2; i--) grids[i].remove();
    shown = Math.min(10, rest.length);
    showLess.style.display = "none";
    btn.style.display = rest.length > 10 ? "block" : "none";
  };
}

function applyFilters() {
  renderPosts(getFilteredPosts());
}

document.querySelectorAll(".filter-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    button.classList.add("active");
    currentCategory = button.getAttribute("data-category");
    applyFilters();
  });
});

document.querySelector("#search-input").addEventListener("input", function (e) {
  searchText = e.target.value;
  applyFilters();
});

async function getPost() {
  const res = await fetch("/data/posts.json");
  const posts = await res.json();

  allPosts = posts;
  applyFilters();
}
getPost();

const toggleMenu = () => {
  menu.classList.toggle("active");
  menuBtn.classList.toggle("active");
};

menuBtn.addEventListener("click", toggleMenu);

async function showBanner() {
  const response = await fetch("/data/image.json");
  const images = await response.json();

  function pickOne() {
    const i = Math.floor(Math.random() * images.length);
    const img = document.querySelector(".banner img");
    img.setAttribute("src", images[i].source);
    img.setAttribute("alt", images[i].title);
  }

  pickOne();
  setInterval(pickOne, 3000);
}

showBanner();

async function getQuote() {
  const res = await fetch("/data/quotes.json");
  const quotes = await res.json();

  function showQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteContent.textContent = randomQuote.quote;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
  }
  showQuote();
  setInterval(showQuote, 8000);
}
getQuote();
