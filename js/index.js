const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

const quoteContent = document.querySelector(".quote-content");

async function getPost() {
  const res = await fetch("/data/posts.json");
  const posts = await res.json();

  const fivePost = posts.slice(0, 5);
  const postContainer = document.querySelector("#post-container");

  fivePost.forEach(function (post, index) {
    const div = document.createElement("div");
    div.classList.add("photobox", `box${index + 1}`);

    const link = document.createElement("a");
    link.setAttribute("href", `post.html?id=${post.id}`);
    // link.setAttribute("target", "_blank");

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
    div.appendChild(link);
    link.appendChild(img);
    div.appendChild(date);
    div.appendChild(subject);
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
