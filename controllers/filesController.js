const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Link = require('../models/Link')

exports.uploadFile = async (req, res, next) => {
    const fileLimit = req.user ? 1024 * 1024 * 10 : 1024 * 1024;
    const config = {
        limits: { fileSize: fileLimit },
        storage: (fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads');
            },
            filename: (req, file, cb) => {
                const ext = file.originalname.substring(
                    file.originalname.lastIndexOf('.'),
                    file.originalname.length
                );
                cb(null, `${shortid.generate()}${ext}`);
            },
            /*fileFilter: (req,file,cb) => {
                if(file.mimetype === 'application/pdf'){
                    return cb(null,true);
                }
            }*/
        })),
    };

    const upload = multer(config).single('file');
    upload(req, res, async (error) => {
        //console.log(req.file);

        if (!error) {
            res.json({ file: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });
};

exports.deleteFile = async (req, res, next) => {
    try {
        fs.unlinkSync(`${__dirname}/../uploads/${req.file}`);
        console.log('deleted');
    } catch (error) {
        console.log(error);
    }
};

exports.downloadFiles = async (req, res, next) => {
    const link = await Link.findOne({name: req.params.file})
    //console.log(link)

    //console.log(req.params.file);
    const file = __dirname + '/../uploads/' + req.params.file;
    res.download(file);

    const {downloads, name} = link
    // downloads = 1
    if (downloads === 1) {

        req.file = name
        
        await Link.findOneAndRemove(link.id)
        next()
    } else {
        // downloads > 1
        downloads--;
        await link.save()
        //console.log(link)
    }

};
