const uploadFile = require("./uploader");
const fs = require('fs');
const Error = require('../models/utils/error');
const Success = require('../models/utils/success');

const upload = async (req, res) => {
    try {
        await uploadFile(req, res).then(data => {console.log(data)});
        const file = req.file;
        if (file === undefined) {
            return res.status(400).send(new Error(400, "Please upload a file!"));
        }

        res.status(201).send(new Success(201, "Uploaded Successfully", 'http://localhost:8080' +  "/images/" + file.originalname));
    } catch (err) {
        res.status(500).send(new Error(400, `Could not upload the file: . ${err}`));
    }
};

const getListFiles = async (req, res) => {
    const directoryPath = __basedir + "/public/images/";

    await fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: "localhost:8080/" + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const download = async (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/public/images/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
};
