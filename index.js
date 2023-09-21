const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const uploadMiddleware = multer({ dest: "uploads/" });
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

const pathname = path.join(__dirname, "./public");
app.use(express.static(pathname));
const connect = require("./connect/mongo");

// <*****************> Routes functions <*****************>
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  createpost,
  getPost,
  getPostDetails,
  userProfile,
  deletePost,
  editpost,
} = require("./controller/users");

// <*****************> MongoDb connection <*****************>
connect();

// <*****************> Server <*****************>
app.get("/", (req, res) => res.sendFile("index.html"));
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/logout", logoutUser);
app.get("/user", getUser);
app.post("/post", uploadMiddleware.single("file"), createpost);
app.get("/post", getPost);
app.get("/post/:id", getPostDetails);
app.get("/profile", userProfile);
app.delete("/post/:id", deletePost);
app.put("/post/:id", uploadMiddleware.single("file"), editpost);
app.listen(process.env.PORT , () => console.log("<-------> server is running <------->"));
