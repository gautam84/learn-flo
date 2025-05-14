import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import api from './routes/api';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001', // your Next.js frontend
    credentials: true, // if you're using cookies/auth headers
  }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use('/api/v1', api);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
