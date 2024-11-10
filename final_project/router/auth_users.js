const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
// Login endpoint
regd_users.post("/login", (req, res) => {
  const user = req.body.user;
  if (!user) {
      return res.status(404).json({ message: "Body Empty" });
  }
  // Generate JWT access token
  let accessToken = jwt.sign({
      data: user
  }, 'access', { expiresIn: 60 * 60 });

  // Store access token in session
  req.session.authorization = {
      accessToken
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let book = books[isbn];
      book.reviews[username] = review;
      return res.status(200).send("Review successfully posted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});


// DELETE request: Delete a book by ISBN id
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Extract email parameter from request URL
  const isbn = parseInt( req.params.isbn );

  if (isbn) {
      // Delete book from 'books' object based on provided ISBN
      delete books[isbn];
  }
  
  // Send response confirming deletion of friend
  res.send(`book with the ISBN ${isbn} deleted.`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
