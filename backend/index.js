require('dotenv').config()
const express = require('express');
const app = express();
const cros = require('cors')
const PORT = process.env.PORT;
const ajantaApis = require('./routes/ajanta/userRouts');
const userApi = require( './routes/login/loginRout' );
const manipalApis = require( './routes/manipal/manipalRout' )
const crosOPT = {
    origin: "https://staging.multipliersolutions.com/GMB/",
    originSuccessStatus: 200
}
app.use( express.json() )
app.use(cros(crosOPT))

app.use((req, res, next) => {
    next();
})

app.use('/api/ajanta', ajantaApis);

app.use( '/api/login', userApi );

app.use('/api/manipal', manipalApis);


app.listen(PORT, () => {
    console.log('Listining in port: ', PORT);
})