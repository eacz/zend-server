const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth')

router.post(
    '/',
    [
        check('email', 'The email is invalid').isEmail(),
        check(
            'password',
            'The password must have at least 6 characters'
        ).isLength({ min: 6 }),
    ],
    authController.authenticateUser
);
router.get('/',auth, authController.userAuthenticated);

module.exports = router;
