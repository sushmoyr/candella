const router = require('express').Router();
const Literature = require('../models/data/literature');
const Genre = require('../models/data/genre');
const Category = require('../models/data/category');
const Chapter = require('../models/data/chapter');
const {verifyTokenFromCookie} = require("../utils/token_manager");
const contentController = require('../controllers/content/post_controller');
const Error = require("../models/utils/error");
const {Divisions} = require("../utils/Constants");
const {
    uploadLiterature,
    uploadJournal,
    uploadComic,
    uploadPhotographyPost
} = require("../controllers/content/post_controller");
const Success = require("../models/utils/success");

//Literature Post
router.get('/create', verifyTokenFromCookie, async (req, res) => {
    await getData().then(({genre, category}) => {
        /*console.log(genre);
        console.log(category);*/
        return res.render('create', {divisions: Divisions, genre: genre, category: category})
    }).catch(e => {
        res.status(500).send(e);
    })
});

const getData = async () => {
    try {
        const genre = await Genre.find();
        const category = await Category.find();

        return {genre, category};
    } catch (e) {
        return e;
    }
}

router.post('/create', verifyTokenFromCookie, async (req, res) => {
    const division = req.body.division.toLowerCase();

    if (!division || division === '...') {
        const error = new Error(404, 'Division not found. Add a division');
        return res.render('result', {error: error, success: null});
    }

    console.log(JSON.stringify(req.body, null, 2));

    if (division === Divisions.literature) {
        await uploadLiterature(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.render('result', {
                    error: null,
                    success: new Success(200, 'Added post to literature', JSON.stringify(result))
                });
            }).catch(err => {
                console.log(err);
                res.render('result', {
                    error: new Error(500, err),
                    success: null
                });
            });
    } else if (division === Divisions.journal) {
        await uploadJournal(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.render('result', {
                    error: null,
                    success: new Success(200, 'Added post to literature', JSON.stringify(result))
                });
            }).catch(err => {
                console.log(err);
                res.render('result', {
                    error: new Error(500, err),
                    success: null
                });
            });
    } else if (division === Divisions.comic) {
        await uploadComic(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.render('result', {
                    error: null,
                    success: new Success(200, 'Added post to literature', JSON.stringify(result))
                });
            }).catch(err => {
                console.log(err);
                res.render('result', {
                    error: new Error(500, err),
                    success: null
                });
            });
    } else if (division === Divisions.photography) {
        await uploadPhotographyPost(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.render('result', {
                    error: null,
                    success: new Success(200, 'Added post to literature', JSON.stringify(result))
                });
            }).catch(err => {
                console.log(err);
                res.render('result', {
                    error: new Error(500, err),
                    success: null
                });
            });
    } else {
        const error = new Error(404, 'Division not found. Add a division');
        return res.render('result', {error: error, success: null});
    }
});

//router.get('/', contentController.readMix);

router.get('/d/:division', contentController.readDiv);

router.get('/d/:division/:id', contentController.readByDivId);

router.get('/i/content/:id', contentController.readMixById);


module.exports = router;