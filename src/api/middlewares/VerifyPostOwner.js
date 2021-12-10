const {ContentValidator} = require("../validations");
const {StatusCodes} = require("../helpers");
const {Error} = require("../models");
const verifyPostOwner = async (req, res, next) => {
    const {id} = req.params;
    const isValid = await ContentValidator.verifyOwner(id, req.user.id);

    if (isValid)
        next();
    else res.status(StatusCodes.UNAUTHORIZED)
        .json(new Error({
            code: StatusCodes.UNAUTHORIZED,
            message: 'You are not allowed to edit a post which is not yours.'
        }))
}

module.exports = verifyPostOwner