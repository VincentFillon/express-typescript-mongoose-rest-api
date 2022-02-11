import request from 'supertest';

import { env } from '../../../src/env';
import { bootstrapApp, BootstrapSettings } from '../utils/bootstrap';
import { prepareServer, shutdownServer } from '../utils/server'

describe('/api', () => {

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    let settings: BootstrapSettings;
    beforeAll(async () => {
      settings = await prepareServer();
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

    test('GET: / should return the api-version', async () => {
        const response = await request(settings.app)
            .get('/api')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.version).toBe(env.app.version);
    });

});
