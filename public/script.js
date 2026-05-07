const API_URL = "http://localhost:5000/posts";

const form = document.getElementById("blogForm");

const postsContainer = document.getElementById("postsContainer");

const searchInput = document.getElementById("searchInput");

let allPosts = [];



async function loadPosts() {

  const response = await fetch(API_URL);

  const posts = await response.json();

  allPosts = posts;

  displayPosts(posts);

}



function displayPosts(posts) {

  postsContainer.innerHTML = "";

  posts.forEach(post => {

    const postCard = document.createElement("div");

    postCard.classList.add("post");

    postCard.innerHTML = `

      <h2>${post.title}</h2>

      <p>${post.content}</p>

      <div class="btnGroup">

        <button onclick="deletePost('${post._id}')">
          🗑️ Delete
        </button>

        <button onclick="editPost(
          '${post._id}',
          '${post.title}',
          '${post.content}'
        )">
          ✏️ Edit
        </button>

      </div>

    `;

    postsContainer.appendChild(postCard);

  });

}



form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const title = document.getElementById("title").value;

  const content = document.getElementById("content").value;

  await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      title,
      content
    })

  });

  form.reset();

  loadPosts();

});



async function deletePost(id) {

  await fetch(`${API_URL}/${id}`, {

    method: "DELETE"

  });

  loadPosts();

}



async function editPost(id, oldTitle, oldContent) {

  const newTitle = prompt("Edit title:", oldTitle);

  const newContent = prompt("Edit content:", oldContent);

  if (!newTitle || !newContent) return;

  await fetch(`${API_URL}/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      title: newTitle,

      content: newContent

    })

  });

  loadPosts();

}



searchInput.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filteredPosts = allPosts.filter(post =>

    post.title.toLowerCase().includes(value)

  );

  displayPosts(filteredPosts);

});



function toggleTheme() {

  document.body.classList.toggle("lightMode");

}



loadPosts();