const express = require( 'express' )
const router = express.Router()
const {
    getAllData,
    getTopFiveDoctors,
    getDocData,
    getAllDoctorNames
} = require('../../controllers/manipal/manipalControllers');


router.get('/', getAllData)

router.post('/', getTopFiveDoctors)

router.post('/docData', getDocData)

router.post('/getAllDocNames', getAllDoctorNames)

module.exports = router