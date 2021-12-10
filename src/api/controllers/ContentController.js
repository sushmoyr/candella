//create content
const {ContentService, UserService} = require("../services");
const {Success, Error} = require("../models");
const {StatusCodes, QueryHelper} = require("../helpers");
const createContent = async (req, res) => {
    const contentData = req.body;
    const snapshot = await ContentService.createContent(contentData);

    console.log({snapshot})

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Successfully Created',
            body: snapshot.data
        }));
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));
}
//read single content by id
const readContent = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.getSingleContent({_id: id})

    console.log({snapshot})

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(snapshot.data);
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));
}
//read multiple content
const readContents = async (req, res) => {
    const options = QueryHelper.pagination(req)
    const snapshot = await ContentService.getAllContents(null, options);

    console.log({snapshot});

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(snapshot.data);
    } else {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    }
}
//edit single content
const updateContent = async (req, res) => {
    const {id} = req.params
    const author = req.user.id;
    const snapshot = await ContentService.updateContent(id, author, req.body);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Content Successfully Updated',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));

}
//delete single content
const deleteContent = async (req, res) => {
    const {id} = req.params
    const author = req.user.id;
    const snapshot = await ContentService.deleteContent(id, author);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Content Successfully Deleted',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}

module.exports = {
    createContent, readContent, readContents, updateContent, deleteContent
}