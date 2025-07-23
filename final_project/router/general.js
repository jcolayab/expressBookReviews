const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"}); 
   const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  const bookDetails = books[isbn];
  res.status(200).send(JSON.stringify(bookDetails, null, 2)); // Neatly formatted output
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const targetAuthor = req.params.author.toLowerCase();
  const matchingBooks = [];

  // Iterate through books
  Object.keys(books).forEach(isbn => {
    const book = books[isbn];
    if (book.author.toLowerCase() === targetAuthor) {
      matchingBooks.push({ isbn, ...book });
    }
  });

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found by the specified author." });
  }

  res.status(200).send(JSON.stringify(matchingBooks, null, 2));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const targetTitle = req.params.title.toLowerCase();
  const matchingBooks = [];

  // Iterate through books
  Object.keys(books).forEach(isbn => {
    const book = books[isbn];
    if (book.title.toLowerCase() === targetTitle) {
      matchingBooks.push({ isbn, ...book });
    }
  });

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found by the specified title." });
  }

  res.status(200).send(JSON.stringify(matchingBooks, null, 2));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  const reviews = book.reviews;
  if (!reviews || Object.keys(reviews).length === 0) {
    return res.status(200).json({ message: "No reviews available for this book." });
  }

  res.status(200).send(JSON.stringify(reviews, null, 2)); // Pretty output
});

module.exports.general = public_users;
