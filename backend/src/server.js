import express from 'express';
import cors from 'cors';

import authRouter from './routes/authRouter.js';
import postsRouter from './routes/postsRouter.js';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});