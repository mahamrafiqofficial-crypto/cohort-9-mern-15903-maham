process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app-test');

describe('Notes API', () => {
  let token;

  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Notes User', email: 'notes@example.com', password: 'password123' });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notes@example.com', password: 'password123' });

    token = loginRes.body.token;
  });

  it('should reject requests without a token', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).to.equal(401);
  });

  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note', content: 'This is a test note' });

    expect(res.status).to.equal(201);
    expect(res.body.note.title).to.equal('Test Note');
  });

  it('should fetch all notes for logged-in user', async () => {
    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Note 1', content: 'Content 1' });

    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.notes).to.have.lengthOf(1);
  });

  it('should update a note', async () => {
    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original Title', content: 'Original content' });

    const noteId = createRes.body.note._id;

    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.status).to.equal(200);
    expect(res.body.note.title).to.equal('Updated Title');
  });

  it('should delete a note', async () => {
    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete', content: 'Will be deleted' });

    const noteId = createRes.body.note._id;

    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it('should return 404 for non-existent note', async () => {
    const res = await request(app)
      .get('/api/notes/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(404);
  });
});