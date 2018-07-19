const environment = process.env.NODE_ENV || 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    })
  })

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/sad')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });

});

describe('API Routes', () => {
  beforeEach(function (done) {
    database.migrate.rollback()
      .then(function () {
        database.migrate.latest()
          .then(function () {
            return database.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });

  describe('POST /api/v1/items', () => {
    it('should create a new item', done => {
      chai.request(server)
      .post('/api/v1/items')
      .send({
        item: {
          name: 'Sushi',
          packed: true
        }
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2)
      })
      done();
    })

    it('should return a response of 422 if there is a missing parameter', done => {
      chai.request(server)
      .post('/api/v1/items')
      .send({
        item: {}
      })
      .end((err, response) => {
        response.should.have.status(422)
      })
      done();
    })
  })

  describe('GET /api/v1/items', () => {
    it('should return all of the items', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.items.should.be.a('array');
          response.body.items.length.should.equal(1);
          (response.body.items[0]).should.have.property('name');
          (response.body.items[0].name).should.equal('GameBoy Advance SP');
          (response.body.items[0]).should.have.property('packed');
          (response.body.items[0].packed).should.equal(true);
          done();
        });
    })
  })

  describe('PATCH /api/v1/items/:id', () => {
    it('should succesfully update a specific item and return a response of 204', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .patch('/api/v1/items/' + response.body.items[0].id)
            .send({
              item: {
                name: 'Game Boy Color'
              }
            })
            .end((error, response) => {
              response.should.have.status(204);
              done();
            })
        })
    })

    it('should send a response with status 404 if the id does not match one found in the database', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .patch('/api/v1/items/' + '177')
            .send({
              item: {
                name: 'Seamus'
              }
            })
            .end((error, response) => {
              response.should.have.status(404);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('error');
              response.body.error.should.equal('No item with id: 177');
              done();
            })
        })
    })

    it('should send a response with status 422 the request body is missing information', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .patch('/api/v1/items/' + response.body.items[0].id)
            .send({})
            .end((error, response) => {
              response.should.have.status(422);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('error');
              response.body.error.should.equal('Incomplete information in request body');
              done();
            })
        })
    })
  })

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete an item based on id from params', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .delete('/api/v1/items/' + response.body.items[0].id)
            .end((error, response) => {
              response.should.have.status(204);
              done();
            })
        })
    })

    it('should send a response with status 404 if the id does not match one found in the database', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .delete('/api/v1/items/' + '177')
            .send({
              item: {
                name: 'Seamus'
              }
            })
            .end((error, response) => {
              response.should.have.status(404);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('error');
              response.body.error.should.equal('No item with id: 177');
              done();
            })
        })
    })

    it('should send respose with status 500 if there was an error', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .delete('/api/v1/items/34fsfd')
            .end((error, response) => {
              response.should.have.status(500);
              done();
            })
        })
    })
  })
});