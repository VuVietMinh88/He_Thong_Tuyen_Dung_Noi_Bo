// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Xử lý riêng lỗi 403 Forbidden
  if (err.status === 403 || err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: err.message || 'Access Forbidden',
    });
  }

  // Các lỗi mặc định khác
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;