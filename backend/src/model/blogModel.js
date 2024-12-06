const mongoose = require("mongoose");

// it will be modified

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  Content: {
    type: Object,
    required: true,
  },
  CovIMG: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: Number,
  category: String,
  location: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
