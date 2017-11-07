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

app.get('/', (req, res) => {
    var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");
    res.render('layouts/main', { html: html });
});

app.post('/save', (req, res) => {
    var problem = req.body;
    console.log('THE DATA PASSED FROM REACT NATIVE IS: ');
    console.log(req.body);
    Problem.create(problem, (err, savedProblem) => {
        if (err){
            console.log(err);
        }else{
            //send rendered latex with it.
            console.log('the problem was saved: ' + savedProblem);
            res.send(savedProblem);
        }
    });
});

//test server side katex rendering
app.post('/latex', (req, res) => {
    var problem = req.body;
    console.log('THE DATA PASSED FROM REACT NATIVE IS: ');
    console.log(req.body);
    Problem.create(problem, (err, savedProblem) => {
        if (err){
            console.log(err);
        }else{
            //send rendered latex with it.
            var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");
            console.log('the problem was saved: ' + savedProblem);
            res.send({html:html});
        }
    });
    //function to return html var
    // var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");
    // res.render('layouts/main', { html: html });
});
