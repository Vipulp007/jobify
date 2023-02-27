import express from 'express';
const app = express();
import connectDB from './db/db.js';
import authroutes from './routes/authroutes.js';
import jobroutes from './routes/jobroutes.js';
import errorhandlermiddleware from './middleware/errorhandlermiddleware.js';
import notfoundmiddleware from './middleware/notfoundmiddleware.js';
import authenticate from './middleware/authenticate.js';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
dotenv.config();
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.static(path.join(__dirname, './client/build')));
app.use('/api/v1/auth', authroutes);
app.use('/api/v1/jobs', authenticate, jobroutes);
app.use(notfoundmiddleware);
app.use(errorhandlermiddleware);
const port = 5000;
app.get('*', (req, res) => {
  res.send(express.static(path.join(__dirname, './client/build/index.html')));
});
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log('server is running on ', port);
    });
  } catch {
    console.log('error occur');
  }
};
start();
