const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next) => {
    //check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }

    //save on db
    const { original_name } = req.body;
    const link = new Link();
    link.url = shortid.generate();
    link.name = shortid.generate();
    link.original_name = original_name;

    //auth user configs
    if (req.user) {
        const { downloads, password } = req.body;
        if (downloads) {
            link.downloads = downloads;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }
        link.author = req.user.id;
    }

    try {
        await link.save();
        return res.json({ url: `${link.url}` });
    } catch (error) {
        console.log(error);
    }
};

exports.getLink = async (req, res, next) => {
    const link = await Link.findOne({ url: req.params.url });

    if (!link) {
        res.status(404).json({
            message: "This link doesn't exists or has reached the download limit",
        });
        return next();
    }
    const {name,downloads} = link
    res.json({file: name });

    // downloads = 1
    if (downloads === 1) {

        req.file = name
        
        await Link.findOneAndRemove(req.params.url)
        next()
    } else {
        downloads--;
        await link.save()
        console.log(link)
    }

    // downloads > 1
};
