// Frame work
const express = require("express");

// Database
const database = require("./database/index");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

/* 
Route            /
Description      get all books
Access           PUBLIC
Parameters       NONE
Method           GET
*/

shapeAI.get("/", (req, res) => {
    return res.json({ books: database.books });
});

/* 
Route            /is
Description      get specific book based on isbn
Access           PUBLIC
Parameters       isbn
Method           GET
*/

shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if (getSpecificBook.length === 0) {
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
shapeAI.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category)

    );

    if (getSpecificBooks.length === 0) {
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
shapeAI.get("/a/:authors", (req, res) => {
    const getSpecificAuthorBooks = database.books.filter(
        (book) => book.authors.includes(parseInt(req.params.authors)),
    );

    if (getSpecificAuthorBooks.length === 0) {
        return res.json({
            error: `No book found with the author name ${req.params.author}`,
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

shapeAI.get("/author", (req, res) => {
    return res.json({ authors: database.authors });
});

/* 
Route            /author/n
Description      get specific author based on name
Access           PUBLIC
Parameters       name
Method           GET
*/

shapeAI.get("/author/n/:name", (req, res) => {
    const getSpecificAuthor = database.authors.filter(
        (author) => author.name === req.params.name
    );

    if (getSpecificAuthor.length === 0) {
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

shapeAI.get("/author/i/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) =>
        author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthors.length === 0) {
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
    shapeAI.get("/publications", (req, res) => {
        return res.json({ publications: database.publications });
    });

/* 
Route            /publications
Description      get specific publication based on name
Access           PUBLIC
Parameters       name
Method           GET
*/
shapeAI.get("/publications/n/:name", (req, res) => {
    const getSpecificPublication = database.publications.filter(
        (publication) => publication.name === req.params.name
    );

    if (getSpecificPublication.length === 0) {
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
shapeAI.get("/publications/i/:isbn", (req, res) => {
    const getSpecificPublications = database.publications.filter((publications) =>
        publications.books.includes(req.params.isbn)
    );

    if (getSpecificPublications.length === 0) {
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
    shapeAI.post("/book/new", (req, res) => {
        const { newBook } = req.body;

        database.books.push(newBook);

        return res.json({ books: database.books, message: "book was added!" });
    });

/* 
Route            /author/new
Description      add new author
Access           PUBLIC
Parameters       NONE
Method           POST
*/

shapeAI.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    database.authors.push(newAuthor);

    return res.json({ authors: database.authors, message: "author was added!" });

});

/* 
Route            /publication/new
Description      add new publication
Access           PUBLIC
Parameters       NONE
Method           POST
*/

shapeAI.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;

    database.publications.push(newPublication);

    return res.json({ publication: database.publications, message: "publication was added!" });

});

/* 
Route            /book/update
Description      update title of a book
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({ books: database.books });
});

/* 
Route            /book/author/update
Description      update/add new author
Access           PUBLIC
Parameters       isbn
Method           PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res) => {
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.authors.push(req.body.newAuthor);
        }
    });

    //update author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor) {
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({
        books: database.books,
        authors: database.authors,
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

shapeAI.put("/author/update/:isbn", (req, res) => {
    database.authors.forEach((author) => {
        if (author.books.toString() === req.params.isbn) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({ authors: database.authors });
});

/* 
Route            /publication/update
Description      update name of a publication
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

shapeAI.put("/publication/update/:isbn", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.books.toString() === req.params.isbn) {
            publication.name = req.body.publicationName;
            return;
        }
    });
    return res.json({ publications: database.publications });
});

/* 
Route            /publication/update/book
Description      update/add a new book to publication
Access           PUBLIC
Parameters       isbn
Method           PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publications.books.push(req.params.isbn);
        }
    });
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publications,
        message: "successfully updated publications",
    });
});

/* 
Route            /book/delete
Description      delete a book
Access           PUBLIC
Parameters       isbn
Method           DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );
    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});

/* 
Route            /book/delete/author
Description      delete a author from a book
Access           PUBLIC
Parameters       isbn, author id
Method           DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });
    // update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book.ISBN !== req.params.isbn
            );
            author.books = newBooksList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author: database.authors,
        message: "author was deleted!",
    });
});
/* 
Route            /publication/delete/book
Description      delete a book from publication
Access           PUBLIC
Parameters       isbn, publication id
Method           DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    // update publication database
    database.publications.forEach((publication) => {
      if (publication.id === parseInt(req.params.pubId)) {
        const newBooksList = publication.books.filter(
          (book) => book !== req.params.isbn
        );
  
        publication.books = newBooksList;
        return;
      }
    });
  
    // update book database
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.publication = 0; // no publication available
        return;
      }
    });
  
    return res.json({
      books: database.books,
      publications: database.publications,
    });
  });

shapeAI.listen(3000, () => console.log("Server running!!😎"));