const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const mongodb = require("mongodb");
// Setting up Database
const mongoose = require('mongoose');

//import problem model
const Problem = require('./models/problem');

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
    res.send({
        latex: 'x^2 + 5'
    });
});

app.post('/save', (req, res) => {
    var problem = req.body;
    console.log('THE DATA PASSED FROM REACT NATIVE IS: ');
    console.log(req.body);
    res.send(req.body);
    // var problem = {
    //     title: 'Quadratic Equation Test 2',
    //     category: 'Factoring',
    //     difficulty: 'Medium',
    //     latex: '/sqrt(x^2 + 5)'
    // }
    // Problem.create(problem, (err, savedProblem) => {
    //     if (err){
    //         console.log(err);
    //     }else{
    //         console.log('the problem was saved: ' + savedProblem);
    //         res.send(savedProblem);
    //     }
    // });
});
