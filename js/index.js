const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const quoteContent = document.querySelector(".quote-content");

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
