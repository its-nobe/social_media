const express = require("express");
const router = express.Router();
const { CLikes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { CommentId } = req.body;
  const UserId = req.user.id;
  const found = await CLikes.findOne({
    where: { CommentId: CommentId, UserId: UserId },
  });
  if (!found) {
    await CLikes.create({ CommentId: CommentId, UserId: UserId });
    res.json({ liked: true });
  } else {
    await CLikes.destroy({
      where: { CommentId: CommentId, UserId: UserId },
    });
    res.json({ liked: false });
  }
});

module.exports = router;
