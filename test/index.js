const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app.js');
const helpers = require('./helpers');

describe('Server', () => {
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

  context('GET /users', () => {
    it('GET /api/v1/users Guest not have token', async () => {
      const response = await request(app)
        .get('/api/v1/users');
  
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Not authenticated');  
    });
    
    it('GET /api/v1/users Validation token invalid', async () => {
      const tokenFake = 'dsafsadfsmdfkmaskfmsakjdnfask3453';
      
      await helpers.createUser();
      
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${tokenFake}`);
  
      expect(response.statusCode).to.equal(401);    
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Token invalid');
    });
  
    it('GET /api/v1/users Success read all users', async () => {
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

  context('CREATE New User', () => {
    it('POST /api/v1/users Validation create new user no input data', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({});
      
      expect(response.statusCode).to.equal(422);
      expect(response.body).to.have.property('error');    
    });

    it('POST /api/v1/users Success create new user', async () => {
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

  context('Login User', () => {
    it('POST /api/v1/users/login Invalid login credentials', async () => {
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

    it('POST /api/v1/users/login Success login', async () => {
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

  context('GET My Profile', () => {
    it('GET /api/v1/users/me Guest can not access profile, must login', async () => {
      const response = await request(app)
        .get('/api/v1/users/me');
      
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Not authenticated');    
    });
    
    it('GET /api/v1/users/me Success read my profile', async () => {
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
    
  context('UPDATE Profile User', () => {
    it('PUT /api/v1/users/:idUser Update my profile', async () => {
      let user = await helpers.createUser();    
      
      const dataUserLatest = {
        name: "Test Update User",
        email: "testUpdateUser@gmail.com"
      }    
      
      const response = await request(app)
        .put(`/api/v1/users/${user.user.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(dataUserLatest);
      
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Success updated profile');
      expect(response.body).to.have.property('user'); 
    });
  });

  context('DELETE User', () => {
    it('DELETE /api/v1/users/:idUser Delete user itself', async () => {
      let user = await helpers.createUser();
    
      const response = await request(app)
        .delete(`/api/v1/users`)
        .set('Authorization', `Bearer ${user.token}`);
      
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Success deleted user itself');
      expect(response.body).to.have.property('user'); 
    });

    it('DELETE /api/v1/users/:idUser Delete another user', async () => {
      // let user = await helpers.createUser();
  
      const user = {      
        email: 'fari@gmail.com',
        password: '123456'
      };
  
      const responseLogin = await request(app)
        .post('/api/v1/users/login')
        .send(user);
    
      const response = await request(app)
        // .delete(`/api/v1/users/${user.user.id}`)
        .delete(`/api/v1/users/${responseLogin.body.user.id}`)
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