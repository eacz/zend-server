const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;
const corsConfig = {
    origin: process.env.FRONTEND_URL,
};
app.use(cors(corsConfig));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
    );
    next();
});

connectDB();

//enable read data through body
app.use(express.json());

//enable public folder
app.use(express.static('uploads'));

//routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

app.listen(port, '0.0.0.0', () => {
    console.log(`workinggg on port ${port}`);
});
