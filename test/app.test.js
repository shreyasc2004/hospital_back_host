const request = require('supertest');
const app = require('../app'); // Adjust if your structure changes

describe('GET /', () => {
  it('should return 200 OK and a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Welcome'); // update as per your real response
  });
});
