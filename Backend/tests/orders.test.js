const { app, request, registerUser, pool, cleanupTestData, closeDb } = require('./setup');

describe('Orders API', () => {
  let customerToken;
  let customerId;
  let adminToken;
  let orderId;

  beforeAll(async () => {
    // Create customer
    const customer = await registerUser();
    customerToken = customer.token;
    customerId = customer.user.id;

    // Create admin
    const { hashPassword } = require('../src/modules/shared/utils/hashpassword');
    const hash = await hashPassword('admin123');
    const adminEmail = `test_admin_order_${Date.now()}@example.com`;

    const adminRes = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin') RETURNING id`,
      ['Order Admin', adminEmail, hash]
    );

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: 'admin123' });
    adminToken = loginRes.body.token;

    // Add item to cart so we can create an order
    // First ensure a cart exists
    await pool.query('INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [customerId]);
    const cart = await pool.query('SELECT id FROM carts WHERE user_id = $1', [customerId]);

    // Get a menu item
    const menuItem = await pool.query('SELECT id FROM menu_items LIMIT 1');
    if (menuItem.rows.length > 0) {
      await pool.query(
        'INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES ($1, $2, 2)',
        [cart.rows[0].id, menuItem.rows[0].id]
      );
    }
  });

  afterAll(async () => {
    if (orderId) {
      await pool.query('DELETE FROM order_items WHERE order_id = $1', [orderId]);
      await pool.query('DELETE FROM order_status_history WHERE order_id = $1', [orderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    }
    await cleanupTestData();
    await closeDb();
  });

  describe('POST /api/orders', () => {
    it('should create an order from cart', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ customer_note: 'Test order' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.order_status).toBe('pending');
      orderId = res.body.id;
    });

    it('should reject unauthenticated order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/orders', () => {
    it('should return user orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order details', async () => {
      if (!orderId) return;

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(orderId);
      expect(res.body).toHaveProperty('items');
    });
  });

  describe('GET /api/orders/all (admin)', () => {
    it('should return all orders for admin', async () => {
      const res = await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should reject customer access', async () => {
      const res = await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/orders/:id/status (admin)', () => {
    it('should update order status', async () => {
      if (!orderId) return;

      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' });

      expect(res.status).toBe(200);
      expect(res.body.order_status).toBe('confirmed');
    });

    it('should reject invalid status', async () => {
      if (!orderId) return;

      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid_status' });

      expect(res.status).toBe(400);
    });
  });
});
