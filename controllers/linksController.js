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

    //console.log(req.body)

    //save on db
    const { original_name, name } = req.body;
    const link = new Link();
    link.url = shortid.generate();
    link.name = name;
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
            message:
                "This link doesn't exists or has reached the download limit",
        });
        return next();
    }
    const { name } = link;
    res.json({ file: name });

    next();
};

exports.allLinks = async (req, res, next) => {
    try {
        const links = await Link.find({}).select('url -_id');
        res.json({ links });
    } catch (error) {
        console.log(error);
    }
};

exports.hasPassword = async (req, res, next) => {
    const link = await Link.findOne({ url: req.params.url });

    if (!link) {
        res.status(404).json({
            message:
                "This link doesn't exists or has reached the download limit",
        });
        return next();
    }

    if (link.password) {
        return res.json({ password: true, link: link.url });
    }
    next();
};

exports.verifyPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;
    const link = await Link.findOne({ url });
    const match = await bcrypt.compare(password, link.password);
    //console.log(match);

    if (match) {
        return res.json({ match, file: link.name });
    } else {
        return res.json({ match });
    }
};
