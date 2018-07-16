const environment = process.env.NODE_ENV || 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')[environment];
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
  beforeEach(done => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
      })
      .then(() => {
        return database.seed.run();
      })
      .then(() => {
        done();
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
        response.body.id.should.equal(1)
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
          console.log(response)
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          (response.body[0]).should.have.property('name');
          (response.body[0].name).should.equal('GameBoy Advance SP');
          (response.body[0]).should.have.property('packed');
          (response.body[0].gameName).should.equal(true);
          done();
        });
    })

    it('should return a response with status 500 if there is an error', done => {
      chai.request(server)
        .get('api/v1/item')
        .end((err, response) => {
          response.should.have.status(500)
          done();
        })
    })
  })

  describe('PATCH /api/v1/items/:id', () => {
    it('should succesfully update a specific item and return a response of 202', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .patch('/api/v1/items/' + response.body[0].id)
            .send({
              item: {
                name: 'Game Boy Color'
              }
            })
            .end((error, response) => {
              response.should.have.status(202);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.id.should.equal(1);
              done();
            })
        })
    })

    it('should send a resposne with stats 500 if there is an error', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .patch('/api/v1/items/' + 'ab671')
            .send({
              item: {
                name: 'Seamus'
              }
            })
            .end((error, response) => {
              response.should.have.status(500);
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
            .delete('/api/v1/items/' + response.body[0].id)
            .end((error, response) => {
              response.should.have.status(204);
              done();
            })
        })
    })

    it('should send respose with status 404 if there was an error', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .delete('/api/v1/items/34fsfd')
            .end((error, response) => {
              response.should.have.status(404);
              done();
            })
        })
    })
  })
});