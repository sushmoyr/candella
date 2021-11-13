const Category = require('../models/data/category');
const Genre = require('../models/data/genre');
const Success = require('../models/utils/success');

exports.getCategories = async (req, res) => {
    const data = await Category.find();
    res.status(200).json(data);
}
exports.getCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
}
exports.addCategory = async (req, res) => {
    const {categoryName, divisionName} = req.body;
    if (categoryName && divisionName) {
        await Category.create({
            categoryName: categoryName,
            divisionName: divisionName
        }).then(data => {
            res.status(201).json(new Success(200, "Category Added...!", data))
        })
    } else {
        res.status(500).send('Error');
    }
}
exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
    res.status(200).json(category);
}

//genres
exports.addGenre = async (req, res) => {
    const {name} = req.body;
    if(name){
        await Genre.create({name: name}).then(data => {
            res.status(201).json(new Success(201, 'Genre Created...!', data));
        }).catch(e=>res.status(500).json(e));
    } else {
        res.status(500).json("There was an error");
    }
}

exports.getGenres = async (req, res) => {
    const data = await Genre.find();
    res.status(200).json(data);
}
exports.getGenreById = async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    res.status(200).json(genre);
}
exports.updateGenre = async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
    res.status(200).json(genre);
}