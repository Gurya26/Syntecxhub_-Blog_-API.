require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

const Post = require("./models/Post");

/* ================= FRONTEND ================= */

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= CREATE BLOG ================= */

app.post("/posts", async (req, res) => {

  try {

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content
    });

    await newPost.save();

    res.json(newPost);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* ================= GET BLOGS ================= */

app.get("/posts", async (req, res) => {

  try {

    const posts = await Post.find().sort({
      createdAt: -1
    });

    res.json(posts);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* ================= UPDATE BLOG ================= */

app.put("/posts/:id", async (req, res) => {

  try {

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        new: true
      }
    );

    res.json(updatedPost);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* ================= DELETE BLOG ================= */

app.delete("/posts/:id", async (req, res) => {

  try {

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: "Blog deleted"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* ================= DATABASE ================= */

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

  app.listen(process.env.PORT || 5000, () => {

    console.log("Server running");

  });

})

.catch((err) => {

  console.log(err);

});