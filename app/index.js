const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { of, pipe } = require('rxjs');
const { delay, map } = require('rxjs/operators');

const app = express();

const INCORRECT_STATUS = 'incorrect';
const CORRECT_STATUS = 'correct';

const middleware = pipe(
    delay(5000),
    map(value => value.includes('Яндекс')),
    map(isCorrect => ({ status: isCorrect ? CORRECT_STATUS : INCORRECT_STATUS }))
);

app
    .use(express.static(path.join(__dirname, 'static')))
    .use(bodyParser.json())
    .post('/check-solve', (req, res) => of(req.body.value)
        .pipe(middleware)
        .subscribe(res.send)
    );

app.listen(3000, console.log.bind(console, 'http://localhost:3000'));
