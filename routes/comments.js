const express = require("express");
const router = express.Router();

const Posts = require("../schemas/posts.js");
const Comments = require("../schemas/comments.js")


// 댓글 작성 API
router.post("/:_postid", async (req,res) => {
  try{
    const {_postid:postid} = req.params;
    const {user,password,content} = req.body;

    if(content == undefined){
     res.status(400).json({"message": "내용을 입력해주세요"})
    }
    await Comments.create({user,password,content,postid})
  }catch {
    res.status(400).json({"message": "데이터 형식이 올바르지 않습니다."})
  }

  res.json({'message':"댓글을 생성하였습니다."})
})


// 댓글 보기 API
router.get("/:_postid", async (req,res) => {
  try{
    const {_postid:posts} = req.params;
    const comments = await Comments.find({postid:posts})
    res.json({comments})
  }
  catch{
    res.status(400).json({"message":"데이터 형식이 올바르지 않습니다."})
  }
})


// 댓글 수정 API
router.put("/:commentId", async (req,res) => {
  try {
    const {commentId} = req.params;
    const {password, content} = req.body;
    console.log(commentId,password,content)
    const find = await Comments.find({_id : commentId})

    if(content === undefined){
      return res.status(400).json({"message": "내용을 입력해주세요."});
    };
    if (find[0].password === password){
      await Comments.updateOne(
        {_id: commentId},
        {$set : {content:content}}
        )
      res.json({"message": "댓글을 수정하였습니다."})
    }else{
      res.status(403).json({"message": "비밀번호가 틀렸습니다."})
    }
  }
  catch (err) {
    res.status(404).json({"message": "존재하지 않는 댓글입니다."})
  }
})

// 댓글 삭제 API
router.delete("/:commentId",async (req,res) => {
  try {
    const {commentId} = req.params;
    const {password} = req.body;
    const find = await Comments.find({_id:commentId})

    if(password === undefined){
      return res.status(400).json({"message": "데이터 형식이 올바르지 않습니다."});
    };
    if (find[0].password === password){
      await Comments.deleteOne({_id:commentId});
      res.json({"message": "댓글을 삭제하였습니다.."})
    }else{
      res.status(403).json({"message": "비밀번호가 틀렸습니다."})
    }
  }
  catch (err) {
    res.status(404).json({"message": "존재하지 않는 댓글입니다."})
  }
})
module.exports = router;