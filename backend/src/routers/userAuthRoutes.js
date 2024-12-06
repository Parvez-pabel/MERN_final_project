const express = require("express");
const User = require("../model/userModel.js");
const generateToken = require("../middleware/generateToken.js");

const router = express.Router();

//register e user
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, password, username });
    await user.save();
    res
      .status(200)
      .send({ message: "User registered successfully", user: user });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "user is not found!" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ message: "Incorrect password!" });
    }
    //will do generate JWT token
    const token = await generateToken(user._id);
    //console.log("Generated token:",token);
    res.cookie("token", token, {
      
      httpOnly: true, //enable this only when have https
      secure: true, // Set to true if using HTTPS
      sameSite: true, // Set to 'Strict' or 'Lax' for cross-site cookies
    });

    res.status(200).send({
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
//logout a user
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
//get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role");
    res.status(200).send({ message: "user found successfully", users });
  } catch (error) {
    console.error("ERROR fetching user", error);
    res.status(500).json({ message: "fail to fetch user" });
  }
});
// delete a user

router.delete("/delete-users/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("ERROR deleting user", error);
    res.status(500).json({ message: "fail to delete user" });
  }
});

// update a user role

router.put("/update-role/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("ERROR updating user role", error);
    res.status(500).json({ message: "fail to update user role" });
  }
});
module.exports = router;
