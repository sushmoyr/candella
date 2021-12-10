const {TypesService} = require('../services');
const {ErrorTemplates, StatusCodes} = require("../helpers");
const {Error, Success} = require("../models");
const {TypesValidator} = require("../validations");


const createCategory = async (req, res) => {
    await TypesService.createCategory(req.body.name)
        .then(data => {
            const success = new Success({
                code: StatusCodes.CREATED,
                message: 'Category Created',
                body: data
            })

            return res.status(success.code).json(success);
        })
        .catch(e => {
            const err = new Error({});
            console.log(e);
            err.message += e;

            return res.status(err.code).json(err);
        });
}

const getCategories = async (req, res) => {
    await TypesService.getCategories()
        .then(data => {
            return res.status(StatusCodes.OK).json(data);
        })
        .catch(e => {
            const err = new Error({});
            console.log(e);
            err.message += e;

            return res.status(err.code).json(err);
        });
}

const createGenre = async (req, res) => {
    const {name, category} = req.body;

    const isValid = TypesValidator.validateCategory(category);

    if (isValid) {
        await TypesService.createGenre(name, category)
            .then(data => {
                const success = new Success({
                    code: StatusCodes.CREATED,
                    message: 'Genre Created',
                    body: data
                })

                return res.status(success.code).json(success);
            })
            .catch(e => {
                const err = new Error({});
                console.log(e);
                err.message += e;

                return res.status(err.code).json(err);
            });
    } else {
        const err = new Error({
            code: StatusCodes.NOT_ACCEPTABLE,
            message: 'Validation Failed..!'
        });
        res.status(err.code).json(err);
    }


}

const getGenres = async (req, res) => {
    await TypesService.getGenre()
        .then(data => {
            return res.status(StatusCodes.OK).json(data);
        })
        .catch(e => {
            const err = new Error({});
            console.log(e);
            err.message += e;

            return res.status(err.code).json(err);
        });
}

const getGenre = async (req, res) => {
    await TypesService.getGenre({_id: req.params.id})
        .then(data => {
            return res.status(StatusCodes.OK).json(data);
        })
        .catch(e => {
            const err = new Error({});
            console.log(e);
            err.message += e;

            return res.status(err.code).json(err);
        });
}

const getGenresByCatID = async (req, res) => {
    const {categoryId} = req.params;
    await TypesService.getGenresByCatID(categoryId).then(data => {
        res.status(StatusCodes.OK).json(data)
    }).catch(e => {
        res.status(StatusCodes.BAD_REQUEST).json(new Error({}))
    })
}

module.exports = {
    createCategory, getCategories, createGenre, getGenres, getGenre, getGenresByCatID
}