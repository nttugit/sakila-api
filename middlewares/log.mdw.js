import fs from 'fs';
const logFilePath = 'logs/app.log';

export default function (req, res, next) {
    const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
    };

    // Ghi log request vào tập tin
    fs.appendFile(logFilePath, JSON.stringify(logData) + '\n', (err) => {
        if (err) {
            console.error('Lỗi khi ghi log request: ' + err);
        }
    });

    // Theo dõi response và ghi log response vào tập tin
    const oldResponseEnd = res.end;
    const chunks = [];

    res.end = (...restArgs) => {
        // Lấy body data từ res.end
        // console.log("rest args", restArgs)
        if (restArgs[0]) {
            console.log('restArgs[0] ', restArgs[0]);

            chunks.push(Buffer.from(restArgs[0]));
        }

        const body = Buffer.concat(chunks).toString('utf8');

        // Thêm response và logData
        logData.response = {
            statusCode: res.statusCode,
            body,
        };
        // console.log('log data', logData);

        fs.appendFile(logFilePath, JSON.stringify(logData) + '\n', (err) => {
            if (err) {
                console.error('Lỗi khi ghi log response: ' + err);
            }
        });

        // Cập nhật lại res.end
        oldResponseEnd.apply(res, restArgs);
    };
    next();
}
