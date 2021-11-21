const router = require('express').Router();
const Docs = require('../models/utils/documentation');

router.get('/', async (req, res) => {
    const docs = await Docs.find();
    console.log(docs);
    res.render('docs', {docs: docs});
})

router.post('/add_doc',  async (req, res) => {
    const {id, password} = req.query;
    if(id===process.env.dev_id && password===process.env.dev_pass){
        const {...others} = req.body;
        console.log(others);
        const doc = new Docs({...others});
        try{
            const newDoc = await doc.save();
            res.status(201).json(newDoc);
        } catch (e) {
            res.status(500).json(e);
        }

    } else {
        res.status(401).json({error: "invalid credentials"});
    }
})


module.exports = router;