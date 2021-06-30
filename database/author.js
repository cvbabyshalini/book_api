const mongoose = require("mongoose");

// Author Schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

// Create author model

const AuthorModel = mongoose.model(AuthorSchema);
module.exports = AuthorModel;