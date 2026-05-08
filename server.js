const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

const Post = require("./models/Post");

dotenv.config();

const app = express();


// MIDDLEWARE
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/uploads", express.static("public/uploads"));


// MULTER IMAGE STORAGE
const storage = multer.diskStorage({

destination: (req, file, cb) => {

cb(null, "public/uploads");

},

filename: (req, file, cb) => {

cb(null, Date.now() + path.extname(file.originalname));

},

});

const upload = multer({ storage });


// HOME ROUTE
app.get("/", (req, res) => {

res.send("Blog API Running 🚀");

});


// GET ALL BLOGS
app.get("/posts", async (req, res) => {

try {

const posts = await Post.find().sort({
createdAt: -1,
});

res.json(posts);

}

catch (error) {

res.status(500).json({
message: error.message,
});

}

});


// CREATE BLOG
app.post("/posts", upload.single("image"), async (req, res) => {

try {

const newPost = new Post({

title: req.body.title,

author: req.body.author,

content: req.body.content,

image: req.file ? req.file.filename : "",

});

await newPost.save();

res.json(newPost);

}

catch (error) {

res.status(500).json({
message: error.message,
});

}

});


// UPDATE BLOG
app.put("/posts/:id", async (req, res) => {

try {

const updatedPost = await Post.findByIdAndUpdate(

req.params.id,

{

title: req.body.title,

author: req.body.author,

content: req.body.content,

},

{ new: true }

);

res.json(updatedPost);

}

catch (error) {

res.status(500).json({
message: error.message,
});

}

});


// DELETE BLOG
app.delete("/posts/:id", async (req, res) => {

try {

await Post.findByIdAndDelete(req.params.id);

res.json({
message: "Blog deleted successfully",
});

}

catch (error) {

res.status(500).json({
message: error.message,
});

}

});


// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)

.then(() => {

console.log("MongoDB Connected");

})

.catch((err) => {

console.log(err);

});


// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

console.log(`Server running on port ${PORT}`);

});