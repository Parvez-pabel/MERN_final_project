const express = require("express");
const Blog = require("../model/blogModel");
const Comment = require("../model/commentModel");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

//all blogs

router.get("/all-blogs", async (req, res) => {
  try {
    const { search, category, location } = req.query;
    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (category) {
      query = {
        ...query,
        category,
      };
    }
    if (location) {
      query = {
        ...query,
        location,
      };
    }
    const blogs = await Blog.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      message: "All blogs retrieved successfully",
      blogs: blogs,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send("error");
  }
});

//create post

router.post("/create-post", verifyToken, isAdmin, async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body });
    // todo author: req.userId//
    await newPost.save();
    res.status(201).send({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error(" ERROR:", error);
    res.status(500).send("Server Error");
  }
});

//blog by id

router.get("/all-blogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    const comment = await Comment.find({ blogId: blogId }).populate(
      "user",
      "username email"
    );

    res.status(200).send({
      message: "Blog retrieved successfully",
      blog: blog,
      comments: comment,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//update post

router.post("/update-post/:id", verifyToken,isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return res.status(404).send("Blog not found");
    res.status(200).send({
      message: "Post updated successfully",
      post: blog,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//delete post

router.delete("/delete-post/:id", verifyToken,isAdmin, async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    await Comment.deleteMany({ postId: blogId });
    res.status(200).send({
      message: "Post deleted successfully",
      blog: blog,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send("Server Error");
  }
});

//related blog

router.get("/related-blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ message: "Blog id required" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    const titleRegex = new RegExp(blog.title.split(" ").join(" | "), "i");
    const relatedQuery = {
      _id: { $ne: _id },
      title: { $regex: titleRegex },
    };
    const relatedBlogs = await Blog.find(relatedQuery);
    res.status(200).send({
      message: "Related blogs retrieved successfully",
      blog: relatedBlogs,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// will do comment fetch

module.exports = router;
