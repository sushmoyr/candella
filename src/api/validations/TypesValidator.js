const {Category} = require("../helpers");
exports.validateCategory = (cat) => {
    const categories = Object.keys(Category);

    return categories.includes(cat.toUpperCase());
}