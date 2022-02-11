import request from 'supertest';

import { User } from '../../../src/api/models/User';
import { env } from '../../../src/env';
import { BootstrapSettings } from '../utils/bootstrap';
import { prepareServer, shutdownServer } from '../utils/server';

describe('/api/users', () => {
  let johnDoe = new User({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    username: 'jDoe',
    password: '0n&Two3f0uR',
  });
  let authorization: string;
  let settings: BootstrapSettings;

  // -------------------------------------------------------------------------
  // Setup up
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    settings = await prepareServer();
    authorization = Buffer.from(`${env.superadmin.login}:${env.superadmin.password}`).toString('base64');
  });

  // -------------------------------------------------------------------------
  // Tear down
  // -------------------------------------------------------------------------

  afterAll(async () => {
    await shutdownServer();
    // await closeDatabase(); // est appelé lors du shutdown du serveur
  });

  // -------------------------------------------------------------------------
  // Test cases
  // -------------------------------------------------------------------------

  test('POST: / should create a user', async () => {
    const response = await request(settings.app)
      .post('/api/users')
      .set('Authorization', `Basic ${authorization}`)
      .send(johnDoe)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body._id).toBeDefined();
    expect(response.body.firstName).toBe(johnDoe.firstName);
    expect(response.body.email).toBe(johnDoe.email);
    expect(response.body.username).toBe(johnDoe.username);

    johnDoe = new User(response.body);
  });

  test('GET: / should return a list of users', async () => {
    const response = await request(settings.app).get('/api/users').set('Authorization', `Basic ${authorization}`).expect('Content-Type', /json/).expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual(johnDoe);
  });

  test('GET: /:id should return john doe', async () => {
    const response = await request(settings.app)
      .get(`/api/users/${johnDoe._id}`)
      .set('Authorization', `Basic ${authorization}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body._id).toBe(johnDoe._id);
    expect(response.body.firstName).toBe(johnDoe.firstName);
    expect(response.body.email).toBe(johnDoe.email);
    expect(response.body.username).toBe(johnDoe.username);
  });

  test('PUT: /:id should update john doe', async () => {
    const response = await request(settings.app)
      .put(`/api/users/${johnDoe._id}`)
      .set('Authorization', `Basic ${authorization}`)
      .send({ _id: johnDoe._id, username: 'updatedJohnDoe' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body._id).toBe(johnDoe._id);
    expect(response.body.firstName).toBe(johnDoe.firstName);
    expect(response.body.email).toBe(johnDoe.email);
    expect(response.body.username).toBe('updatedJohnDoe');
  });

  test('DELETE: /:id should delete john doe', async () => {
    const response = await request(settings.app)
      .delete(`/api/users/${johnDoe._id}`)
      .set('Authorization', `Basic ${authorization}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body._id).toBe(johnDoe._id);
    expect(response.body.firstName).toBe(johnDoe.firstName);
    expect(response.body.email).toBe(johnDoe.email);
    expect(response.body.username).toBe('updatedJohnDoe');
  });

  test('GET: /:id should return 404', async () => {
    const response = await request(settings.app)
      .get(`/api/users/${johnDoe._id}`)
      .set('Authorization', `Basic ${authorization}`)
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body.name).toBe('EntityNotFoundError');
  });
});
