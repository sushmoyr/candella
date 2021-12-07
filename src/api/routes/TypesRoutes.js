const express = require('express');
const {TypesController} = require("../controllers");
const {route} = require("express/lib/router");

const router = express.Router();

router.post('/category', TypesController.createCategory);

router.get('/category', TypesController.getCategories);

router.post('/genre', TypesController.createGenre);

router.get('/genre', TypesController.getGenres);

router.get('/genre/:id', TypesController.getGenre)

module.exports = router;