require('dotenv').config()
const express = require('express');
const session = require('express-session')
const bodyParser = require("body-parser");
const path = require('path');


/* server lib */
const io = require('../socket');
const initDB = require('../database')

function createServer(router) {
    const app = express();
    const port = process.env.PORT || 8080;

    app.use(session({ resave: true, secret: process.env.SECRET_KEY, saveUninitialized: true }));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }));
    app.set('views', path.join(__dirname, '../../../views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, '../../../public')));


    /* DB initializaiton */
    initDB.config({ host: process.env.DB_HOST, port: process.env.DB_PORT, db: process.env.DB_NAME, username: process.env.DB_USER, password: process.env.DB_PASS })
    /* -------------------------------------------------------- */


    io.socketUtility(app.listen(port, () => console.log(`RUNNING on ${port}`)));

    router().dispatch(app);

    return app;
}

module.exports = createServer;