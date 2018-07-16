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
        return database.migrate.latest()
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
        item: {
          name: 'best friend'
        }
      })
      .end((err, response) => {
        response.should.have.status(422)
      })
      done();
    })
  })

  describe('GET /api/v1/items', () => {
    it('should return all of the items', done => {
      console.log(database)
      done()
    })
  })
});