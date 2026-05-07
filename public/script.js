const API_URL = "https://syntecxhub-blog-api-2.onrender.com/api/posts";

const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogs");
const searchInput = document.getElementById("search");
const message = document.getElementById("message");
const sortSelect = document.getElementById("sortSelect");

let blogs = [];

let currentPage = 1;

async function fetchBlogs() {

message.innerText = "Loading blogs...";

const sort = sortSelect.value;

const res = await fetch(
`${API_URL}?page=${currentPage}&sort=${sort}`
);

blogs = await res.json();

displayBlogs(blogs);

}

function displayBlogs(data) {

blogsContainer.innerHTML = "";

if (data.length === 0) {

blogsContainer.innerHTML = `
<h2>No Blogs Found 🚫</h2>
`;

return;

}

data.forEach((blog) => {

blogsContainer.innerHTML += `

<div class="blog-card">

${blog.image
? `<img src="https://syntecxhub-blog-api-2.onrender.com${blog.image}" />`
: ""
}

<h2>${blog.title}</h2>

<p>
<strong>Author:</strong>
${blog.author}
</p>

<p>${blog.content}</p>

<p>
<strong>Date:</strong>
${new Date(blog.createdAt).toLocaleString()}
</p>

<div class="actions">

<button onclick="editBlog('${blog._id}')">
✏️ Edit
</button>

<button onclick="deleteBlog('${blog._id}')">
🗑️ Delete
</button>

</div>

</div>

`;

});

message.innerText = "";

}

blogForm.addEventListener("submit", async (e) => {

e.preventDefault();

const formData = new FormData();

formData.append(
"title",
document.getElementById("title").value
);

formData.append(
"author",
document.getElementById("author").value
);

formData.append(
"content",
document.getElementById("content").value
);

formData.append(
"image",
document.getElementById("image").files[0]
);

await fetch(API_URL, {
method: "POST",
body: formData,
});

blogForm.reset();

fetchBlogs();

});

async function deleteBlog(id) {

await fetch(`${API_URL}/${id}`, {
method: "DELETE",
});

fetchBlogs();

}

async function editBlog(id) {

const newTitle = prompt("Enter new title");

const newContent = prompt("Enter new content");

const newAuthor = prompt("Enter author name");

await fetch(`${API_URL}/${id}`, {

method: "PUT",

headers: {
"Content-Type": "application/json",
},

body: JSON.stringify({
title: newTitle,
content: newContent,
author: newAuthor,
}),

});

fetchBlogs();

}

searchInput.addEventListener("input", () => {

const value = searchInput.value.toLowerCase();

const filteredBlogs = blogs.filter((blog) =>
blog.title.toLowerCase().includes(value)
);

displayBlogs(filteredBlogs);

});

document.getElementById("themeBtn")
.addEventListener("click", () => {

document.body.classList.toggle("light-mode");

});

sortSelect.addEventListener("change", () => {

currentPage = 1;

fetchBlogs();

});

document.getElementById("nextBtn")
.addEventListener("click", () => {

currentPage++;

fetchBlogs();

});

document.getElementById("prevBtn")
.addEventListener("click", () => {

if (currentPage > 1) {

currentPage--;

fetchBlogs();

}

});

fetchBlogs();