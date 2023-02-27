import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide name '],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'please provide email '],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'please provide password '],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 20,
    default: 'Last Name',
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'my city',
  },
});
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, 'secret', { expiresIn: '1d' });
};
UserSchema.methods.comparePswd = async function (pswd) {
  const match = await bcrypt.compare(pswd, this.password);
  return match;
};
export default mongoose.model('User', UserSchema);
