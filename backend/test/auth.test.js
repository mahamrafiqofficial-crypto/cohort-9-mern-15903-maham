process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app-test');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it('should reject duplicate email registration', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'dup@example.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Another User', email: 'dup@example.com', password: 'password456' });

      expect(res.status).to.equal(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.token).to.be.a('string');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpassword' });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });
  });
});