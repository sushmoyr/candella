const {Category, Genre} = require("../models");

exports.createCategory = async (name) => {
    return Category.create({name: name});
}

exports.getCategories = async () => {
    return Category.find();
}

exports.createGenre = async (name, category) => {
    return Genre.create({
        name: name,
        categoryName: category
    });
}

exports.getGenre = async (filter = null) => {
    if (filter !== null) {
        return Genre.findOne(filter);
    } else return Genre.find();
}
