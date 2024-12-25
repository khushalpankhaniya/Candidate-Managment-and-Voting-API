import express from 'express'
import dotenv from 'dotenv'
import connection from './db.js'
import userRoutes from './routes/userRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'

const app = express();
app.use(express.json());
dotenv.config();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`[${currentTime}] - ${req.method} request made to: ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to Voting app...');
});

app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)

app.listen(port, () => {
  console.log(`Voting app listening on port ${port}`);
});
