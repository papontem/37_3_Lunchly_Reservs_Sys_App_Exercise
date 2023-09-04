/** Database for lunchly */

const {Client} = require("pg");

const username = process.env.PG_USERNAME;
const password = process.env.PG_PASSWORD;
const port = process.env.PGPORT;

let db_name = process.env.NODE_ENV === "test" ? "lunchly_test" : "lunchly";

const db = new Client({
	host: "localhost",
	user: username,
	port: port,
	password: password,
	database: db_name,
});
db.connect();
module.exports = db;
