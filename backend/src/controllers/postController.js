const mongoose = require("mongoose");

const Post = require("../models/postModel");

// get all
const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });

  res.status(200).json(posts);
};

// get one
const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "No item found" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(400).json({ message: "No item found" });
  }

  res.status(200).json(post);
};

// create one
const createPost = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Check all required fields" });
  }

  try {
    const post = await Post.create({ title });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update one
const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "No item found" });
  }

  try {
    const post = await Post.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        validateBeforeSave: true,
        new: true,
      }
    );

    if (!post) {
      res.status(400).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete one
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "No item found" });
  }

  try {
    const post = await Post.findByIdAndDelete({ _id: id });

    if (!post) {
      res.status(400).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all
const getAllPostsPaginate = async (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let search = req.query.search || "";

  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["search", "page", "limit", "sort"];
  removeFields.forEach((val) => delete reqQuery[val]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Post.find(JSON.parse(queryStr));

  // search
  if (req.query.search) {
    query = query.find({
      $or: [
        {
          title: { $regex: search, $options: "i" },
        },
      ],
    });
  }

  query = query.collation({ locale: "en", strength: 2 });

  // limit
  if (req.query.limit) {
    query = query.limit(limit);
  }

  // pagination
  if (req.query.page) {
    query = query.skip((page - 1) * limit);
  }

  // sort
  if (req.query.sort) {
    const sortByArr = req.query.sort.split(",");

    const sortByStr = sortByArr.join(" ");

    query = query.sort(sortByStr);
  } else {
    query = query.sort("title");
  }

  const posts = await query;

  let count = await Post.find({
    $or: [
      {
        title: { $regex: search, $options: "i" },
      },
    ],
  }).countDocuments({});
  let pages = limit > 0 ? Math.ceil(count / limit) : 1;

  res.status(200).json({
    info: {
      count,
      pages,
    },
    records: posts,
  });
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllPostsPaginate,
};
