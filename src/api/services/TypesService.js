const {Category, Genre} = require("../models");

const createCategory = async (name) => {
    return Category.create({name: name});
}

const getCategories = async () => {
    return Category.find();
}

const getCategory = async (id) => {
    return Category.find({_id: id});
}

const createGenre = async (name, category) => {
    return Genre.create({
        name: name,
        category: category
    });
}

const getGenre = async (filter = null) => {
    const populate = {
        path: 'category',
        select: '-__v'
    }
    if (filter !== null) {
        return Genre.findOne(filter).populate(populate).select('-__v');
    } else return Genre.find().populate(populate).select('-__v');
}

const getGenresByCatID = async (catID) => {
    try {
        const genres = await Genre.find({category: catID});
        console.log('-------------------------------')
        console.log(genres);
        console.log('-------------------------------')
        return genres;
    } catch (e) {
        console.log(e)
        return null;
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    createGenre,
    getGenre,
    getGenresByCatID
}
