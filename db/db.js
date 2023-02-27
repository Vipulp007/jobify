import mongoose from 'mongoose';
// const url = process.env.URL;
mongoose.set('strictQuery', false);

const connectDB = () => {
  mongoose
    .connect(process.env.URL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((error) => console.log('Error: ', error));
};

export default connectDB;
