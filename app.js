const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config()

const app = express()


//Middleware
app.use(morgan('dev'))
app.use(bodyparser.json())

app.use(express.static(__dirname + '/view'))
app.use(express.static(__dirname + '/script'))

//Routes
 app.use('/', require('./routes/index'));
 app.use('/user',require('./routes/user'))


//start server
//env for deploying to glitch/AWS/heroku
const port = process.env.PORT || 3000
app.listen(port,()=>{
  //using es6 template literals
  console.log(`server is listening at ${port}`);
})
