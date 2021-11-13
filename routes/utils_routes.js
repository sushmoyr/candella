const {utilsController} = require("../controllers/controllers");
const router = require('express').Router();

//category routes
router.get('/category', utilsController.getCategories);

router.get('/category/:id', utilsController.getCategoryById);

router.post('/category', utilsController.addCategory);

router.put('/category/:id', utilsController.updateCategory);

//genre routes
router.get('/genre', utilsController.getGenres);

router.get('/genre/:id', utilsController.getGenreById);

router.post('/genre', utilsController.addGenre);

router.put('/genre/:id', utilsController.updateGenre);

module.exports = router;