/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../models').Book;
module.exports = function (app) {
  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     try {
      const data = await Book.find({});
      if (!data) {
        res.json([]);
        return;
      }
      const formattedData = data.map(book => ({
        _id: book._id,
        title: book.title,
        comments: book.comments,
        commentcount: book.comments.length,
      }));
      res.json(formattedData);
    } catch(err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred." });
    }
  })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send("missing required field title");
         return;
     }
       const newBook = new Book({ title, comments: [] });
     try {
       const data = await newBook.save();
         res.json({ _id: data._id, title: data.title });
     } catch (err) {
     res.send("there was an error saving");
    }
 })
  
 .delete(async function (req, res){
    //if successful response will be 'complete delete successful'
      try {
       await Book.deleteMany({});
       res.send("complete delete successful");
     } catch (err) {
      console.error(err);
       res.send("error");
    }
});


  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
 //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
     try {
      const data = await Book.findById(bookid);
     if (!data) {
       res.send("no book exists");
        return;  
     }
     res.json({
      comments: data.comments,
      _id: data._id,
      title: data.title,  
      commentcount: data.comments.length,
    });
    } catch(err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred." });
   }
})
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
     //json res format same as .get
     if (!comment) {
       res.send("missing required field comment");
       return;
    }
   try {
      const bookData = await Book.findById(bookid);
     if (!bookData) {
       res.send("no book exists");
     } else {
       bookData.comments.push(comment);
       const savedData = await bookData.save();
         res.json({
        comments: savedData.comments,
        _id: savedData._id,
        title: savedData.title,
        commentcount: savedData.comments.length,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred." });
  }
})
    
.delete(async function(req, res){
  let bookid = req.params.id;
//if successful response will be 'delete successful'
  try {
   const result = await Book.findByIdAndDelete(bookid);
    if(!result) {
      res.send("no book exists");
      } else {
        res.send("delete successful");
     }
    } catch (err) {
    console.error(err);
    res.send("error");    
       
      }
    });
  };
     