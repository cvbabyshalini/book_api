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
Description      get all book based on a author
Access           PUBLIC
Parameters       author
Method           GET
*/
shapeAI.get("/a/:author", (req, res) => {
    const getSpecificBooksAuthor = database.books.filter(
        (book) => book.authors.includes(req.params.author)

    );

    if (getSpecificBooksAuthor.length === 0) {
        return res.json({
            error: `No books found for the author of ${req.params.author}`,
        });
    }
    return res.json({ books: getSpecificBooksAuthor });

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
Route            /author
Description      get specific author based on name
Access           PUBLIC
Parameters       name
Method           GET
*/

shapeAI.get("/author/:name", (req, res) => {
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
shapeAI.get("/publications/:name", (req, res) => {
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

    shapeAI.listen(3000, () => console.log("Server running!!"));