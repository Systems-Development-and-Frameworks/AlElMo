import jwt from 'jsonwebtoken';

require('dotenv').config();

const context = ({ req }) => {
  let token = req.headers.authorization || '';
  token = token.replace('Bearer ', '');
  const jwtSign = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

  try {
    const userID = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );
    console.log('userID');
    return { userID /* , jwtSign */ };
  } catch (e) {
    return { jwtSign };
  }
};
export default context;
