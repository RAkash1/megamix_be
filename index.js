const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
const connect = require("./connect/mongo");
const upload = require("./middleware/multer");

const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

const pathname = path.join(__dirname, "./public");
app.use(express.static(pathname));

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
app.post("/post", upload.single("file"), createpost);
app.get("/post", getPost);
app.get("/post/:id", getPostDetails);
app.get("/profile", userProfile);
app.delete("/post/:id", deletePost);
app.put("/post/:id", upload.single("file"), editpost);
app.listen(process.env.PORT , () => console.log("<-------> server is running <------->"));
