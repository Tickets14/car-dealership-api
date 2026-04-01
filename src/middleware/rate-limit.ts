import rateLimit from 'express-rate-limit';

/** 5 requests per IP per hour — for public form submissions */
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many form submissions from this IP, please try again after an hour.',
      statusCode: 429,
    },
  },
});

/** 100 requests per IP per minute — for general API endpoints */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
    },
  },
});
