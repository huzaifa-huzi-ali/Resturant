const { app, request, registerUser, cleanupTestData, closeDb } = require('./setup');

describe('Auth API', () => {
  afterAll(async () => {
    await cleanupTestData();
    await closeDb();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test_auth_${Date.now()}@example.com`,
          password: 'TestPassword123',
          phone: '+1-555-111-2222',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.name).toBe('Test User');
      expect(res.body.user.role).toBe('customer');
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject duplicate email', async () => {
      const email = `test_dup_${Date.now()}@example.com`;

      await request(app).post('/api/auth/register').send({
        name: 'First', email, password: 'pass1234',
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Second', email, password: 'pass1234',
      });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `test_login_${Date.now()}@example.com`;
      const password = 'SecurePass123';

      await request(app).post('/api/auth/register').send({
        name: 'Login Test', email, password,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(email);
      expect(res.body.user).not.toHaveProperty('password_hash');
    });

    it('should reject invalid password', async () => {
      const email = `test_badpw_${Date.now()}@example.com`;

      await request(app).post('/api/auth/register').send({
        name: 'Bad PW', email, password: 'correct123',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'wrong123' });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'test1234' });

      expect(res.status).toBe(401);
    });
  });
});
