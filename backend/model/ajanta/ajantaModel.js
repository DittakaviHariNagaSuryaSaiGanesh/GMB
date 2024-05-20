require('dotenv').config();
const mongoose = require('mongoose');
const dbURL = process.env.DB_URL;
const schema = mongoose.Schema;
mongoose.connect(dbURL).then(() => {
    console.log("Connection Success");
}).catch((err) => {
    console.log('error: ', err);
})

const ajantaFinalData =  mongoose.model('ajantafinaldatas', {})
const ajantaInsightsData = mongoose.model('ajantainsightsdatas', {})

module.exports = {
    ajantaFinalData,
    ajantaInsightsData
}