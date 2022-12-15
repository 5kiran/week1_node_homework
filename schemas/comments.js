const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required : true,
  },
  content: {
    type: String,
    required : true,
  },
  postid: {
    type: String,
    required : true
  }
},{collection: "comment", timestamps: true });

module.exports = mongoose.model("Comments",commentsSchema);