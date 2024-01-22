const supertest = require('supertest');
const app = require('../app.js');

const request = supertest(app);

describe('[GET] /api/ping', () => {
  it('Valid server ping.', async () => {
    return request.get('/api/ping?hostname=play.pokebedrock.com').expect(200);
  });

  it('Invalid server ping.', async () => {
    return request.get('/api/ping?hostname=example').expect(400);
  });
});
