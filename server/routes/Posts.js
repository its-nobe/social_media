const express = require("express");
const router = express.Router();
const { Posts, Likes, sequelize } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/topPost", validateToken, async (req, res) => {
  const userId = req.user.id;
  const post = await Posts.findOne({
    where: { id: [sequelize.fn("top_post")] },
  });
  let likes = [];
  if (post) {
    likes = await Likes.findAll({
      // attributes: [[sequelize.fn("count", sequelize.col("id")), "count"]],
      where: { PostId: post.id },
    });
  }
  const found = await Likes.findOne({
    where: { UserId: userId },
  });
  if (found && found.PostId == post.id) {
    res.json({
      post: post,
      likes: likes,
      liked: true,
    });
  } else {
    res.json({
      post: post,
      likes: likes,
      liked: false,
    });
  }
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
