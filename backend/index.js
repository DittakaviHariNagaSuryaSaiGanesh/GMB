require('dotenv').config()
const express = require('express');
const app = express();
const cros = require('cors')
const PORT = process.env.PORT;
const ajantaApis = require('./routes/ajanta/userRouts');
const userApi = require( './routes/login/loginRout' );
const manipalApis = require( './routes/manipal/manipalRout' )
const allowedOrigins = [
  'http://localhost:3000',
  'https://staging.multipliersolutions.com'
];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use( express.json() )
app.use(cros(corsOptions))

app.use((req, res, next) => {
    next();
})

app.use('/api/ajanta', ajantaApis);

app.use( '/api/login', userApi );

app.use('/api/manipal', manipalApis);


app.listen(PORT, () => {
    console.log('Listining in port: ', PORT);
})