const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const routes = require('./routes/index');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

app.use(helmet());

const allowedOrigins = [
  'https://frontend-two-tan-16.vercel.app',
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use('/api', globalLimiter, routes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'AI Interview Preparation Platform API', version: '1.0.0' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
