const dotenv = require('dotenv');
dotenv.config();

const supertest = require('supertest');
const should = require('should');

const server = supertest.agent(`http://localhost:${process.env.PORT}`);

let token;

// UNIT test begin

describe('UserController endpoints: /users', () => {

  describe('create user', () => {

    it('should fail to register the user because of missing body', (done) => {
      server
        .post('/api/users/register')
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) =>  {
          res.status.should.equal(400);
          res.body.errors.should.Array();
          done();
        });
    });
    it('should fail to register the user because of missing body password', (done) => {
      server
        .post('/api/users/register')
        .send({username: 'Mike', email: 'mike@test.com'})
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) =>  {
          res.status.should.equal(400);
          res.body.errors.should.Array();
          done();
        });
    });
    it('should fail to register because username is too short', (done) => {
      server
        .post('/api/users/register')
        .send({username: 'Mi', email: 'mike@test.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) =>  {
          res.status.should.equal(400);
          res.body.errors.should.Array();
          res.body.errors[0].param.should.equal('username');
          done();
        });
    });
    it('should fail to register because email is invalid', (done) => {
      server
        .post('/api/users/register')
        .send({username: 'Mike', email: 'miketest.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) =>  {
          res.status.should.equal(400);
          res.body.errors.should.Array();
          res.body.errors[0].param.should.equal('email');
          done();
        });
    });
    it('should create the user.', (done) => {
      server
        .post('/api/users/register')
        .send({username: 'Mike', email: 'mike@example.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(201) // THis is HTTP response
        .end((err, res) =>  {
          res.status.should.equal(201);
          res.body.token.should.be.String();
          done();
        });
    });
    it('should fail to create the user, because username already used.', (done) => {
      server
        .post('/api/users/register')
        .send({username: 'Mike', email: 'other@example.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(409) // THis is HTTP response
        .end((err, res) =>  {
          res.status.should.equal(409);
          res.body.errors.should.be.Array();
          res.body.errors[0].param.should.equal('username');
          done();
        });
    });
    it('should fail to create the user, because email already used.', (done) => {
      server
        .post('/api/users/register')
        .send({username: 'MikeOther', email: 'mike@example.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(409) // THis is HTTP response
        .end((err, res) =>  {
          res.status.should.equal(409);
          res.body.errors.should.be.Array();
          res.body.errors[0].param.should.equal('email');
          done();
        });
    });

  });


  describe('login user', () => {

    it('should fail to login the user because of missing body', (done) => {
      server
        .post('/api/users/login')
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.errors.should.Array();
          done();
        });
    });
    it('should fail to login the user because invalid password', (done) => {
      server
        .post('/api/users/login')
        .send({email: 'mike@example.com', password: 'invalidPassword'})
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        });
    });
    it('should fail to login the user because invalid email', (done) => {
      server
        .post('/api/users/login')
        .send({email: 'invalid@example.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        });
    });
    it('should login', (done) => {
      server
        .post('/api/users/login')
        .send({email: 'mike@example.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(200) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.token.should.be.String();
          token = `Bearer ${res.body.token}`;
          done();
        });
    });

  });


  describe('update user', () => {

    it('should fail to update the user because of missing Authorization header', (done) => {
      server
        .patch('/api/users')
        .send({email: 'mike@example.com', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(401) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
    });
    it('should fail to update the user because of missing body', (done) => {
      server
        .patch('/api/users')
        .set('Authorization', token)
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.errors.should.Array();
          done();
        });
    });
    it('should fail to update the user because invalid password', (done) => {
      server
        .patch('/api/users')
        .set('Authorization', token)
        .send({newPassword: 'newPassword', password: 'invalidPassword'})
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        });
    });
    it('should update the user', (done) => {
      server
        .patch('/api/users')
        .set('Authorization', token)
        .send({newPassword: 'newPassword', password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(200) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });

  });


  describe('delete user', () => {

    it('should fail to delete the user because of missing Authorization header', (done) => {
      server
        .delete('/api/users')
        .send({password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(401) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
    });
    it('should fail to delete the user because of invalid Authorization header', (done) => {
      server
        .delete('/api/users')
        .set('Authorization', 'sometoken')
        .send({password: 'validPassword'})
        .expect('Content-type', /json/)
        .expect(401) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
    });
    it('should fail to update the user because of missing body', (done) => {
      server
        .delete('/api/users')
        .set('Authorization', token)
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.errors.should.Array();
          done();
        });
    });
    it('should fail to delete the user because invalid password', (done) => {
      server
        .delete('/api/users')
        .set('Authorization', token)
        .send({password: 'invalidPassword'})
        .expect('Content-type', /json/)
        .expect(400) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        });
    });
    it('should delete the user', (done) => {
      server
        .delete('/api/users')
        .set('Authorization', token)
        .send({password: 'newPassword'})
        .expect('Content-type', /json/)
        .expect(200) // THis is HTTP response
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });

  });
});
