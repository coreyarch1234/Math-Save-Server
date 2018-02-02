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

var katex = require('katex');

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



app.get('/show', (req, res) => {
    Problem.find({}).exec((err,problems) => {
        if (err) {
            console.log(err);
        }else{
            res.send(problems);
        }
    })

});

app.get('/generate', (req, res) => {
    Problem.count().exec((err, count) => {
        // Get a random entry
        var random = Math.floor(Math.random() * count);

        Problem.findOne().skip(random).exec((err, problem) => {
            var renderedLatex = katex.renderToString(problem.latex);
            res.render('layouts/main', {html: renderedLatex});
        })
    });
})



// app.get('/', (req, res) => {
//
//     var newProblems = []
//
//     Problem.find({}).sort({_id:-1}).exec((err,problems) => {
//         if (err) {
//             console.log(err);
//         }else{
//             for (problem of problems){
//                 console.log(problem)
//
//                 var renderedLatex = katex.renderToString(problem.latex);
//                 newProblems.push({
//                     title: problem.title,
//                     topic: problem.topic,
//                     latex: problem.latex,
//                     renderedLatex: renderedLatex
//                 });
//
//             }
//             console.log('THE NEW PROBLEM ARRAY IS: ' + newProblems);
//             res.send(newProblems);
//         }
//     })
//
// });


app.post('/latex', (req, res) => {
    var problem = req.body;
    console.log('THE DATA PASSED FROM REACT NATIVE IS: ');
    console.log(req.body);

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
