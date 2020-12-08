import jwt from 'jsonwebtoken';

require('dotenv').config();

const context = ({ req }) => {
  let token = req.headers.authorization || '';
  token = token.replace('Bearer ', '');
  const jwtSign = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    return { user, jwtSign };
  } catch (e) {
    return { jwtSign };
  }
};
export default context;
