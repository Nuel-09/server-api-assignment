const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
};

const sendError = (res, statusCode, message) => {
  sendResponse(res, statusCode, {
    success: false,
    error: message,
  });
};

const sendSuccess = (res, statusCode, data) => {
  sendResponse(res, statusCode, {
    success: true,
    data: data,
  });
};

module.exports = {
  sendResponse,
  sendError,
  sendSuccess,
};
