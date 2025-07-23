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

// Simulated async function using Promise
function getBooksPromise() {
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Book list is unavailable."));
      }
    });
  }
  
  // GET route using .then() and .catch()
  public_users.get("/", function (req, res) {
    getBooksPromise()
      .then(bookList => {
        res.status(200).send(JSON.stringify(bookList, null, 4));
      })
      .catch(error => {
        res.status(500).json({
          message: "Error fetching book list.",
          error: error.message
        });
      });
  });
  


// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
  
    // Create a Promise to simulate async book lookup
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found for the given ISBN."));
        }
      });
    };
  
    getBookByISBN(isbn)
      .then((bookDetails) => {
        res.status(200).send(JSON.stringify(bookDetails, null, 2));
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });
  });
  
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const targetAuthor = req.params.author.toLowerCase();
  
    // Wrap book filtering in a promise
    const findBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
  
        Object.keys(books).forEach((isbn) => {
          const book = books[isbn];
          if (book.author.toLowerCase() === author) {
            matchingBooks.push({ isbn, ...book });
          }
        });
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found by the specified author."));
        }
      });
    };
  
    // Execute the promise
    findBooksByAuthor(targetAuthor)
      .then((results) => {
        res.status(200).send(JSON.stringify(results, null, 2));
      })
      .catch((err) => {
        res.status(404).json({ message: err.message });
      });
  });

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const targetTitle = req.params.title.toLowerCase();
  
    // Wrap book filtering logic in a Promise
    const findBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
  
        Object.keys(books).forEach((isbn) => {
          const book = books[isbn];
          if (book.title.toLowerCase() === title) {
            matchingBooks.push({ isbn, ...book });
          }
        });
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found by the specified title."));
        }
      });
    };
  
    // Invoke the Promise
    findBooksByTitle(targetTitle)
      .then((results) => {
        res.status(200).send(JSON.stringify(results, null, 2));
      })
      .catch((err) => {
        res.status(404).json({ message: err.message });
      });
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
