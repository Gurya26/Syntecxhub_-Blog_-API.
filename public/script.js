const API_URL = "https://syntecxhub-blog-api-2.onrender.com";

const blogForm = document.getElementById("blogForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const blogsContainer = document.getElementById("blogsContainer");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let editingBlogId = null;


async function loadBlogs() {

  const response = await fetch(`${API_URL}/posts`);

  const blogs = await response.json();

  displayBlogs(blogs);

}



function displayBlogs(blogs) {

  blogsContainer.innerHTML = "";

  blogs.reverse().forEach(blog => {

    const blogCard = document.createElement("div");

    blogCard.classList.add("blog-card");

    blogCard.innerHTML = `
      <h2>${blog.title}</h2>
      <p>${blog.content}</p>

      <div class="blog-buttons">
        <button onclick="editBlog('${blog._id}')">✏️ Edit</button>
        <button onclick="deleteBlog('${blog._id}')">🗑️ Delete</button>
      </div>
    `;

    blogsContainer.appendChild(blogCard);

  });

}



blogForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const title = titleInput.value;

  const content = contentInput.value;

  if (!title || !content) {
    alert("Please fill all fields");
    return;
  }

  if (editingBlogId) {

    await fetch(`${API_URL}/posts/${editingBlogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        content
      })
    });

    editingBlogId = null;

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



async function deleteBlog(id) {

  await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE"
  });

  loadBlogs();

}



async function editBlog(id) {

  const response = await fetch(`${API_URL}/posts`);

  const blogs = await response.json();

  const blog = blogs.find(item => item._id === id);

  titleInput.value = blog.title;

  contentInput.value = blog.content;

  editingBlogId = id;

}



searchInput.addEventListener("input", async () => {

  const response = await fetch(`${API_URL}/posts`);

  const blogs = await response.json();

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  displayBlogs(filteredBlogs);

});



themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-mode");

});



loadBlogs();