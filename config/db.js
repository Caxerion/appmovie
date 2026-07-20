require('dotenv').config();
const mysql = require('mysql2/promise');

const dburl = process.env.DATABASE_URL || '';
if(!dburl) {
    throw new Error("DATABASE_URL belum di set di .env")
}
const url= new URL(dburl);

const pool = mysql.createPool({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//,''),
    port: url.port ? Number(url.port) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool;