require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());



app.use(express.static(path.join(__dirname, "public")));



const Post = require("./models/Post");



app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "public", "index.html"));

});



app.post("/posts", async (req, res) => {

  try {

    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content
    });

    await newPost.save();

    res.json(newPost);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});



app.get("/posts", async (req, res) => {

  try {

    const posts = await Post.find().sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});



app.get("/posts/:id", async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    res.json(post);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});



app.delete("/posts/:id", async (req, res) => {

  try {

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: "Post deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});



app.put("/posts/:id", async (req, res) => {

  try {

    const { title, content } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(

      req.params.id,

      {
        title,
        content
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


mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

  app.listen(5000, () => {

    console.log("Server running on port 5000");

  });

})

.catch((err) => {

  console.log("Mongo Error:", err);

});