const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 
const User = require('../models/userModel'); 
const { describe, it, before, beforeEach } = require('mocha');

chai.use(chaiHttp);
const should = chai.should();

describe('User Authentication API', () => {
  // Define test user data
  const testUser = {
    username: 'testuser',
    password: 'testpassword',
    email: 'test@example.com',
  };

  before((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  beforeEach((done) => {
    User.create(testUser, (err) => {
      done();
    });
  });

  // Test for the signup controller
  it('should register a new user', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send({ username: 'newuser', password: 'newpassword', email: 'new@example.com' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('user saved successfully');
        done();
      });
  });

  // Test for the login controller
  it('should log in an existing user', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('logged in successfully');
        done();
      });
  });


   // Test for the updateEmail controller
   it('should update the user email', (done) => {
    chai.request(app)
      .post('/api/auth/update-email')
      .send({ username: 'testuser', newEmail: 'newemail@example.com' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Email updated successfully');
        done();
      });
  });

// Test for the forgetPassword controller
it('should request a password reset', (done) => {
    chai.request(app)
      .post('/api/auth/forget-password')
      .send({ email: 'test@example.com' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Password reset instructions sent successfully');
        done();
      });
  });
  
  // Test for the resetPassword controller
  it('should reset the user password', (done) => {
    chai.request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'test@example.com', newPassword: 'newtestpassword' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Password reset successful');
        done();
      });
  });

});
