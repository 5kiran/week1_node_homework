const express = require("express");
const router = express.Router();

const Posts = require("../schemas/posts.js");
const Comments = require("../schemas/comments.js")

// 게시글 작성 API
router.post("/", async (req,res) => {
  try {
    const {user, password, title, content} = req.body;
    await Posts.create({user, password, title, content});
    res.json({"message": "게시글을 생성하였습니다."});
  }
  catch (err) {
     res.status(400).json({"message": "데이터 형식이 잘못되었습니다."});
  };
})


// 게시글 목록 API
router.get("/", async (req,res) => {
  const posts = await Posts.find({},{'password':false,'__v':false,'updatedAt':false}).sort({createdAt:-1});
  res.json({posts});
})


// 게시글 상세 조회 API
router.get("/:_id", async (req,res) => {
  try {
    const {_id} = req.params;
    let [result] = await Posts.find({_id},{'password':false,'__v':false,'updatedAt':false});
    let comments = await Comments.find({postid:_id},{'_id':false,'password':false,'__v':false,'updatedAt':false}).sort({createdAt:-1});
    let postData = {};
    postData.post = result
    postData.comments = comments
    res.json(postData)
  }
  catch (err) {
     res.status(400).json({"message": "존재하지 않는 게시글입니다."});
  };
})


// 게시글 수정 API
router.put("/:_id", async (req,res) => {
  try {
    const {_id} = req.params;
    const {password, title, content} = req.body;
    const find = await Posts.find({_id})

    if(password === undefined || title === undefined || content === undefined){
      return res.status(400).json({"message": "데이터 형식이 올바르지 않습니다."});
    };
    if (find[0].password === password){
      await Posts.updateOne(
        {_id: _id},
        {$set : {title:title, content:content}}
        )
      res.json({"message": "게시글을 수정하였습니다."})
    }else{
      res.status(403).json({"message": "비밀번호가 틀렸습니다."})
    }
  }
  catch (err) {
    res.status(404).json({"message": "존재하지 않는 게시글입니다."})
  }
})


// 게시글 삭제 API
router.delete("/:_id", async (req,res) => {
  try {
    const {_id} = req.params;
    const {password} = req.body;
    const find = await Posts.find({_id})

    if(password === undefined){
      return res.status(400).json({"message": "데이터 형식이 올바르지 않습니다."});
    };
    if (find[0].password === password){
      await Posts.deleteOne({_id});
      res.json({"message": "게시글을 삭제하였습니다.."})
    }else{
      res.status(403).json({"message": "비밀번호가 틀렸습니다."})
    }
  }
  catch (err) {
    res.status(404).json({"message": "존재하지 않는 게시글입니다."})
  }
})




module.exports = router;