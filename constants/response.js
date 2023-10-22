const RESPONSE = {
    SUCCESS: (data, message, meta = {}) => {
        return {
            success: true,
            data,
            message,
            meta,
        };
    },
    FAILURE: (error_code, message) => {
        return { success: false, error_code, message };
    },
};

export default RESPONSE;
