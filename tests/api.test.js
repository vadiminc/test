const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('GET /rides/:id', () => {
    it('should return not found by id 1', (done) => {
      request(app)
        .get('/rides/1')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
    it('should return error by string', (done) => {
      request(app)
        .get('/rides/str')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });

  describe('GET /rides', () => {
    it('should return not found rides', (done) => {
      request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('POST /rides', () => {
    it('should return error for empty body', (done) => {
      request(app)
        .post('/rides')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('should return validation error by start_lat', (done) => {
      request(app)
        .post('/rides')
        .send({ start_lat: -100 })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
    
    it('should return validation error by end_lat', (done) => {
      request(app)
        .post('/rides')
        .send({ end_lat: -100 })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
    
    it('should return validation error by rider_name', (done) => {
      request(app)
        .post('/rides')
        .send({ rider_name: 1 })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('should return validation error by driver_name', (done) => {
      request(app)
        .post('/rides')
        .send({ rider_name: 's', driver_name: 1 })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('should return validation error by driver_vehicle', (done) => {
      request(app)
        .post('/rides')
        .send({ rider_name: 's', driver_name: 's', driver_vehicle: 1 })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('should return validation error by creating record', (done) => {
      request(app)
        .post('/rides')
        .send({ rider_name: 's', driver_name: 's', driver_vehicle: 's' })
        .expect('Content-Type', /json/)
        .expect(500, done);
    });
  });

});
