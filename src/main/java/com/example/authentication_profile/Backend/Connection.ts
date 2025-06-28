import * as mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Santiago412_',
    database: 'omega',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
