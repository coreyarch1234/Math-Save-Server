// This is the remote server for Tangent. Saves problem data
// Also generates random problems for simple web app
// middleware
const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const mongodb = require('mongodb');
// Setting up Database
const mongoose = require('mongoose');

//import problem model
const Problem = require('./models/problem');

// Khan Academy's library to render latex as html
var katex = require('katex');
// Returns promise with specific topics as object (algebra, calculus, etc)
var specificTopics = require('./specific-topics');

// Use bluebird
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mathsave', {
  useMongoClient: true,
  /* other options */
});

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Setting templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(process.env.PORT || port, function() {
    console.log('server started: ' + port);
    console.log('env port' + process.env.PORT);
  });
});

// Display json of problems
app.get('/show', (req, res) => {
  Problem.find({}).exec((err,problems) => {
    if (err) {
      console.log(err);
    }else{
      res.send(problems);
    }
  });
});

// For simple web app. Pass in problems by topic
app.get('/generate', (req, res) => {
  var topicPromise = specificTopics();
  topicPromise.then((results) => {
    // assigns random problem from respective category
    const any = results.Any[Math.floor(Math.random()*results.Any.length)];
    const algebra = results.Algebra[Math.floor(Math.random()*results.Algebra.length)];
    const calculus = results.Calculus[Math.floor(Math.random()*results.Calculus.length)];

    //renders latex of those random problems
    const anyRendered = any !== undefined ? katex.renderToString(any.latex) : '';
    const algebraRendered = algebra !== undefined ? katex.renderToString(algebra.latex) : '';
    const calculusRendered = calculus !== undefined ? katex.renderToString(calculus.latex) : '';

    res.render('layouts/main', {any: anyRendered, algebra: algebraRendered, calculus: calculusRendered});
  });
});

// To save latex sent from clientside in MongoDB
app.post('/latex', (req, res) => {
  var problem = req.body;
  Problem.create(problem, (err, savedProblem) => {
    if (err){
      console.log(err);
    } else {
      var renderedLatex = katex.renderToString(savedProblem.latex);
      res.send({
        problem: savedProblem,
        renderedLatex: renderedLatex
      });
    }
  });
});
