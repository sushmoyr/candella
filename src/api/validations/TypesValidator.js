const {Category} = require("../helpers");
const {getCategories, getCategory} = require("../services/TypesService");

exports.validateCategory = async (id) => {
    await getCategory(id)
        .then(data => {
            console.log('Cat data ', data);
            return !!data;
        }).catch(e => {
            console.log('Cat err ', e);
            return false;
        })
}