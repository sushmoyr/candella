const router = require('express').Router();
const singleFileUpload = require('../middlewares/SingleFileUpload');

const single = async (req, res) => {
    const image = req.imageLink;

    if (image) {
        return res.status(200).json({
            link: image
        })
    } else {
        return res.status(404);
    }

}


router.post('/single', singleFileUpload, single);



module.exports = router;