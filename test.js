import { format } from 'date-fns';

const currentDate = new Date();
const formattedDate = format(currentDate, 'yyyy-MM-dd HH-mm-ss');
const newLogFilePath = `logs/app_${formattedDate}.log`;
console.log(newLogFilePath);
