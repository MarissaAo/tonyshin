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

    const postTitle = document.createElement("h2");
    postTitle.textContent = currentPost.title;

    const postDate = document.createElement("p");
    postDate.textContent = currentPost.date;

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postDate);

    currentPost.photos.forEach(function (photo) {
      const img = document.createElement("img");
      img.setAttribute("src", photo);
      img.setAttribute("alt", currentPost.title);

      postContainer.appendChild(img);
    });
  } catch (error) {
    console.error("Failed to load post details:", error);
  }
}

getPostDetail();
