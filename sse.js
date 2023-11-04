import express from 'express';
import cors from 'cors';
import events from 'events';

const emitter = new events.EventEmitter();
// emitter.on('test', function (data) {
//   console.log(JSON.stringify(data));
// });

const app = express();
app.use(cors());

// app.get('/', function (req, res) {
//     emitter.emit('test', { data: 'test' });
//     res.end();
// });

// app.get('/subscribeCategoryAdded', function (req, res) {
//     res.writeHead(200, {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         Connection: 'keep-alive',
//     });

//     emitter.on('category_added', function (data) {
//         res.write(`retry: 500\n`);
//         res.write(`event: category_added\n`);
//         res.write(`data: ${JSON.stringify(data)}\n`);
//         res.write(`\n`);
//     });
// });

// app.post('/categories', function (req, res) {
//     const category = {
//         id: 1,
//         category_name: 'Mobile Phone',
//     };
//     emitter.emit('category_added', category);
//     res.status(201).json(category);
// });

export default emitter;

// const PORT = 3030 || process.env.PORT;
// app.listen(PORT, function () {
//     console.log('Server is running.');
// });
