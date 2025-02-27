const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')


const dbConnection =require('./config/db')
const authRouter = require('./routes/authRoutes')
const taskRoute = require('./routes/taskRoutes')


dotenv.config();


const app = express();
const port = process.env.PORT || 7000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "https://fsd-challenge-frontend.onrender.com",
    credentials: true,
  })
);



app.use('/',authRouter);
app.use('/',taskRoute)

dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
