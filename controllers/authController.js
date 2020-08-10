const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: 'vars.env' });

exports.authenticateUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: "The user doesn't exists" });
        return next();
    }
    const match = bcrypt.compareSync(password, user.password);

    if (match) {
        const token = jwt.sign(
            { id: user._id, name: user.name },
            process.env.SECRET_KEY,
            { expiresIn: '8h' }
        );
        res.json({ message: 'User authenticated', token });
    } else {
        res.status(401).json({ message: "The password doesn't match" });
    }
};

exports.userAuthenticated = async (req, res, next) => {
    res.json({user: req.user})
};
