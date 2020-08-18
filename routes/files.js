const express = require('express');
const router = express.Router();
const filesController = require('../controllers/filesController');
const auth = require('../middlewares/auth');

router.post('/', auth, filesController.uploadFile);

router.get('/:file', filesController.downloadFiles, filesController.deleteFile)

module.exports = router;
