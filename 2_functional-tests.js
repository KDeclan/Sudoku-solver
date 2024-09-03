const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  // Tests for /api/solve
  suite('/api/solve POST', () => {

    test('Solve a puzzle with valid puzzle string', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'solution');
          assert.lengthOf(res.body.solution, 81);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.36x4.3.7.2..9.47...8..1..16....926914.37.' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37' }) // 80 characters
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '111111111.11111111.11111111.11111111.11111111.11111111.11111111.11111111.11111111' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });

  });

  // Tests for /api/check
  suite('/api/check POST', () => {

    test('Check a puzzle placement with all fields', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2',
          value: '1'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2',
          value: '2'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'B1',
          value: '1'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.36x4.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37',
          coordinate: 'A2',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'Z9',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2',
          value: '0'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });

  });

});
