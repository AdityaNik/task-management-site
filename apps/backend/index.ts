import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import taskRouter from './routes/tasks';

const app = express();
// Check for connection string and database name before connecting to MongoDB
if (process.env.CONNECTION_STRING && process.env.DB_NAME) {
  mongoose.connect(process.env.CONNECTION_STRING, { dbName: process.env.DB_NAME })
} else {
  console.log("ERROR connecting no data available");
}

app.use(cors({
  methods: ["POST", "GET", "DELETE"],
}));
app.use(express.json())

// Define routes for authentication and task management
app.use('/auth', authRouter);
app.use('/task', taskRouter);

app.get('/', (req, res) => {
  res.json({
    "msg": "hello all"
  })
})

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log('Backend is on...');
});
