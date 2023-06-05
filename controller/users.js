const bcrypt = require('bcrypt');
const Users = require('../models/users')
const Post = require('../models/posts')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Console } = require('console');

const registerUser=async(req,res)=>{
    const {name,email,password}= req.body;
    console.log(name,email,password);
    const hashpass=await bcrypt.hash(password,10);
    console.log(hashpass);
    try{
    await Users.create({ 
        username:name,
        email,
        password:hashpass
    });
    res.status(201).json({message:'user created'})
    }
    catch(e){
        res.status(400).json(e)
    }
}


const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    console.log(email,password);
    const userFind = await Users.findOne({email});
    console.log(userFind);
    if(userFind){
        const match = await bcrypt.compare(password,userFind.password);
        if(match){
        jwt.sign({username:userFind.username ,email,id:userFind._id},'secretkey',(err,token)=>{
            res.cookie('token',token).json({username:userFind.username,id:userFind._id})
            console.log(username)
        }) 
        }
        else{
            res.status(400).json({message:'user password not match'})
        }
    }
    else{
        res.status(404).json({message:'user not found'})
    }
}
const logoutUser=(req,res)=>{
    res.cookie('token', '').json('ok');
}
const getUser=(req,res)=>{
    const {token} = req.cookies
    jwt.verify(token,'secretkey',(err,info)=>{
        if(err) res.status(400).json(err)
        res.json(info)})
}

const createpost =async (req,res) => {
    console.log(req.file);

    const{originalname,path}=req.file;
    const parts=originalname.split('.');
    // const newPath=path+'.'+parts[parts.length - 1];
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    console.log(parts);
    const {token} = req.cookies;
    jwt.verify(token, 'secretkey', {}, async (err,info) => {
    console.log(info);
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });

}
const getPost =async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  }
const getPostDetails =async (req,res) => {
    console.log(req.params.id);
    res.json( await Post.findById(req.params.id).populate('author', ['username']))
}
const userProfile =async (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, 'secretkey', {}, async (err,info) => {
        console.log(info);
        result= await Post.find({author:info.id}).populate('author', ['username'])
        res.json(result);
      });     
    }
const deletePost =async (req,res) => {
        console.log(req.params.id);
        const img = await Post.findById(req.params.id);
        console.log(img.cover);
        fs.unlinkSync(img.cover, (err) => {console.log(err)});
        console.log(img.cover);
        const responce=await Post.findByIdAndDelete(req.params.id);
        console.log(responce);
        res.status(200).json(responce);
}
module.exports={registerUser,loginUser,logoutUser,getUser,createpost,getPost,getPostDetails,userProfile,deletePost}