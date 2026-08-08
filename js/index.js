const menuBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

const showMenu = () => {
  menu.classList.toggle("active");
  menuBtn.classList.toggle("active");
};

menuBtn.addEventListener("click", showMenu);
