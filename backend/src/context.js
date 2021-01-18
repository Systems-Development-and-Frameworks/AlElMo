import jwt from 'jsonwebtoken';
import { config as initEnv } from 'dotenv';

initEnv();

const context = ({ req }) => {
  const token = String(req.headers.authorization).replace('Bearer ', '');
  const jwtSign = (id) => jwt.sign({ id }, process.env.JWT_SECRET);
  const ctx = { jwtSign };
  try {
    ctx.user = jwt.verify(token, process.env.JWT_SECRET);
    return ctx;
  } catch (e) {
    return ctx;
  }
};
export default context;
