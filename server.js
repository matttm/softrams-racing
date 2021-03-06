const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.delete('/api/members/:id', (req, res) => {
    const id = req.params.id;
    if (!isWholeNumber(id)) {
        res.status(400).send('id must be a whole number');
    }
    request.delete(`http://localhost:3000/members/${id}`, (err, response, body) => {
        if (response.statusCode <= 500) {
            res.status(200).send(body);
        }
    });
});

app.put('/api/members/:id', (req, res) => {
    const id = req.params.id;
    if (!isWholeNumber(id)) {
        res.status(400).send('id must be a whole number');
    }
    const member = req.body;
    if (isValidMember(member)) {
        request.put({
            url: `http://localhost:3000/members/${id}`,
            json: member
        }, (err, response, body) => {
            if (response.statusCode <= 500) {
                res.status(200).send(body);
            }
        });
    } else {
        res.status(400).send(`Object does not have all member fields`);
    }
});

app.get('/api/members/:id', (req, res) => {
    const id = req.params.id;
    if (!isWholeNumber(id)) {
        res.status(400).send('id must be a whole number');
    }
    request.get(`http://localhost:3000/members/${id}`, (err, response, body) => {
        if (response.statusCode <= 500) {
            res.status(200).send(body);
        }
    });
});

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('/api/teams', (req, res) => {
    request.get('http://localhost:3000/teams', (err, response, body) => {
        if (response.statusCode <= 500) {
            res.status(200).send(body);
        }
    });
});

// Submit Form!
// I switched this endpoint from 'addMember' to 'members', for
// doing so follows a more RESTful practice of the 'members' resource
app.post('/api/members', (req, res) => {
    console.log(`POST to members was ${JSON.stringify(req.body)}`);
    const member = req.body;
    // Ensure the object has proper keys
    if (isValidMember(member)) {
        request.post({
            url: 'http://localhost:3000/members',
            json: member
        }, (err, response, body) => {
            if (response.statusCode <= 500) {
                res.status(201).send(body);
            }
        });
    } else {
        res.status(400).send(`Object does not have all member fields`);
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});

function isValidMember(m) {
    return m.firstName && m.lastName && m.jobTitle && m.team && m.status;
}

function isWholeNumber(v) {
    return v % 1 === 0;
}
