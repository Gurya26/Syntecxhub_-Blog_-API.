const API_URL = "https://syntecxhub-blog-api-2.onrender.com";

const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogsContainer");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");


// ================= LOAD BLOGS =================

async function loadBlogs() {

  blogsContainer.innerHTML = "<h2>Loading blogs...</h2>";

  const res = await fetch(`${API_URL}/posts`);

  const blogs = await res.json();

  displayBlogs(blogs);
}


// ================= DISPLAY BLOGS =================

function displayBlogs(blogs) {

  blogsContainer.innerHTML = "";

  if (blogs.length === 0) {
    blogsContainer.innerHTML = `
      <div class="blog-card">
        <h2>No Blogs Found 🚫</h2>
      </div>
    `;
    return;
  }

  blogs.forEach(blog => {

    blogsContainer.innerHTML += `

      <div class="blog-card">

        <h2>${blog.title}</h2>

        <p>${blog.content}</p>

        <p>📅 ${new Date(blog.createdAt).toLocaleString()}</p>

        ${blog.image ? `
          <img src="${API_URL}${blog.image}">
        ` : ""}

        <div class="actions">

          <button onclick="deleteBlog('${blog._id}')">
            🗑️ Delete
          </button>

          <button onclick="editBlog('${blog._id}', '${blog.title}', '${blog.content}')">
            ✏️ Edit
          </button>

        </div>

      </div>
    `;
  });
}


// ================= ADD BLOG =================

blogForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const formData = new FormData();

  formData.append("title", document.getElementById("title").value);

  formData.append("content", document.getElementById("content").value);

  formData.append("image", document.getElementById("image").files[0]);

  await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: formData
  });

  blogForm.reset();

  loadBlogs();
});


// ================= DELETE =================

async function deleteBlog(id) {

  await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE"
  });

  loadBlogs();
}


// ================= EDIT =================

async function editBlog(id, oldTitle, oldContent) {

  const newTitle = prompt("Edit Title", oldTitle);

  const newContent = prompt("Edit Content", oldContent);

  await fetch(`${API_URL}/posts/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      title: newTitle,
      content: newContent
    })
  });

  loadBlogs();
}


// ================= SEARCH =================

searchInput.addEventListener("input", async () => {

  const searchText = searchInput.value.toLowerCase();

  const res = await fetch(`${API_URL}/posts`);

  const blogs = await res.json();

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchText)
  );

  displayBlogs(filteredBlogs);
});


// ================= THEME =================

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});


// ================= REGISTER =================

async function register() {

  const username = document.getElementById("username").value;

  const password = document.getElementById("password").value;

  await fetch(`${API_URL}/register`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      username,
      password
    })
  });

  alert("Registered Successfully");
}


// ================= LOGIN =================

async function login() {

  const username = document.getElementById("username").value;

  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await res.json();

  localStorage.setItem("token", data.token);

  alert("Login Successful");
}


loadBlogs();