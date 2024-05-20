require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const ajantaApis = require('./routes/ajanta/userRouts');
const userApi = require('./routes/login/loginRout');

app.use(express.json())

app.use((req, res, next) => {
    next();
})

app.use('/api/ajanta', ajantaApis);

app.use('/api/login', userApi);


app.listen(PORT, () => {
    console.log('Listining in port: ', PORT);
})