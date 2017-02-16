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
app.use( express.static(path.join(__dirname, 'public')) );

app.get('/', function(req, res, next) {
  res.render('index', {title: 'ReqHeader Parser', url:'https://kk-fcc-reqheader.herokuapp.com'});  
});

app.get('/api', function(req, res, next) {
  //console.log(req.headers);
  //let { "host" } = req.headers;
  console.log(req.ip);
  console.log(req.acceptsLanguages());
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  console.log('ip????',ip);
  res.json(req.headers);
  //res.render('index', {title: 'API', url:'https://kk-fcc-reqheader.herokuapp.com'});  
});

app.get('*', function(req, res) {
  res.render('404', {});
});

app.listen(port);

//export functions for testing in server-test.js
module.exports = {
    //dateStrToJSON: dateStrToJSON,
};