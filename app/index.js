const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const INCORRECT_STATUS = 'incorrect';
const CORRECT_STATUS = 'correct';

app
    .use(express.static(path.join(__dirname, 'static')))
    .use(bodyParser.json())
    .post('/check-solve', (req, res) => {
        const value = req.body.value;

        setTimeout(() => {
            const [leftSide, rightSide] = value.split('=');
            if (!rightSide) return res.send({
                status: INCORRECT_STATUS,
                reason: 'Задача не полностью оформлена'
            });

            if (value.split(/[+=]/g).length !== 3) return res.send({
                status: INCORRECT_STATUS,
                reason: 'Неверно сформулирована задача'
            });

            const sum = String(leftSide.split('+').reduce((acc, cur) => acc + Number(cur), 0));

            if (sum !== rightSide) return res.send({
                status: INCORRECT_STATUS,
                reason: 'Неверное решение'
            });

            res.send({ status: CORRECT_STATUS });
        }, 5000);
    });

app.listen(3000, console.log.bind(console, 'http://localhost:3000'));
