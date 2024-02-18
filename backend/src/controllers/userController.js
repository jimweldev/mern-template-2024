const mongoose = require("mongoose");

const User = require("../models/userModel");

// get all
const getAllUsers = async (req, res) => {
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select("-password -__v");

  res.status(200).json(users);
};

// get one
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "No item found" });
  }

  const user = await User.findById(id).select("-password -__v");

  if (!user) {
    return res.status(400).json({ message: "No item found" });
  }

  res.status(200).json(user);
};

// create one
const createUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Check all required fields" });
  }

  try {
    const user = await User.create({ email, password, name });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update one
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "No item found" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        validateBeforeSave: true,
        new: true,
      }
    ).select("-password -__v");

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete one
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "No item found" });
  }

  try {
    const user = await User.findByIdAndDelete({ _id: id }).select(
      "-password -__v"
    );

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all
const getAllUsersPaginate = async (req, res) => {
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
  query = User.find(JSON.parse(queryStr)).select("-password -__v");

  // search
  if (req.query.search) {
    query = query.find({
      $or: [
        {
          email: { $regex: search, $options: "i" },
        },
        {
          password: { $regex: search, $options: "i" },
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
    query = query.sort("email");
  }

  const users = await query;

  let count = await User.find({
    $or: [
      {
        email: { $regex: search, $options: "i" },
      },
      {
        password: { $regex: search, $options: "i" },
      },
    ],
  }).countDocuments({});
  let pages = limit > 0 ? Math.ceil(count / limit) : 1;

  res.status(200).json({
    info: {
      count,
      pages,
    },
    records: users,
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsersPaginate,
};
