import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import RESPONSE from './constants/response.js';

// routes
import categoryRouter from './routes/category.route.js';
import filmRouter from './routes/film.route.js';
import actorRouter from './routes/actor.route.js';
import userRouter from './routes/userAuth.route.js';

// swagger configuration
const yamlDocFile = fs.readFileSync('./swagger.yaml', 'utf-8');
const swaggerDocument = YAML.parse(yamlDocFile);

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', function (req, res) {
    res.status(200).json(RESPONSE.SUCCESS(null, 'Hello World!', null));
});

app.use('/api/categories', categoryRouter);
app.use('/api/films', filmRouter);
app.use('/api/actors', actorRouter);
app.use('/api/auth', userRouter);

app.post('/', function (req, res) {
    res.status(201).json({
        msg: 'data created',
    });
});

app.use(function (req, res) {
    res.status(404).json(RESPONSE.FAILURE(404, 'Endpoint not found'));
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).json(RESPONSE.FAILURE(500, 'Something went wrong'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sakila API is listening at http://localhost:${PORT}`);
});
