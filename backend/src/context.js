import jwt from 'jsonwebtoken';
import { config as initEnv } from 'dotenv';

initEnv();

const context = ({ req }) => {
  const token = String(req.headers.authorization).replace('Bearer ', '');
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
