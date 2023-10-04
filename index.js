import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import logging from './middlewares/log.mdw.js';
import { runLogRotation } from './utils/logRotation.js';

// routes
import categoryRouter from './routes/category.route.js';
import filmRouter from './routes/film.route.js';
import actorRouter from './routes/actor.route.js';

// swagger configuration
const yamlDocFile = fs.readFileSync('./swagger.yaml', 'utf-8');
const swaggerDocument = YAML.parse(yamlDocFile);

const app = express();

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logging);

app.get('/', function (req, res) {
    res.json({
        msg: 'hello from expressjs',
    });
});

app.use('/api/categories', categoryRouter);
app.use('/api/films', filmRouter);
app.use('/api/actors', actorRouter);

app.post('/', function (req, res) {
    res.status(201).json({
        msg: 'data created',
    });
});

app.use(function (req, res) {
    res.status(404).json({
        error: 'Endpoint not found',
    });
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).json({
        error: 'Something wrong',
    });
});

setInterval(runLogRotation, process.env.LOG_ROTATION_PERIOD || 6000); // Kiểm tra mỗi phút (60000 milliseconds)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sakila API is listening at http://localhost:${PORT}`);
});
