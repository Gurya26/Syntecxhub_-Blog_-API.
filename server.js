const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Post = require("./models/Post");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("public/uploads"));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "public/uploads");
},
filename: (req, file, cb) => {
cb(null, Date.now() + path.extname(file.originalname));
},
});

const upload = multer({ storage });

app.get("/api/posts", async (req, res) => {
const posts = await Post.find().sort({ createdAt: -1 });
res.json(posts);
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
const newPost = new Post({
title: req.body.title,
author: req.body.author,
content: req.body.content,
image: req.file ? `/uploads/${req.file.filename}` : "",
});

await newPost.save();

res.json(newPost);
});

app.put("/api/posts/:id", async (req, res) => {
const updatedPost = await Post.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true }
);

res.json(updatedPost);
});

app.delete("/api/posts/:id", async (req, res) => {
await Post.findByIdAndDelete(req.params.id);

res.json({ message: "Blog deleted" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});