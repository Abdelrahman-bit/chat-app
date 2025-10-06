import express from 'express';
import env from 'dotenv';
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js';
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './utils/db.js';

env.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRouter);




app.use(errorHandler);
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
    connectDB();
})