import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
