import connectDB from './db/db.js';
import Job from './models/Jobs.js';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const start = async () => {
  try {
    await connectDB();
    await Job.deleteMany();

    const jsonProducts = JSON.parse(
      await readFile(new URL('./MOCK_DATA.json', import.meta.url))
    );
    await Job.create(jsonProducts);
    console.log('success');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
