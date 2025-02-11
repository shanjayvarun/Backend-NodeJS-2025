const sendSuccessPost = (res, data, message) => {
    return res.status(201).json({
        status: true,
        statusCode: 201,
        message,
        data
    });
};

const sendSuccessGet = (res, data, message) => {
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message,
        data
    });
};

const sendSuccessUpdateOrDelete = (res, message) => {
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message
    });
};

const sendSuccessNoContent = (res) => {
    return res.status(204).json({
        statusCode: 204,
    });
}

const sendError = (res, statusCode, message, data) => {
    const STATUSCODE = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
    switch (STATUSCODE) {
        case 400:
            console.error("Bad Request ===> ", message);
            break;
        case 404:
            console.error("Not Found ===> ", message);
            break;
        case 409:
            console.error("Conflict ===> ", message);
            break;
        case 500:
            console.error("Internal Server Error ===> ", message);
            break;
        default:
            console.error(`Error ${STATUSCODE} ===> `, message);
            break;
    }
    const response = {
        status: false,
        statusCode: STATUSCODE,
        message,
    };
    if (data) {
        response.data = data;
    }
    return res.status(STATUSCODE).json(response);
};

module.exports = { sendSuccessGet, sendSuccessPost, sendSuccessUpdateOrDelete, sendSuccessNoContent, sendError };
