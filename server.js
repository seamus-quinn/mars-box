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

app.post('/api/v1/items', (request, response) => {
  const { item } = request.body;

  for(let requiredParameter of ['name', 'packed']) {
    if (!item[requiredParameter]){
      return response
        .status(422)
        .send({ error: `Expected format: { item: <String>, packed: <Boolean> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  database('items').insert(item, 'id')
    .then(item => {
      response.status(201).json({id: item[0]})
    })
    .catch(error => {
      response.status(500).json({ error });
    });
})

module.exports = app;
