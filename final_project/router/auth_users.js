const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// DELETE route: User can only delete their own review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // 🛡️ Validate session and username
  const sessionUser = req.session?.authorization?.username;
  if (!sessionUser) {
    return res.status(403).json({ message: "Unauthorized. Please log in first." });
  }

  // 📚 Check if book and review exist
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!book.reviews || !book.reviews[sessionUser]) {
    return res.status(404).json({ message: "No review found for this user under the given ISBN." });
  }

  // Remove the review
  delete book.reviews[sessionUser];

  res.status(200).json({
    message: `Review by '${sessionUser}' for ISBN ${isbn} deleted successfully.`
  });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const reviewText = req.query.review;

  // 🛡️ Check session for username
  const sessionUser = req.session?.authorization?.username;
  if (!sessionUser) {
    return res.status(403).json({ message: "Unauthorized. Please log in first." });
  }

  if (!reviewText) {
    return res.status(400).json({ message: "Review text must be provided in the query." });
  }

  // 📚 Ensure the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  // Add or modify the review
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  const existingReview = books[isbn].reviews[sessionUser];
  books[isbn].reviews[sessionUser] = reviewText;

  const message = existingReview
    ? "Review updated successfully."
    : "Review added successfully.";

  res.status(200).json({
    message,
    isbn,
    reviewer: sessionUser,
    review: reviewText
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
