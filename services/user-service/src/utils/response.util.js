const sendSuccess = (res, statusCode, data, message) => {
  return res.status(statusCode).json({ status: true, statusCode, message, data });
};

const sendError = (res, statusCode, message, data) => {
  const payload = { status: false, statusCode, message };
  if (data) payload.data = data;
  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError,
};
