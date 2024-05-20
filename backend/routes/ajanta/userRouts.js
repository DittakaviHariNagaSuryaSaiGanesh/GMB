const express = require('express');
const router = express.Router();
const {
    getAllData,
    getTopFiveDoctors,
    getDocData,
    getAllDoctorNames
} = require('../../controllers/ajanta/ajantaControllers');


router.get('/', getAllData)

router.post('/', getTopFiveDoctors)

router.post('/docData', getDocData)

router.post('/getAllDocNames', getAllDoctorNames)


module.exports = router