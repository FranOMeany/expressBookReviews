const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Check if username and password are provided in the request body
  if( !req.body.username || !req.body.userpassword ) {
    return( res.status(401).json({message: "User name and password must be specified!"}) );
  }

  // Check if the username is valid
  if( isValid( req.body.username ) ) {
    return( res.status(401).json({message: "User name already exists!!"}) );
  }

  //- Add user
  users.push ( {
    "username": req.body.username,
    "userpassword": req.body.userpassword
  } );

  // Send response indicating user addition
  res.send("The user" + (' ') + (req.body.username) + " Has been added!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,10));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the ISBN parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;
  if(books[isbn] === undefined) {
    return( res.status(401).json({message: "ISBN number not found on books db"}));
  }
  res.send( books[isbn] );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  for( let key in books ) {
    if( books[key].author === req.params.author ) {
      return( res.send( books[key] ) );
    }
  }
  res.status(401).json({message: "Author " + req.params.author + " not found!"})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  for( let key in books ) {
    if( books[key].title === req.params.title ) {
      return( res.send( books[key] ) );
    }
  }
  res.status(401).json({message: "Book title " + req.params.author + " not found!"})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn] === undefined) {
    return( res.status(401).json({message: "ISBN number not found on books db"}));
  }
  res.send( books[isbn] );  
});

module.exports.general = public_users;
