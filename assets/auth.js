import User from '../models/User.js';
import BadRequest from '../errors/badrequest.js';
import NotFound from '../errors/notfound.js';
import UnAuthenticate from '../errors/unauthenticate.js';
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new BadRequest('please provide all value');
    }
    const findemail = await User.findOne({ email });
    if (findemail) {
      throw new BadRequest('email already in use');
    }
    const user = await User.create(req.body);
    const location = user.location;
    user.save();
    const token = user.createJWT();
    res.status(201).send({ user, token, location });
  } catch (error) {
    console.log('error occur', error);
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequest('provide all details');
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnAuthenticate('no user exist');
    }
    console.log(user);
    const location = user.location;
    const ispswd = await user.comparePswd(password);
    if (!ispswd) throw new UnAuthenticate('invalid password');
    const token = user.createJWT();
    res.status(200).send({ user, token, location });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  const { email, name, lastName, location } = req.body;
  try {
    if (!email || !name || !lastName || !location) {
      throw new BadRequest('provide all details in form');
    }
    const user = await User.findOne({ _id: req.user.userId });
    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;
    const token = await user.createJWT();
    res.status(200).send({ user, token });
    await user.save();
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export { register, login, updateUser };
