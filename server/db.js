const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "THEGRE@t2206",
    host: "localhost",
    port: 5432,
    database: "finalyear",
})

module.exports = pool;