const router = require('express').Router();
const singleFileUpload = require('../middlewares/SingleFileUpload');

const single = async (req, res) => {
    const image = req.imageLink;
    res.status(200).json({
        link: image
    })
}


router.post('/single', singleFileUpload, single);



module.exports = router;