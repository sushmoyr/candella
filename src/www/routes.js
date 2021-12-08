const Docs = require('./models');
const routes = require('express').Router();


routes.get('/', async (req, res) => {
    const docs = await Docs.find();
    res.render('documentation', {docs: docs});
});

routes.post('/docs', async (req, res) => {
    const {id, password} = req.query;
    if (id === process.env.dev_id && password === process.env.dev_pass) {
        const {...others} = req.body;
        console.log(others);
        const doc = new Docs({...others});
        try {
            const newDoc = await doc.save();
            res.status(201).json(newDoc);
        } catch (e) {
            res.status(500).json(e);
        }

    } else {
        res.status(401).json({error: "invalid credentials"});
    }
})

module.exports = routes;