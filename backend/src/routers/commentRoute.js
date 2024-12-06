const express = require("express");
const Comment = require("../model/commentModel.js");
const router = express.Router();

//create a comment
router.post("/post-comment", async (req, res) => {
  try {
   

    const newComment = new Comment(req.body);
    await newComment.save();

    res.status(201).send({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send({ message: "Server Error" });
  }
});
//get all comment count

router.get("/total-comment", async (req, res) => {
  try {
    const totalComment = await Comment.countDocuments();
    res.status(200).json({ message: "Total comments count", totalComment });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Error" });
  }
});
module.exports = router;
