exports.successResponse = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    error: null
  });
};

exports.errorResponse = (res, message, error = null, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    error
  });
};