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
/*
regd_users.put('/auth/review/:isbn', (req, res) => {
  // Extract ISBN parameter from request URL
  const isbn = parseInt( req.params.isbn );
  let book = books[isbn];

  if( book ) {  //- Check if book exists
    let review = req.body.review;

    if( review ) {
      book["reviews"] = review;
      books[isbn] = book;  // Update review details in 'books' object
      res.send(`book with the ISBN ${isbn} updated.`);
    } else {
      //- Respond if review is not specified
      res.send("A book review must be specified!");  
    }

  } else {
    // Respond if book with specified ISBN is not found
    res.send("Unable to find book!");
  }
});
*/

regd_users.put("/review", (req, res) => {
  return res.status(404).json({message: "book not found"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = parseInt( req.params.isbn );
  const { review } = req.body;
  let token = req.session.authentication.accessToken;

  if(!token){
    return res.status(404).json({message: "User not authenticated"});
  }

  try {
    let decoded = jwt.verify(token, 'access');
    const username = decoded.username;

    if(!books[isbn]){
      return res.status(404).json({message: "book not found"});
    }
    books[isbn].reviews[username] = review;
    const rev =books[isbn].reviews[username];
    return res.status(200).json({message: "Review addedd successfully", rev});

  } catch (err) {
  return res.status(401).json({message: "Invalid token"});
    
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
