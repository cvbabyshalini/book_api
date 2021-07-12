const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/* 
Route            /publications
Description      get all publications
Access           PUBLIC
Parameters       NONE
Method           GET
*/
Router.get("/", async (req, res) => {
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
Router.get("/n/:name", async (req, res) => {
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
Router.get("/i/:isbn", async (req, res) => {
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
Route            /publication/new
Description      add new publication
Access           PUBLIC
Parameters       NONE
Method           POST
*/

Router.post("/new", async (req, res) => {
const { newPublication } = req.body;

await PublicationModel.create(newPublication);

return res.json({ message: "publication was added!" });

});

/* 
Route            /publication/update
Description      update name of a publication
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

Router.put("/update/:isbn",async (req, res) => {
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
Router.put("/update/book/:isbn", async (req, res) => {
// update the publication database
const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
        id: req.body.pubID,
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
        publication: req.body.pubId,
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
Route            /publication/delete/book
Description      delete a book from publication
Access           PUBLIC
Parameters       isbn, publication id
Method           DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
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
Router.delete("/delete/:name", async (req, res) => {
const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
    name: req.params.name,
});
//const updatedPublicationDatabase = database.publications.filter(
// (publication) => publication.name !== req.params.name
// );
//database.publicationss = updatedPublicationDatabase;
return res.json({ publications: updatedPublicationDatabase });
});

module.exports = Router;