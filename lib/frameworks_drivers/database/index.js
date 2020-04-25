const mongoose = require('mongoose');

module.exports = {
    config: (config) => {
        var credentials;
        if (${config.username}.length > 0 && ${config.password}.length > 0) {
            credentials = ${config.username} + ':' + ${config.password} + '@';
        }
        else {
            credentials = '';
        }
        /* DB initializaiton */
        mongoose.set('useFindAndModify', false);
        const conn = mongoose.connection;
        const database = `mongodb://${credentials}${config.host}:${config.port}/${config.db}`;
        const connect = () => {
            return mongoose.connect(database, { useNewUrlParser: true }, err => {
                if (err) throw err;
            })
            .catch((err) => {
                if (err) {
                    console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                    setTimeout(connect, 5000);
                }
            })
        }


        conn.on('error', (err) => {
            throw new TypeError('Unable to connect to database.');
        });

        conn.once('open', () => {
            console.log('connection established');
        });


        connect()
    }

}