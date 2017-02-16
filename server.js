const express = require('express');
const http = require('http');
const path = require('path');
const stylus = require('stylus');

const app = express();

//Use process.env.PORT if set for Heroku, AWS, etc.
const port = process.env.PORT || 8080;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

//Enable Stylus preprocessor as middleware
app.use(stylus.middleware({
  src: path.join(__dirname, '/res'),
  dest: path.join(__dirname, '/public'),
  compile: ((str, filepath) => {
    return stylus(str)
      .set('filename', filepath)
      .set('compress', true);
  })
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) {
  res.render('index', {
    title: 'ReqHeader Parser',
    url: 'https://fcc-reqheader.herokuapp.com'
  });
});

app.get('/api', function (req, res, next) {
  
  let ip = req.headers['x-forwarded-for'] || req.ip;
  let lang = req.acceptsLanguages()[0];
  let soft = req.headers['user-agent'].match(/\(([^)]+)\)/)[1];

  res.json({
    ipaddress: ip,
    language: lang,
    software: soft
  });
});

app.get('*', function (req, res) {
  res.render('404', {});
});

app.listen(port);

//export functions for testing in server-test.js
module.exports = {};