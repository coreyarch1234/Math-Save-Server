var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');

var port = 3000;

var mongodb = require("mongodb");
// Setting up Database
var mongoose = require('mongoose');
