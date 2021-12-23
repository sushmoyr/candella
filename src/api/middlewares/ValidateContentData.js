const {ContentValidator} = require("../validations");
const {Error} = require("../models");
const {StatusCodes} = require("../helpers");
const validateContentData = async (req, res, next) => {
    console.log('validating content data');
    const {isValid, errors} = await ContentValidator.validate(req.body);

    console.log({isValid, errors});
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

module.exports = validateContentData;