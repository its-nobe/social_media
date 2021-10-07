const express = require("express");
const router = express.Router();
const { Comments, CLikes, Sequelize } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  console.log();
  const comments = await Comments.findAll({
    where: { PostId: postId },
    include: [CLikes],
  });
  const likedComments = await CLikes.findAll({ where: { UserId: userId } });
  res.json({ comments: comments, likedComments: likedComments });
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
