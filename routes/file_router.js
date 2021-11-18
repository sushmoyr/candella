const express = require("express");
const router = express.Router();
const controller = require("../controllers/file_controller");

let routes = (app) => {
    router.post("/upload", controller.upload);
    router.get("/files", controller.getListFiles);
    router.get("/files/:name", controller.download);
    router.post('/new', async (req, res) => {
        console.log("Post body");
        await controller.upload(req, res);
    });

    app.use('/api/v1',router);
};

module.exports = routes;