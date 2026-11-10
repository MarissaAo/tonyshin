showBanner();
const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
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
