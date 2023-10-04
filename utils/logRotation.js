import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';

let logFilePath = 'logs/app.log';
const logFolderPath = 'logs';
const maxFileCount = 2; // Replace with the desired maximum file count

function countFilesInFolder(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        return files.length;
    } catch (err) {
        console.error('Error reading folder:', err);
        return -1;
    }
}

// Function to remove all files in a folder
function removeAllFilesInFolder(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
        });
        console.log('All files removed.');
    } catch (err) {
        console.error('Error removing files:', err);
    }
}

function removeLogFiles(maxFileCount, folderPath) {
    const fileCount = countFilesInFolder(folderPath);
    // console.log(maxFileCount, folderPath, fileCount);
    if (fileCount >= maxFileCount) {
        removeAllFilesInFolder(folderPath);
        console.log(`Đã xoá (${fileCount}) log files`);
    }
}

export function runLogRotation() {
    if (fs.existsSync(logFilePath)) {
        fs.stat(logFilePath, (err, stats) => {
            console.log('log file size: ' + stats.size);
            if (err) {
                console.error('Something wrong when check file size: ' + err);
                return;
            }

            // const maxLogSizeBytes = 1024 * 1024; // Kích thước tối đa 1 MB
            const maxLogSizeBytes = 1024;
            if (stats.size >= maxLogSizeBytes) {
                // Tạo file log mới
                const currentDate = new Date();
                const formattedDate = format(
                    currentDate,
                    'yyyy-MM-dd HH-mm-ss',
                );
                const newLogFilePath = `logs/app_${formattedDate}.log`;

                fs.rename(logFilePath, newLogFilePath, (err) => {
                    if (err) {
                        console.error(
                            'Something wrong when renaming file: ' + err,
                        );
                    }
                });

                // Xoá các log files (nếu muốn)
                removeLogFiles(maxFileCount, logFolderPath);
            }
        });
    } else {
        console.log('Rotation: chưa có log');
    }
}
