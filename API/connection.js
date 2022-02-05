var mysql = require ('mysql');

exports.mysqlConnection = function () {
    var connection = undefined;

    if (connection) {
        console.log('Returning existing connection pool');
        return connection;
    }
   
    connection = mysql.createPool({
        connectionLimit: 25,
        host: '127.0.0.1',
        user: 'root',
        password: 'root1234',
        database: 'ecomdb',
        port: 3306,
        debug: false
    });

    connection.on('acquire', function (connection) {
        console.log('Connection %d acquired', connection.threadId);
    });

    connection.on('enqueue', function () {
        console.log('Waiting for available connection slot');
    });

    connection.on('release', function (connection) {
        console.log('Connection %d released', connection.threadId);
    });

    connection.is_pool_conn = true;
    return connection;
};