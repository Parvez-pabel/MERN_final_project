const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

require("dotenv").config();

//parsers

app.use(express.json());
app.use(cors());

//routes
const blogRoutes = require("./src/routers/blogRoute.js");
const commentRoutes = require("./src/routers/commentRoute.js");
const UserRoutes = require("./src/routers/userAuthRoutes.js");

//middleware
app.use("/api/auth", UserRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
}

main()
  .then(() => console.log("database connected"))
  .catch((error) => console.error(error));

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
