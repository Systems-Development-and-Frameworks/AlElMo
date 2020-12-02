import jwt from 'jsonwebtoken';

require('dotenv').config();

const context = ({ req }) => {
  let token = req.headers.authorization || '';
  token = token.replace('Bearer ', '');

  try {
    const userID = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    // console.log('context here', decodedJwt);

    return { userID };
  } catch (e) {
    return {};
  }
};
export default {
  context,
};
