const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { of } = require('rxjs');
const { delay, map } = require('rxjs/operators');

const app = express();

const INCORRECT_STATUS = 'incorrect';
const CORRECT_STATUS = 'correct';

app
    .use(express.static(path.join(__dirname, 'static')))
    .use(bodyParser.json())
    .post('/validate-secret', (req, res) => of(req.body.value)
        .pipe(
            delay(5000),
            map(value => value.includes('Яндекс')),
            map(isCorrect => ({ status: isCorrect ? CORRECT_STATUS : INCORRECT_STATUS }))
        )
        .subscribe(response => res.json(response))
    );

app.listen(3000, console.log.bind(console, 'http://localhost:3000'));
