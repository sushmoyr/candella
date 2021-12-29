const path = require("path");
const singleFileUpload = async (req, res, next) => {
    const file = req.files.file;
    if (!file){
        next();
    }
    console.log('File uploader');
    console.log(file.mimetype.toString());

    const mime = file.mimetype.toString().replace('image/', '');
    const time = Date.now().toString();
    const name = `${time}.jpg`;
    console.log({name});
    const dir = path.join(__baseDir, 'uploads', name);

    await file.mv(dir).then(v=>{
        req.imageLink = `/uploads/${name}`;
        next();
    })
}

module.exports = singleFileUpload;