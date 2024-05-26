const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
const db = require('./config/database');
require('dotenv').config();

const port = process.env.PORT

const app = express();

app.use(cors()); // enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

// connect to db then start server
db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});

db.on('error', (error) => {
    console.error('Database connection error:', error)
})

