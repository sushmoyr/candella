const path = require("path");
const singleFileUpload = async (req, res, next) => {
    const file = req.files.file;
    if (!file){
        next();
    }

    const mime = file.mimetype.toString().replace('image/', '');
    const time = Date.now().toString();
    const name = `${time}.${mime}`;
    const dir = path.join(__baseDir, 'images', name);

    await file.mv(dir).then(v=>{
        req.imageLink = `${process.env.host}/images/${name}`;
        next();
    })
}

module.exports = singleFileUpload;