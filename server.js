require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");

const app = express();

const Post = require("./models/Post");

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

/* ================= FRONTEND ================= */

app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "public", "index.html"));

});

/* ================= GET POSTS ================= */

app.get("/posts", async (req, res) => {

  const posts = await Post.find();

  res.json(posts);

});

/* ================= CREATE POST ================= */

app.post("/posts", async (req, res) => {

  const newPost = new Post(req.body);

  await newPost.save();

  res.json(newPost);

});

/* ================= UPDATE POST ================= */

app.put("/posts/:id", async (req, res) => {

  const updatedPost = await Post.findByIdAndUpdate(

    req.params.id,

    req.body,

    { new: true }

  );

  res.json(updatedPost);

});

/* ================= DELETE POST ================= */

app.delete("/posts/:id", async (req, res) => {

  await Post.findByIdAndDelete(req.params.id);

  res.json({

    message: "Blog deleted"

  });

});

/* ================= DATABASE ================= */

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

  app.listen(5000, () => {

    console.log("Server running on port 5000");

  });

})

.catch((err) => {

  console.log(err);

});