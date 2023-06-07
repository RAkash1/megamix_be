const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();


app.use(cookieParser())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(express.json())
app.use('/uploads', express.static(__dirname + '/uploads'));

const {registerUser,loginUser,logoutUser,getUser,createpost,getPost,getPostDetails,userProfile,deletePost,editpost}=require('./controller/users');


mongoose.connect('mongodb+srv://akash0816be20:v1mav2egdO1k19z8@medium.d6u16ys.mongodb.net/')
.then(console.log('connected to db'))
.catch((err)=>console.log(err))
app.get('/',(req,res)=>{res.send('hello')})
app.post('/register',registerUser)
app.post('/login',loginUser)
app.post('/logout',logoutUser)
app.get('/user',getUser)
app.post('/post', uploadMiddleware.single('file'),createpost);
app.get('/post', getPost);
app.get('/post/:id', getPostDetails);
app.get('/profile', userProfile);
app.delete('/post/:id', deletePost);
app.put('/post/:id', uploadMiddleware.single('file'), editpost);
app.listen(4000,()=>{console.log('listing on port 9000')})