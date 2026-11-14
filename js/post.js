const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

let currentPost = null;

function applyPostTitle() {
  if (!currentPost) return;
  const title = getPostTitle(currentPost);
  const heroTitle = document.querySelector(".post-hero h1");
  if (heroTitle) {
    heroTitle.textContent = title;
  }
  document.title = title + " | Tony Shin";
}

function applyPostMessage() {
  if (!currentPost) return;
  const postMessage = document.querySelector(".message");
  if (!postMessage) return;
  postMessage.textContent = getPostMessage(currentPost);
}

async function getPostDetail() {
  try {
    const res = await fetch("/data/posts.json");
    const posts = await res.json();

    currentPost = posts.find(function (post) {
      return post.id === postId;
    });

    const postContainer = document.querySelector("#post-detail");

    if (!currentPost) {
      const errorMessage = document.createElement("h2");
      errorMessage.textContent = "Sorry! This post was not found.";
      postContainer.appendChild(errorMessage);
      return;
    }

    applyPostTitle();

    const postMessage = document.createElement("p");
    postMessage.classList.add("message");
    if (currentPost.message) {
      postMessage.textContent = getPostMessage(currentPost);
      postContainer.appendChild(postMessage);
    }

    const postDate = document.createElement("p");
    postDate.textContent = currentPost.date;
    postDate.classList.add("post-date");
    postContainer.appendChild(postDate);

    const photoGallery = document.createElement("div");
    photoGallery.classList.add("photo-gallery");
    postContainer.appendChild(photoGallery);

    currentPost.photos.forEach(function (photo) {
      if (photo.includes(".mp4")) {
        const video = document.createElement("video");
        video.setAttribute("src", photo);
        video.setAttribute("controls", "");
        video.setAttribute("playsinline", "");
        photoGallery.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.setAttribute("src", photo);
        img.setAttribute("alt", currentPost.title);
        photoGallery.appendChild(img);
      }
    });
  } catch (error) {
    console.error("Failed to load post details:", error);
  }
}

getPostDetail();

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
