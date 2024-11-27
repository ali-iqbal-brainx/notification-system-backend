require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./configs/mongoDb');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;
app.use(express.static('public'));

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/v1', require("./routes/index"));

db.connection()
    .then(() => {
        console.log("DB connected successfully")
        app.listen(port, () => {
            console.log(`app listening on port ${port}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })


