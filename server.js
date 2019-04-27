
const express = require('express');
const app = express();
const url = require('url');

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
  
  const myURL = url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
  console.log(myURL);
  
  request(ttlurl, function (error, response, body) {       
    store.addQuads(parser.parse(body));
    
    const subjects = store.getSubjects();
    
    var subjectPacks = [];
        
    subjects.forEach(function(subject) {
        var subjectPack = [];
        store.forEach(function(thisQuad){subjectPack.push(thisQuad);}, subject.id, null, null, null);
        subjectPacks.push(subjectPack);
        // console.log('\n\n', subject.id, subjectPacks);
      });
        
    res.render('render', { 
        subjects: subjects,
        subjectPacks: subjectPacks,
        predicates: store.getPredicates(),
        objects: store.getObjects(),
        graphs: store.getGraphs()
        });
    });
});
            

const listener = app.listen(process.env.PORT, function() {
  console.log('Up: port ' + listener.address().port);
});