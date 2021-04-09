const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

const questions = require('./db');

app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/getQuestions', (req, res) => {
    res.send(JSON.stringify(questions));
});

app.put('/updateQuestion/:id', (req, res) => {
    let id = req.params.id;

    questions[id] = req.body;

    res.end();
});

app.post('/addQuestion', (req, res) => {
    questions.push(req.body);
    res.end();
});

app.delete('/resolveQuestion/:id', (req, res) => {
    let id = req.params.id;

    questions.splice(id, 1);

    res.end();
});

app.listen(port, () => {
  console.log(`Discussion app listening at http://localhost:${port}`);
});