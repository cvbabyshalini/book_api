const mongoose = require("mongoose");
// Creating a book Schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 12,
    },
    title:{
        type: String,
        required: true,
        minLength: 15,
        maxLength: 20,
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,
});

// Create a book model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;