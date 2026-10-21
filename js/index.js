const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

const quoteContent = document.querySelector(".quote-content");

async function getPost() {
  const res = await fetch("/data/posts.json");
  const posts = await res.json();

  const fivePost = posts.slice(0, 5);

  fivePost.forEach(function (post, index) {
    const postContainer = document.querySelector("#post-container");

    const div = document.createElement("div");
    div.classList.add("photobox", `box${index + 1}`);

    const img = document.createElement("img");
    img.setAttribute("src", post.cover);
    img.setAttribute("alt", post.title);

    const date = document.createElement("div");
    date.classList.add("date");
    date.textContent = post.date;

    const subject = document.createElement("div");
    subject.classList.add("subject");
    subject.textContent = post.title;

    postContainer.appendChild(div);
    div.appendChild(img);
    div.appendChild(date);
    div.appendChild(subject);
  });
}

getPost();

// <div class="photobox box1">
//     <img src="/assets/image/20260801/20260801_cover.JPG" alt="Hot Weather">
//     <div class="date">01 Aug 2026</div>
//     <div class="subject">Hot</div>
// </div>

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
