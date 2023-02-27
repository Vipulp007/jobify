import jwt from 'jsonwebtoken';
import UnAuthenticate from '../errors/unauthenticate.js';

const authenticate = (req, res, next) => {
  console.log('authenticate');
  const authtoken = req.headers.authorization;
  if (!authtoken || !authtoken.startsWith('Bearer'))
    throw new UnAuthenticate('invalid user');
  try {
    const token = authtoken.split(' ')[1];
    const data = jwt.verify(token, 'secret');
    req.user = { userId: data.userId };
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export default authenticate;
