require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

// Establish database connection
mongoose
    .connect(process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    )
    .then(() => console.log("connection established!!!!!"));
/* 
Route            /
Description      get all books
Access           PUBLIC
Parameters       NONE
Method           GET
*/

shapeAI.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/* 
Route            /is
Description      get specific book based on isbn
Access           PUBLIC
Parameters       isbn
Method           GET
*/

shapeAI.get("/is/:isbn", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

    if (!getSpecificBook) {
        return res.json({
            error: `No book found for the isbn of ${req.params.isbn}`,
        });
    }
    return res.json({ book: getSpecificBook });

});

/* 
Route            /c
Description      get all book based on a category
Access           PUBLIC
Parameters       category
Method           GET
*/
shapeAI.get("/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });


    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({ books: getSpecificBooks });

});

/* 
Route            /a
Description      get all book based on a author's id
Access           PUBLIC
Parameters       author
Method           GET
*/
shapeAI.get("/a/:authorsid", async (req, res) => {
    const getSpecificAuthorBooks = await BookModel.findOne({
        authors: parseInt(req.params.authorsid),
    });
    //const getSpecificAuthorBooks = database.books.filter(
    //    (book) => book.authors.includes(parseInt(req.params.authors)),
    //);

    if (!getSpecificAuthorBooks) {
        return res.json({
            error: `No book found with the author id ${req.params.authorsid}`,
        });
    }

    return res.json({ books: getSpecificAuthorBooks });
});


/* 
Route            /author
Description      get all authors
Access           PUBLIC
Parameters       NONE
Method           GET
*/

shapeAI.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

/* 
Route            /author/n
Description      get specific author based on name
Access           PUBLIC
Parameters       name
Method           GET
*/

shapeAI.get("/author/n/:name", async (req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({
         name: req.params.name,
    });

    if (!getSpecificAuthor) {
        return res.json({
            error: `No author found for the name of ${req.params.name}`,
        });
    }
    return res.json({ author: getSpecificAuthor });

});

/* 
Route            /author/i
Description      get a list of authors based on book's ISBN
Access           PUBLIC
Parameters       isbn
Method           GET
*/

shapeAI.get("/author/i/:isbn", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.findOne({
         books: req.params.isbn,
    });

    if (!getSpecificAuthors) {
        return res.json({
            error: `No author found for the book ${req.params.isbn}`,
        });
    }

    return res.json({ authors: getSpecificAuthors });
}),

    /* 
    Route            /publications
    Description      get all publications
    Access           PUBLIC
    Parameters       NONE
    Method           GET
    */
    shapeAI.get("/publications", async (req, res) => {
        const getAllPublications = await PublicationModel.find();
        return res.json({ publications: getAllPublications });
    });

/* 
Route            /publications
Description      get specific publication based on name
Access           PUBLIC
Parameters       name
Method           GET
*/
shapeAI.get("/publications/n/:name", async (req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({
        name: req.params.name,
    });

    if (!getSpecificPublication) {
        return res.json({
            error: `No publication found for the name of ${req.params.name}`,
        });
    }
    return res.json({ publication: getSpecificPublication });

});


/* 
Route            /publications/i
Description      get a list of publications based on book's ISBN
Access           PUBLIC
Parameters       isbn
Method           GET
*/
shapeAI.get("/publications/i/:isbn", async (req, res) => {
    const getSpecificPublications = await PublicationModel.findOne({
         books: req.params.isbn,
    });

    if (!getSpecificPublications) {
        return res.json({
            error: `No publicaion found for the book's isbn ${req.params.isbn}`,
        });
    }

    return res.json({ publications: getSpecificPublications });
}),

    /* 
    Route            /book/new
    Description      add new books
    Access           PUBLIC
    Parameters       NONE
    Method           POST
    */
    shapeAI.post("/book/new", async (req, res) => {
        const { newBook } = req.body;

        BookModel.create(newBook);

        return res.json({ message: "book was added!" });
    });

/* 
Route            /author/new
Description      add new author
Access           PUBLIC
Parameters       NONE
Method           POST
*/

shapeAI.post("/author/new", async (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: "author was added!" });

});

/* 
Route            /publication/new
Description      add new publication
Access           PUBLIC
Parameters       NONE
Method           POST
*/

shapeAI.post("/publication/new", async (req, res) => {
    const { newPublication } = req.body;

    PublicationModel.create(newPublication);

    return res.json({ message: "publication was added!" });

});

/* 
Route            /book/update
Description      update title of a book
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

shapeAI.put("/book/update/:isbn", async (req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate(
        {
        ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle,
        },
        {
            new: true,
        }
    );
  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     book.title = req.body.bookTitle;
  //     return;
  //   }
  // });

    return res.json({ books: updatedBook });
});

/* 
Route            /book/author/update
Description      update/add new author
Access           PUBLIC
Parameters       isbn
Method           PUT
*/
shapeAI.put("/book/author/update/:isbn", async (req, res) => {
    //update the book database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,

        },
        {
            $addToSet: {
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
    );
    //database.books.forEach((book) => {
    //if (book.ISBN === req.params.isbn) {
    // return book.authors.push(req.body.newAuthor);
    // }
    //});

    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor,
        },
        {
            $addToSet: {
                books: req.params.isbn,
            },
        },
        {
            new: true
        }
    );
    //database.authors.forEach((author) => {
    // if (author.id === req.body.newAuthor) {
    //  return author.books.push(req.params.isbn);
    //  }
    //});
    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added🚀",
    });
});

/* 
Route            /author/update
Description      update name of a author
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

shapeAI.put("/author/update/:isbn", async (req, res) => {
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            books: req.params.isbn,
        },
        {
            name: req.body.authorName,
        },
        {
            new: true,
        }
    );
    //database.authors.forEach((author) => {
    //    if (author.books.toString() === req.params.isbn) {
    //        author.name = req.body.authorName;
    //        return;
    //    }
    //});
    return res.json({ authors: updatedAuthor });
});

/* 
Route            /publication/update
Description      update name of a publication
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

shapeAI.put("/publication/update/:isbn",async (req, res) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            books: req.params.isbn,
        },
        {
            name: req.body.publicationName,
        },
        {
            new: true,
        }
    );
    //database.publications.forEach((publication) => {
    //    if (publication.books.toString() === req.params.isbn) {
    //        publication.name = req.body.publicationName;
    //        return;
    //   }
    //});
    return res.json({ publications: updatedPublication });
});

/* 
Route            /publication/update/book
Description      update/add a new book to publication
Access           PUBLIC
Parameters       isbn
Method           PUT
*/
shapeAI.put("/publication/update/book/:isbn/:pubID", async (req, res) => {
    // update the publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.params.pubID,
        },
        {
            $addToSet:{
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );
    //database.publications.forEach((publication) => {
    //    if (publication.id === req.body.pubId) {
    //        return publication.books.push(req.params.isbn);
    //    }
    //});
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $set:{
            publication: req.params.pubId,
            },
        },
        {
            new: true,
        }
    );
    //database.books.forEach((book) => {
    //    if (book.ISBN === req.params.isbn) {
    //        book.publication = req.body.pubId;
    //        return;
    //    }
    //});
    return res.json({
        message: "successfully updated publications",
        books: updatedBook,
        publications: updatedPublication,
    });
});

/* 
Route            /book/delete
Description      delete a book
Access           PUBLIC
Parameters       isbn
Method           DELETE
*/
shapeAI.delete("/book/delete/:isbn", async (req, res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete({
        ISBN: req.params.isbn,
    });
    //const updatedBookDatabase = database.books.filter(
    // (book) => book.ISBN !== req.params.isbn
    // );
    //database.books = updatedBookDatabase;
    return res.json({ books: updatedBookDatabase });
});

/* 
Route            /book/delete/author
Description      delete a author from a book
Access           PUBLIC
Parameters       isbn, author id
Method           DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", async (req, res) => {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $pull: {
                authors: parseInt(req.params.authorId),
            },
        },
        {
            new: true,
        }
    );
    //database.books.forEach((book) => {
    //    if (book.ISBN === req.params.isbn) {
    //        const newAuthorList = book.authors.filter(
    //            (author) => author !== parseInt(req.params.authorId)
    //        );
    //        book.authors = newAuthorList;
    //        return;
    //    }
    //});
    // update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId),
        },
        {
            $pull:{
                books: req.params.isbn,
            },
        },
        { new : true}
    );
    //database.authors.forEach((author) => {
    //    if (author.id === parseInt(req.params.authorId)) {
    //        const newBooksList = author.books.filter(
    //            (book) => book  !== req.params.isbn
    //        );
    //        author.books = newBooksList;
    //        return;
    //    }
    //});
    return res.json({
        message: "author was deleted!😪",
        book: updatedBook,
        author: updatedAuthor,
    });
});

/* 
Route            /author/delete
Description      delete an author
Access           PUBLIC
Parameters       name
Method           DELETE
*/
shapeAI.delete("/author/delete/:name", async (req, res) => {
    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
        name: req.params.name,
    });
    //const updatedAuthorDatabase = database.authors.filter(
    // (author) => author.name !== req.params.name
    // );
    //database.authors = updatedAuthorDatabase;
    return res.json({ authors: updatedAuthorDatabase });
});
/* 
Route            /publication/delete/book
Description      delete a book from publication
Access           PUBLIC
Parameters       isbn, publication id
Method           DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", async (req, res) => {
    // update publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.pubId),
        },
        {
            $pull:{
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );
    //database.publications.forEach((publication) => {
    //    if (publication.id === parseInt(req.params.pubId)) {
    //        const newBooksList = publication.books.filter(
    //            (book) => book !== req.params.isbn
    //        );

    //        publication.books = newBooksList;
    //        return;
    //    }
    //});

    // update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            publication: 0,
        },
        {
            new: true,
        }
    );
    //database.books.forEach((book) => {
    //    if (book.ISBN === req.params.isbn) {
    //        book.publication = 0; // no publication available
    //        return;
    //    }
    //});

    return res.json({
        books: updatedBook,
        publications: updatedPublication,
    });
});

/* 
Route            /publication/delete
Description      delete a publication
Access           PUBLIC
Parameters       name
Method           DELETE
*/
shapeAI.delete("/publication/delete/:name", async (req, res) => {
    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
        name: req.params.name,
    });
    //const updatedPublicationDatabase = database.publications.filter(
    // (publication) => publication.name !== req.params.name
    // );
    //database.publicationss = updatedPublicationDatabase;
    return res.json({ publications: updatedPublicationDatabase });
});

shapeAI.listen(3000, () => console.log("Server running!!😎"));