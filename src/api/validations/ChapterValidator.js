const {Reason} = require("../models");
const {ContentService} = require("../services");
const validate = async (data, author) => {
    const {category, chapterName, contentId, body} = data;

    let {isValid, errors} = isAllFieldsSet({category, chapterName, contentId, body});

    if (isValid) {

        const hasPermission = await checkMutationPermission(contentId, author);

        if (!hasPermission) {
            isValid = false;
            errors.push(new Reason(
                'author',
                'You don\'t have permission to add/edit chapters in this content'
            ))
        }
    }

    return {isValid, errors};

}

const checkMutationPermission = async (contentId, author) => {
    const contentSnapshot = await ContentService.getSingleContent({_id: contentId}, false, false);

    if (contentSnapshot.hasData) {
        const content = contentSnapshot.data;

        return content.author.toString() === author.toString();
    }

    return false;
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

module.exports = {
    validate
}