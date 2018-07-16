const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000);
app.locals.title = 'mars-box';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(express.static('public'))

app.listen(app.get('port'), () => { 
  console.log(`${app.locals.title} is running on ${app.get('port')}.`) 
})
