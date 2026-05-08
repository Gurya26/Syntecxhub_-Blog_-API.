const API_URL = "https://syntecxhub-blog-api-2.onrender.com/posts";

const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogs");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sortSelect");

let blogs = [];
let filteredBlogs = [];
let editId = null;

let currentPage = 1;
const blogsPerPage = 3;


// FETCH BLOGS
async function fetchBlogs() {

blogsContainer.innerHTML = "<h2>Loading blogs...</h2>";

try {

const res = await fetch(API_URL);

blogs = await res.json();

filteredBlogs = blogs;

displayBlogs();

}

catch (error) {

blogsContainer.innerHTML =
"<h2>Failed to load blogs ❌</h2>";

}

}


// DISPLAY BLOGS
function displayBlogs() {

blogsContainer.innerHTML = "";

if (filteredBlogs.length === 0) {

blogsContainer.innerHTML =
"<h2>No Blogs Found ❌</h2>";

return;

}

const start =
(currentPage - 1) * blogsPerPage;

const end =
start + blogsPerPage;

const paginatedBlogs =
filteredBlogs.slice(start, end);

paginatedBlogs.forEach((blog) => {

const div = document.createElement("div");

div.className = "blog-card";

div.innerHTML = `

${blog.image ? `
<img src="https://syntecxhub-blog-api-2.onrender.com/uploads/${blog.image}"
class="blog-image">
` : ""}

<h2>${blog.title}</h2>

<p><strong>Author:</strong> ${blog.author}</p>

<p>${blog.content}</p>

<p class="date">
📅 ${new Date(blog.createdAt).toLocaleString()}
</p>

<div class="btns">

<button onclick="editBlog('${blog._id}')">
✏️ Edit
</button>

<button onclick="deleteBlog('${blog._id}')">
🗑 Delete
</button>

</div>

`;

blogsContainer.appendChild(div);

});

}


// ADD / UPDATE BLOG
blogForm.addEventListener("submit", async (e) => {

e.preventDefault();

const title =
document.getElementById("title").value;

const author =
document.getElementById("author").value;

const content =
document.getElementById("content").value;

const image =
document.getElementById("image").files[0];


// UPDATE BLOG
if (editId) {

await fetch(`${API_URL}/${editId}`, {

method: "PUT",

headers: {
"Content-Type": "application/json",
},

body: JSON.stringify({
title,
author,
content,
}),

});

editId = null;

document.getElementById("publishBtn").innerText =
"Publish Blog";

}


// CREATE BLOG
else {

const formData = new FormData();

formData.append("title", title);

formData.append("author", author);

formData.append("content", content);

if (image) {

formData.append("image", image);

}

await fetch(API_URL, {

method: "POST",

body: formData,

});

}

blogForm.reset();

fetchBlogs();

});


// DELETE BLOG
async function deleteBlog(id) {

const confirmDelete =
confirm("Delete this blog?");

if (!confirmDelete) return;

await fetch(`${API_URL}/${id}`, {

method: "DELETE",

});

fetchBlogs();

}


// EDIT BLOG
function editBlog(id) {

const blog =
blogs.find((b) => b._id === id);

document.getElementById("title").value =
blog.title;

document.getElementById("author").value =
blog.author;

document.getElementById("content").value =
blog.content;

editId = id;

document.getElementById("publishBtn").innerText =
"Update Blog ✏️";

window.scrollTo({

top: 0,

behavior: "smooth",

});

}


// SEARCH BLOG
searchInput.addEventListener("input", () => {

const value =
searchInput.value.toLowerCase();

filteredBlogs = blogs.filter((blog) =>

blog.title.toLowerCase().includes(value)

);

currentPage = 1;

displayBlogs();

});


// SORT BLOGS
sortSelect.addEventListener("change", () => {

if (sortSelect.value === "newest") {

filteredBlogs.sort((a, b) =>

new Date(b.createdAt) -
new Date(a.createdAt)

);

}

else {

filteredBlogs.sort((a, b) =>

new Date(a.createdAt) -
new Date(b.createdAt)

);

}

displayBlogs();

});


// THEME TOGGLE
function toggleTheme() {

document.body.classList.toggle("light-mode");

}


// PAGINATION
document.getElementById("nextBtn")
.addEventListener("click", () => {

if (
currentPage * blogsPerPage <
filteredBlogs.length
) {

currentPage++;

displayBlogs();

}

});


document.getElementById("prevBtn")
.addEventListener("click", () => {

if (currentPage > 1) {

currentPage--;

displayBlogs();

}

});


// INITIAL LOAD
fetchBlogs();