// require('dotenv').config();

const {
  JWT_SECRET = 'JWT_SECRET',
  PORT = '3000',
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

module.exports = {
  JWT_SECRET,
  PORT,
  DB_ADDRESS,
};
