const API_URL = "https://syntecxhub-blog-api-2.onrender.com/posts";

const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogs");
const searchInput = document.getElementById("search");

let blogs = [];
let editId = null;


// FETCH BLOGS
async function fetchBlogs() {

blogsContainer.innerHTML = "<h2>Loading blogs...</h2>";

const res = await fetch(API_URL);

blogs = await res.json();

displayBlogs(blogs);

}


// DISPLAY BLOGS
function displayBlogs(data) {

blogsContainer.innerHTML = "";

if (data.length === 0) {

blogsContainer.innerHTML = `
<h2>No Blogs Found ❌</h2>
`;

return;

}

data.forEach((blog) => {

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

const title = document.getElementById("title").value;

const author = document.getElementById("author").value;

const content = document.getElementById("content").value;

const image = document.getElementById("image").files[0];

if (!title || !author || !content) {

alert("Please fill all fields");

return;

}

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

const confirmDelete = confirm(
"Delete this blog?"
);

if (!confirmDelete) return;

await fetch(`${API_URL}/${id}`, {

method: "DELETE",

});

fetchBlogs();

}


// EDIT BLOG
function editBlog(id) {

const blog = blogs.find((b) => b._id === id);

document.getElementById("title").value =
blog.title;

document.getElementById("author").value =
blog.author;

document.getElementById("content").value =
blog.content;

editId = id;

document.getElementById("publishBtn").innerText =
"Update Blog";

window.scrollTo({
top: 0,
behavior: "smooth"
});

}


// SEARCH BLOG
searchInput.addEventListener("input", () => {

const value = searchInput.value.toLowerCase();

const filtered = blogs.filter((blog) =>

blog.title.toLowerCase().includes(value)

);

displayBlogs(filtered);

});


// THEME TOGGLE
function toggleTheme() {

document.body.classList.toggle("light");

}


// INITIAL LOAD
fetchBlogs();