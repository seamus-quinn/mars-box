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
  for(let requiredParameter of ['name']) {
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

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      response.status(200).json({ items })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.patch('/api/v1/items/:id', (request, response) => {
  const { item } = request.body;
  const { id } = request.params;

  if (item === undefined) {
    return response.status(422).send({Error: 'Incomplete information in request body'})
  }

  database('items').where('id', id).update(item, 'id')
    .then(gameId => {
      response.sendStatus(204);
    })
    .catch(error => {
      response.status(404).json({ error });
    });
});

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('items').where('id', id).del()
    .then(() => response.sendStatus(204))
    .catch(() => response.status(404).json({ Error: 'Cannot find matching id'}))
})

module.exports = app;
