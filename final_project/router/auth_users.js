const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (typeof username !== "string") {
    return false;
  }

  const cleaned = username.trim();
  return cleaned.length > 0 && !cleaned.includes(" ");
};

const authenticatedUser = (username, password) => {
  return users.find(
    (user) => user.username === username && user.password === password,
  );
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const user = authenticatedUser(username, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", {
    expiresIn: "1h",
  });
  req.session.authorization = token;

  return res.status(200).send("Customer successfully logged in");
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const username = req.user;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for the ISBN ${isbn} posted by the user ${username}`,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (
    !books[isbn].reviews ||
    !Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)
  ) {
    return res.status(404).json({
      message: `Review for the ISBN ${isbn} posted by the user ${username} not found`,
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for the ISBN ${isbn} posted by the user ${username} deleted`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
