const Router = require("express").Router();

const AuthorModel = require("../../database/author");


/* 
Route            /author
Description      get all authors
Access           PUBLIC
Parameters       NONE
Method           GET
*/

Router.get("/", async (req, res) => {
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

Router.get("/n/:name", async (req, res) => {
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

Router.get("/i/:isbn", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.findOne({
         books: req.params.isbn,
    });

    if (!getSpecificAuthors) {
        return res.json({
            error: `No author found for the book ${req.params.isbn}`,
        });
    }

    return res.json({ authors: getSpecificAuthors });
});

/* 
Route            /author/new
Description      add new author
Access           PUBLIC
Parameters       NONE
Method           POST
*/

Router.post("/new", async (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: "author was added!" });

});

/* 
Route            /author/update
Description      update name of a author
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

Router.put("/update/:isbn", async (req, res) => {
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
Route            /author/delete
Description      delete an author
Access           PUBLIC
Parameters       name
Method           DELETE
*/
Router.delete("/delete/:name", async (req, res) => {
    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
        name: req.params.name,
    });
    //const updatedAuthorDatabase = database.authors.filter(
    // (author) => author.name !== req.params.name
    // );
    //database.authors = updatedAuthorDatabase;
    return res.json({ authors: updatedAuthorDatabase });
});


module.exports = Router;
