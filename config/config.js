require("dotenv").config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "medica",
    host: DB_HOST,
    dialect: "postgres",
    port: 5432
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "medica",
    host: DB_HOST,
    dialect: "postgres",
    port: 5432
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "test_medica",
    host: DB_HOST,
    dialect: "postgres",
    port: 5432
  }
};
