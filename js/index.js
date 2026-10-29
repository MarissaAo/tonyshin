const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

const quoteContent = document.querySelector(".quote-content");

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

async function getPost() {
  const res = await fetch("/data/posts.json");
  const posts = await res.json();

  const fivePost = posts.slice(0, 5);
  const postContainer = document.querySelector("#post-container");

  renderGrid(fivePost, postContainer);

  const oldPost = document.querySelector(".old-post");
  const btn = document.querySelector(".show-more");
  const showLess = document.querySelector(".show-less");
  const rest = posts.slice(5);

  for (let i = 0; i < 10; i = i + 5) {
    const div = document.createElement("div");
    div.classList.add("post");
    oldPost.appendChild(div);
    renderGrid(rest.slice(i, i + 5), div);
  }

  let shown = 10;
  showLess.style.display = "none";
  btn.addEventListener("click", function () {
    const div = document.createElement("div");
    div.classList.add("post");
    oldPost.appendChild(div);
    renderGrid(rest.slice(shown, shown + 5), div);
    shown = shown + 5;
    showLess.style.display = "block";

    if (shown >= rest.length) {
      btn.style.display = "none";
    }
  });

  showLess.addEventListener("click", function () {
    const grids = oldPost.querySelectorAll(".post");
    for (let i = grids.length - 1; i >= 2; i--) {
      grids[i].remove();
    }
    shown = 10;
    showLess.style.display = "none";
    btn.style.display = "block";
  });
}

getPost();

const toggleMenu = () => {
  menu.classList.toggle("active");
  menuBtn.classList.toggle("active");
};

menuBtn.addEventListener("click", toggleMenu);

async function getQuote() {
  try {
    const res = await fetch("/data/quotes.json");
    const quotes = await res.json();

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteContent.textContent = randomQuote.quote;
  } catch (error) {
    console.error("Failed to load quotes:", error);
  }
}
getQuote();

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
  setInterval(pickOne, 1500);
}

showBanner();
