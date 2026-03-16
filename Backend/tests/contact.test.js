const { app, request, pool, cleanupTestData, closeDb } = require('./setup');

describe('Contact API', () => {
  let adminToken;
  let messageId;

  beforeAll(async () => {
    // Create admin
    const { hashPassword } = require('../src/modules/shared/utils/hashpassword');
    const hash = await hashPassword('admin123');
    const adminEmail = `test_admin_contact_${Date.now()}@example.com`;

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      ['Contact Admin', adminEmail, hash]
    );

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: 'admin123' });
    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    if (messageId) {
      await pool.query('DELETE FROM contact_messages WHERE id = $1', [messageId]);
    }
    await cleanupTestData();
    await closeDb();
  });

  describe('POST /api/contact', () => {
    it('should submit a contact message (public)', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test Person',
          email: `test_contact_${Date.now()}@example.com`,
          message: 'Hello, this is a test message.',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      messageId = res.body.id;
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'Test' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/contact (admin)', () => {
    it('should return all messages for admin', async () => {
      const res = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should reject unauthenticated access', async () => {
      const res = await request(app).get('/api/contact');
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/contact/:id (admin)', () => {
    it('should delete a contact message', async () => {
      if (!messageId) return;

      const res = await request(app)
        .delete(`/api/contact/${messageId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      messageId = null;
    });
  });
});
