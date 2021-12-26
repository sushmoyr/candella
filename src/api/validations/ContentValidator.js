const {Reason} = require("../models");
const {Limits} = require("../helpers");
const {TypesService, ContentService} = require("../services");

const verifyOwner = async (postId, authorId) => {
    const post = await ContentService.getSingleContent({_id: postId, author: authorId}, null);
    return post.hasData;
}

const categories = [
    "61afda37f402ce41f5d21bec",
    "61afdb9031d1cebfa2b3e438",
    "61afdb9231d1cebfa2b3e43c",
    "61afdb9331d1cebfa2b3e441",
    "61afdb9331d1cebfa2b3e443",
    "61afdb9331d1cebfa2b3e445"
]

const isGenresInCategory = async (category, genres) => {
    let errors = [], isValid = true;

    if (!categories.includes(category)) {
        errors.push(new Reason('category', `Invalid category id`));
        isValid = false;
        return {errors, isValid};
    }

    const genresOfCategory = await TypesService.getGenresByCatID(category);

    for (const genre of genres) {
        const match = genresOfCategory.some(g => {
            //console.log('in some: ',g);
            return g['_id'].toString() === genre
        });

        if (!match) {
            isValid = false;
            errors.push(
                new Reason(
                    'Genre',
                    `Value ${genre} doesn't belong to category ${category}`
                )
            )
        }

        //console.log({match});
    }

    return {errors, isValid};
}

const validate = async (content) => {
    console.log({content});

    const {title, description, category, genre} = content;

    let {isValid, errors} = isAllFieldsSet({title, description, category, genre});

    if (isValid) {
        console.log('Continue validation to check constraints');
        const constraint = checkConstraint(description)
        isValid = constraint.isValid;
        errors = constraint.errors;
    }

    if (isValid) {

        const result = await isGenresInCategory(category, genre);
        console.log('checking genre');
        isValid = result.isValid;
        errors = result.errors;
    }

    return {isValid, errors};
}

const isAllFieldsSet = (object) => {
    const keys = Object.keys(object);
    let errors = [], isValid = true;

    for (const key of keys) {
        if (!object[key]) {
            isValid = false
            errors.push(new Reason(
                key.toString(),
                `Required Field ${key} is empty or null.`
            ))
        }
    }

    //console.log('Field set: ', {isValid, errors})

    return {isValid, errors};
}

const checkConstraint = (description) => {
    let errors = [], isValid = true;
    if (!(description.length > 0 && description.length <= Limits.MAX_CONTENT_DESCRIPTION_LENGTH)) {
        isValid = false;
        errors.push(new Reason(
            'description',
            `Field description must be non-empty and smaller than ${Limits.MAX_CONTENT_DESCRIPTION_LENGTH}`
        ))
    }
    return {isValid, errors};
}


module.exports = {
    validate,
    verifyOwner
}