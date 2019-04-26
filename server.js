
const express = require('express');
const app = express();

const N3 = require('n3');
const parser = new N3.Parser();
const streamParser = N3.StreamParser();
const request = require('request');

const store = N3.Store();

var fromPrefixes;

Array.prototype.groupBy = function(prop) {
  return this.reduce(function(groups, item) {
    const val = item[prop]
    groups[val] = groups[val] || []
    groups[val].push(item)
    return groups
  }, {})
}

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/ontology', function (req, res) {
  
      const ontologyurl = req.query.url;
      
      request(ontologyurl, function (error, response, body) {
        store.removeQuads(store.getQuads());
        parser.parse(body,
        (error, quad, prefixes) => {
          if (quad)
            store.addQuad(quad);
          else if (prefixes)
          { 
            fromPrefixes = prefixes;
            
    const gotTypeOntology = store.getSubjects('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Ontology')[0];
            
    const gotDcDescription = store.getQuads(undefined, fromPrefixes.dcterms + 'description', undefined)[0];
    const gotDcTitle = store.getQuads(undefined, fromPrefixes.dcterms + 'title', undefined)[0];
  const gotDcTermsCreated = store.getQuads(undefined, fromPrefixes.dcterms + 'created', undefined)[0];

  const gotDcTermsRights = store.getQuads(undefined, fromPrefixes.dcterms + 'rights', undefined)[0];
  
  const gotOwlClassSubjects = store.getSubjects(fromPrefixes.rdf + 'type', fromPrefixes.owl + 'Class', undefined);

            
  const gotOwlObjectPropertySubjects = store.getSubjects(fromPrefixes.rdf + 'type', fromPrefixes.owl + 'ObjectProperty', undefined);
            console.log(gotOwlObjectPropertySubjects);
            var gotOwlObjectProperties = [];
            for (var gotOwlObjectPropertySubject in gotOwlObjectPropertySubjects) {
              var gotOwlObjectProperty = store.getQuads(gotOwlObjectPropertySubjects[gotOwlObjectProperty], undefined, undefined);
      gotOwlObjectProperties.push(gotOwlObjectProperty);  
            }
            
            
            // TODO equivalentClass, subClass
  var gotOwlClasses = [];
    for (var gotOwlClassSubject in gotOwlClassSubjects) {
    
      var gotOwlClass = store.getQuads(gotOwlClassSubjects[gotOwlClassSubject].id, undefined, undefined);
      gotOwlClasses.push(gotOwlClass);
  }
            
  const gotFoafMakerBlankNodes = store.getObjects(undefined, 'http://xmlns.com/foaf/0.1/maker', undefined);
  
  var fmQuads = [];
    for (var gotFoafMakerBlankNode in gotFoafMakerBlankNodes) {
    
      var foafMaker = store.getQuads(gotFoafMakerBlankNodes[gotFoafMakerBlankNode].id, undefined, undefined);
      fmQuads.push(foafMaker);
  }
  
  res.render('ontology', { gotQuads: store.getQuads(undefined, undefined, undefined),
                          gotQuadsBySubject: store.getQuads(undefined, undefined, undefined).groupBy(0),
                          gotDcDescriptionValue: gotDcDescription.object.value,
                          gotDcDescriptionLanguage: gotDcDescription.object.language,
                          gotPrefixes: fromPrefixes,
                          gotDcTitleValue: gotDcTitle.object.value,
                          gotDcTitleLanguage: gotDcTitle.object.language,
                          gotDcTermsCreatedValue: gotDcTermsCreated.object.value,
                          ontologyurl: ontologyurl,
                          fms: fmQuads,
                          gotDcTermsRights: gotDcTermsRights,
                          gotFoafDepiction: store.getObjects(undefined, 'http://xmlns.com/foaf/0.1/depiction', undefined)[0],
                          gotOwlClassSubjects: gotOwlClassSubjects,
                          gotOwlClasses: gotOwlClasses
                      });
            

          };
        });
      });
  
  
  
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});