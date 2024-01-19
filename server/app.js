require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// extra packages
app.use(cors());
app.use(morgan('dev'));

// routes
const routes = require('./routes/routes.js');

app.get('/', (req, res) => {
  res.send('Welcome StratGeek Internship. This is an assignment.');
});

app.use('/api/v1', routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
