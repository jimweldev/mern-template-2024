const express = require("express");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsersPaginate,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/paginate", authMiddleware, getAllUsersPaginate);
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUser);
router.post("/", authMiddleware, createUser);
router.patch("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
