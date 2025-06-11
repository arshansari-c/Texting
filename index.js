import express from 'express'
import dotenv from 'dotenv'
import { mongodb } from './db/mongoose.js'
import UserListRouter from './routes/UserList.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Allow all origins but still support credentials
app.use(cors({
  origin: 'https://6849ab19fdf9f824a02d5d27--sparkly-narwhal-232bb9.netlify.app',           // reflect the origin (important for credentials)
  credentials: true       // allow cookies (Authorization headers, etc.)
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})
mongodb()
app.use('/user',UserListRouter)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
