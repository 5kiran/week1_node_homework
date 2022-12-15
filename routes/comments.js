const express = require("express");
const router = express.Router();

const Posts = require("../schemas/posts.js");
const Comments = require("../schemas/comments.js")

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


  res.json({'msg':"온다"})
})


module.exports = router;