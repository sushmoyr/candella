const {Category, Genre} = require("../models");

exports.createCategory = async (name) => {
    return Category.create({name: name});
}

exports.getCategories = async () => {
    return Category.find();
}

exports.getCategory = async (id) => {
    return Category.find({_id: id});
}

exports.createGenre = async (name, category) => {
    return Genre.create({
        name: name,
        category: category
    });
}

exports.getGenre = async (filter = null) => {
    const populate = {
        path: 'category',
        select: '-__v'
    }
    if (filter !== null) {
        return Genre.findOne(filter).populate(populate).select('-__v');
    } else return Genre.find().populate(populate).select('-__v');
}
