const {ChapterValidator} = require("../validations");
const {Error} = require("../models");
const {StatusCodes} = require("../helpers");
const validateChapter = async (req, res, next) => {
    const userId = req.user.id;
    const {isValid, errors} = await ChapterValidator.validate(req.body, userId);

    if (isValid) {
        req.body.author = req.user.id;
        next();
    } else {
        const error = new Error({
            code: StatusCodes.NOT_ACCEPTABLE,
            message: 'Validation Error..!',
            reasons: errors
        });
        return res.status(error.code).json(error);
    }
}

module.exports = validateChapter