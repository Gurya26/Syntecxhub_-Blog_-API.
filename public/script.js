const API_URL = "https://syntecxhub-blog-api-2.onrender.com";

const blogForm = document.getElementById("blogForm");

const titleInput = document.getElementById("title");

const contentInput = document.getElementById("content");

const blogsContainer = document.getElementById("blogsContainer");

const searchInput = document.getElementById("searchInput");

const themeToggle = document.getElementById("themeToggle");

let editingId = null;

/* ================= LOAD BLOGS ================= */

async function loadBlogs() {

  const response = await fetch(`${API_URL}/posts`);

  const blogs = await response.json();

  displayBlogs(blogs);

}

/* ================= DISPLAY BLOGS ================= */

function displayBlogs(blogs) {

  blogsContainer.innerHTML = "";

  blogs.forEach(blog => {

    const card = document.createElement("div");

    card.classList.add("blog-card");

    card.innerHTML = `

      <h2>${blog.title}</h2>

      <p>${blog.content}</p>

      <div class="blog-buttons">

        <button onclick="editBlog('${blog._id}')">
          ✏️ Edit
        </button>

        <button onclick="deleteBlog('${blog._id}')">
          🗑️ Delete
        </button>

      </div>

    `;

    blogsContainer.appendChild(card);

  });

}

/* ================= ADD OR EDIT BLOG ================= */

blogForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const title = titleInput.value;

  const content = contentInput.value;

  if (!title || !content) {

    alert("Please fill all fields");

    return;

  }

  if (editingId) {

    await fetch(`${API_URL}/posts/${editingId}`, {

      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        title,
        content
      })

    });

    editingId = null;

  } else {

    await fetch(`${API_URL}/posts`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        title,
        content
      })

    });

  }

  blogForm.reset();

  loadBlogs();

});

/* ================= DELETE BLOG ================= */

async function deleteBlog(id) {

  await fetch(`${API_URL}/posts/${id}`, {

    method: "DELETE"

  });

  loadBlogs();

}

/* ================= EDIT BLOG ================= */

async function editBlog(id) {

  const response = await fetch(`${API_URL}/posts`);

  const blogs = await response.json();

  const blog = blogs.find(blog => blog._id === id);

  titleInput.value = blog.title;

  contentInput.value = blog.content;

  editingId = id;

}

/* ================= SEARCH BLOG ================= */

searchInput.addEventListener("input", async () => {

  const response = await fetch(`${API_URL}/posts`);

  const blogs = await response.json();

  const filtered = blogs.filter(blog =>
    blog.title.toLowerCase().includes(
      searchInput.value.toLowerCase()
    )
  );

  if (searchInput.value.trim() === "") {

    displayBlogs(blogs);

    return;

  }

  blogsContainer.innerHTML = "";

  if (filtered.length === 0) {

    blogsContainer.innerHTML = `

      <div class="blog-card">

        <h2>❌ Blog Not Found</h2>

        <p>No matching blog available.</p>

      </div>

    `;

  } else {

    blogsContainer.innerHTML += `

      <div class="blog-card">

        <h2>✅ Blog Found</h2>

        <p>Matching blogs are shown below.</p>

      </div>

    `;

    filtered.forEach(blog => {

      const card = document.createElement("div");

      card.classList.add("blog-card");

      card.innerHTML = `

        <h2>${blog.title}</h2>

        <p>${blog.content}</p>

        <div class="blog-buttons">

          <button onclick="editBlog('${blog._id}')">
            ✏️ Edit
          </button>

          <button onclick="deleteBlog('${blog._id}')">
            🗑️ Delete
          </button>

        </div>

      `;

      blogsContainer.appendChild(card);

    });

  }

});

/* ================= THEME TOGGLE ================= */

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-mode");

});

/* ================= INITIAL LOAD ================= */

loadBlogs();