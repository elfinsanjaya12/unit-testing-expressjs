const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app.js');
const helpers = require('./helpers');

describe('Server Endpoint Test', () => {
  it('GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.have.property('message')
    expect(response.body.message).to.equal('Welcome to Backend API'); 
  });
});

describe('User API Endpoint Tests', () => {
  // before(() => {
  //   console.log('============before');    
  // });

  // after(() => {
  //   console.log('============after');
  // });
  
  // beforeEach(() => {
  //   console.log('----beforeEach');
  // });

  // afterEach(() => {
  //   console.log('----afterEach');
  // });

  context('GET /api/v1/users', () => {
    it('fail to get users with status code 401 because not have the token', async () => {
      const response = await request(app)
        .get('/api/v1/users');
  
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Not authenticated');  
    });
    
    it('fail to get users with status code 401 because the token is invalid', async () => {
      const tokenFake = 'dsafsadfsmdfkmaskfmsakjdnfask3453';
      
      await helpers.createUser();
      
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${tokenFake}`);
  
      expect(response.statusCode).to.equal(401);    
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Token invalid');
    });
  
    it('Success read all users with status code 200', async () => {
      let user = await helpers.createUser();
      
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${user.token}`);
  
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Read all users');
      expect(response.body).to.have.property('user');
    });
  });

  context('POST /api/v1/user', () => {
    it('fail to create a new user without input data (validation) with status code 422', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({});
      
      expect(response.statusCode).to.equal(422);
      expect(response.body).to.have.property('error');    
    });

    it('success create a new user with status code 201', async () => {
      const user = {
          name: 'Fari',
          email: 'fari@gmail.com',
          password: '123456'
      };
  
      const response = await request(app)
        .post('/api/v1/users')
        .send(user);    
      
      expect(response.statusCode).to.equal(201);        
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Success create user');
      expect(response.body).to.have.property('user');
    });
  });

  context('POST /api/v1/users/login | Login User', () => {
    it('fail to login with status code 404 because login credentials are invalid', async () => {
      const user = {      
        email: 'fari@gmail.com',
        password: 'xxxxxx'
      };
  
      const response = await request(app)
        .post('/api/v1/users/login')
        .send(user);    
      
      expect(response.statusCode).to.equal(404);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Invalid login');    
    });

    it('Success to login with status code 200', async () => {
      const user = {      
        email: 'fari@gmail.com',
        password: '123456'
      };
  
      const response = await request(app)
        .post('/api/v1/users/login')
        .send(user);    
      
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Success login');
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
      expect(response.body.user).to.include({
          email: 'fari@gmail.com'
      });
    });
  });

  context('GET /api/v1/users/me | GET My Profile', () => {
    it('fail to get my profile with status code 401 because not yet login', async () => {
      const response = await request(app)
        .get('/api/v1/users/me');
      
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Not authenticated');    
    });
    
    it('success to read my profile with status code 200', async () => {
      let user = await helpers.createUser();
      
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${user.token}`);
  
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Show profile');
      expect(response.body).to.have.property('user'); 
    });
  });
    
  context('PATCH /api/v1/users/:idUser| UPDATE Profile User', () => {
    it('success to updated profile user with status code 200', async () => {
      let user = await helpers.createUser();    
      
      const newUserData = {
        name: "Test Update User",
        email: "testUpdateUser@gmail.com"
      }    
      
      const response = await request(app)
        .patch(`/api/v1/users/${user.user.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(newUserData);
      
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Success updated profile');
      expect(response.body).to.have.property('user'); 
    });
  });

  context('DELETE /api/v1/users/:idUser | DELETE User', () => {
    it('success deleted the user using his own token tih status code 200', async () => {
      let user = await helpers.createUser();
    
      const response = await request(app)
        .delete(`/api/v1/users`)
        .set('Authorization', `Bearer ${user.token}`);
      
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Success deleted user itself');
      expect(response.body).to.have.property('user'); 
    });

    it('success deleted another user with status code 200', async () => {
      let user1 = await helpers.createUser();
  
      const user = {      
        email: 'fari@gmail.com',
        password: '123456'
      };
  
      const responseLogin = await request(app)
        .post('/api/v1/users/login')
        .send(user);
    
      const response = await request(app)
        // .delete(`/api/v1/users/${user.user.id}`)
        .delete(`/api/v1/users/${user1.user.id}`)
        // .delete(`/api/v1/users/1`)
        .set('Authorization', `Bearer ${responseLogin.body.token}`);
      
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Success deleted user');
      expect(response.body).to.have.property('user'); 
    });
  });  
  
  // Level hak akses user ada 3 :
  // 1. guest
  // 2. member
  // 3. admin
  
  // Update profil dengan 2 cara :
  // 1. melalui akun sendiri
  // 2. melalui akun admin

  // Tujuan Apps :
  // Setelah User melakukan Register, maka user akan mendapatkan token
  // Token inilah yang akan digunakan untuk masuk ke dalam sistem
  // sehingga user tersebut tidak perlu melakukan login lagi 
  // karena otomatis sudah bisa masuk kedalam sistem.
  
});