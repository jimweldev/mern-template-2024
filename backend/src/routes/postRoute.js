const express = require("express");

const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllPostsPaginate,
} = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/paginate", authMiddleware, getAllPostsPaginate);
router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPost);
router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
