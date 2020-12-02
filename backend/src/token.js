require('dotenv').config();
const { sign } = require('jsonwebtoken');

const createAccessToken = (id) => sign({ id }, process.env.JWT_SECRET, { algorithm: 'HS256' });
export default { createAccessToken };
