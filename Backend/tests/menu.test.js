const { app, request, registerUser, pool, cleanupTestData, closeDb } = require('./setup');

describe('Menu API', () => {
  let adminToken;
  let customerToken;
  let createdItemId;

  beforeAll(async () => {
    // Create an admin user directly in DB
    const { hashPassword } = require('../src/modules/shared/utils/hashpassword');
    const hash = await hashPassword('admin123');
    const adminEmail = `test_admin_menu_${Date.now()}@example.com`;

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      ['Menu Admin', adminEmail, hash]
    );

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: 'admin123' });
    adminToken = loginRes.body.token;

    // Create a customer
    const customer = await registerUser();
    customerToken = customer.token;
  });

  afterAll(async () => {
    if (createdItemId) {
      await pool.query('DELETE FROM menu_items WHERE id = $1', [createdItemId]);
    }
    await cleanupTestData();
    await closeDb();
  });

  describe('GET /api/menu', () => {
    it('should return menu items (public)', async () => {
      const res = await request(app).get('/api/menu');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should support search query', async () => {
      const res = await request(app).get('/api/menu?search=pizza');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/menu (admin)', () => {
    it('should create a menu item as admin', async () => {
      const res = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Dish',
          description: 'A test dish',
          price: 15.99,
          category_id: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test Dish');
      createdItemId = res.body.id;
    });

    it('should reject creation by customer', async () => {
      const res = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Hack Dish', price: 1 });

      expect(res.status).toBe(403);
    });

    it('should reject unauthenticated creation', async () => {
      const res = await request(app)
        .post('/api/menu')
        .send({ name: 'No Auth Dish', price: 1 });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item', async () => {
      if (!createdItemId) return;

      const res = await request(app).get(`/api/menu/${createdItemId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdItemId);
    });

    it('should return 404 for non-existent item', async () => {
      const res = await request(app).get('/api/menu/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/menu/:id (admin)', () => {
    it('should update a menu item', async () => {
      if (!createdItemId) return;

      const res = await request(app)
        .put(`/api/menu/${createdItemId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 19.99 });

      expect(res.status).toBe(200);
      expect(parseFloat(res.body.price)).toBe(19.99);
    });
  });

  describe('DELETE /api/menu/:id (admin)', () => {
    it('should delete a menu item', async () => {
      if (!createdItemId) return;

      const res = await request(app)
        .delete(`/api/menu/${createdItemId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      createdItemId = null;
    });
  });
});
