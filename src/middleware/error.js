// 404 handler for unmatched routes
export const notFound = (req, res, next) => {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
};

// Centralized error handler
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  console.error(err);
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
};
