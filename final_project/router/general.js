const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const { isValid } = require("./auth_users.js");
const { users } = require("./auth_users.js");
const public_users = express.Router();
const BASE = "http://localhost:5000";

public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

public_users.get("/", (req, res) => {
  Promise.resolve(books)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json({ message: err.message }));
});

public_users.get("/isbn/:isbn", (req, res) => {
  Promise.resolve()
    .then(() => {
      const book = books[req.params.isbn];
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err.message }));
});

public_users.get("/author/:author", (req, res) => {
  Promise.resolve()
    .then(() => {
      const requestedAuthor = req.params.author.toLowerCase();
      const result = Object.keys(books)
        .filter((isbn) => books[isbn].author.toLowerCase() === requestedAuthor)
        .map((isbn) => ({
          isbn,
          title: books[isbn].title,
          reviews: books[isbn].reviews,
        }));
      return result;
    })
    .then((result) => res.status(200).json({ booksbyauthor: result }))
    .catch((err) => res.status(404).json({ message: err.message }));
});

public_users.get("/title/:title", (req, res) => {
  Promise.resolve()
    .then(() => {
      const requestedTitle = req.params.title.toLowerCase();
      const result = Object.keys(books)
        .filter((isbn) => books[isbn].title.toLowerCase() === requestedTitle)
        .map((isbn) => ({
          isbn,
          author: books[isbn].author,
          reviews: books[isbn].reviews,
        }));
      return result;
    })
    .then((result) => res.status(200).json({ booksbytitle: result }))
    .catch((err) => res.status(404).json({ message: err.message }));
});

public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  return book
    ? res.status(200).json(book.reviews)
    : res.status(404).json({ message: "Book not found" });
});

public_users.get("/axios/books", async (req, res) => {
  try {
    const response = await axios.get(`${BASE}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get("/axios/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE}/isbn/${encodeURIComponent(req.params.isbn)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get("/axios/author/:author", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE}/author/${encodeURIComponent(req.params.author)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get("/axios/title/:title", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE}/title/${encodeURIComponent(req.params.title)}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports.general = public_users;
