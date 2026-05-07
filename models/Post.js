const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

  title: String,

  author: String,

  content: String

}, {

  timestamps: true

});

module.exports = mongoose.model("Post", postSchema);