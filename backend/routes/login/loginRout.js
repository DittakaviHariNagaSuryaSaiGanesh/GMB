const express = require('express')
const router = express.Router();
const {loginHandeler} = require('../../controllers/login/loginControllers')

router.post('/', loginHandeler)

module.exports = router;