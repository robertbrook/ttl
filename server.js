
const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/render', function (req, res) {
  const request = require('request');
  const N3 = require('n3');
  const parser = new N3.Parser({ format: 'turtle' });
  const store = new N3.Store();
  const ttlurl = req.query.url;
  
  request(ttlurl, function (error, response, body) {       
    store.addQuads(parser.parse(body));
    console.log(store.getQuads());
    
    res.render('render', { 
        subjects: store.getSubjects()
        });
    });
});
            

const listener = app.listen(process.env.PORT, function() {
  console.log('Up: port ' + listener.address().port);
});