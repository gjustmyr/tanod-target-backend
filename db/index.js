const { Sequelize } = require('sequelize');

const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST || 'localhost',
  port: DB_PORT ? Number(DB_PORT) : 3306,
  dialect: 'mysql',
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };

