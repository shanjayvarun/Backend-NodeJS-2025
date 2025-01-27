const sendSuccess = (res, data, message) => {
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message,
        data
    });
};

const sendError = (res, error, message, data) => {
    const response = {
        status: false,
        statusCode: error.statusCode || 500,
        message,
    };
    if (data) {
        response.data = data;
    }
    return res.status(error.statusCode || 500).json(response);
};

module.exports = { sendSuccess, sendError };
