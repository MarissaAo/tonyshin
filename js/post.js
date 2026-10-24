const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function getPostDetail() {
  try {
    const res = await fetch("/data/posts.json");
    const posts = await res.json();

    const currentPost = posts.find(function (post) {
      return post.id === postId;
    });

    const postContainer = document.querySelector("#post-detail");

    if (!currentPost) {
      const errorMessage = document.createElement("h2");
      errorMessage.textContent = "Sorry! This post was not found.";
      postContainer.appendChild(errorMessage);

      return;
    }

    const postTitle = document.createElement("h2");
    postTitle.textContent = currentPost.title;

    const postDate = document.createElement("p");
    postDate.textContent = currentPost.date;

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postDate);

    const photoGallery = document.createElement("div");
    photoGallery.classList.add("photo-gallery");

    postContainer.appendChild(photoGallery);

    currentPost.photos.forEach(function (photo) {
      const img = document.createElement("img");
      img.setAttribute("src", photo);
      img.setAttribute("alt", currentPost.title);

      photoGallery.appendChild(img);
    });
  } catch (error) {
    console.error("Failed to load post details:", error);
  }
}

getPostDetail();
