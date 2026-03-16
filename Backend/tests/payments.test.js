const { app, request, registerUser, pool, cleanupTestData, closeDb } = require('./setup');

describe('Payments API', () => {
  let customerToken;
  let orderId;
  let paymentId;

  beforeAll(async () => {
    // Create customer and set up an order
    const customer = await registerUser();
    customerToken = customer.token;
    const customerId = customer.user.id;

    // Create a cart with items
    const cartRes = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
      [customerId]
    );
    const cartId = cartRes.rows[0].id;

    const menuItem = await pool.query('SELECT id, price FROM menu_items LIMIT 1');
    if (menuItem.rows.length > 0) {
      await pool.query(
        'INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES ($1, $2, 1)',
        [cartId, menuItem.rows[0].id]
      );

      // Create order
      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ customer_note: 'Payment test order' });

      orderId = orderRes.body.id;
    }
  });

  afterAll(async () => {
    if (paymentId) {
      await pool.query('DELETE FROM payments WHERE id = $1', [paymentId]);
    }
    if (orderId) {
      await pool.query('DELETE FROM order_items WHERE order_id = $1', [orderId]);
      await pool.query('DELETE FROM order_status_history WHERE order_id = $1', [orderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    }
    await cleanupTestData();
    await closeDb();
  });

  describe('POST /api/payments/initiate', () => {
    it('should initiate a payment', async () => {
      if (!orderId) return;

      const res = await request(app)
        .post('/api/payments/initiate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ order_id: orderId, payment_method: 'card' });

      expect(res.status).toBe(201);
      expect(res.body.payment).toHaveProperty('id');
      expect(res.body).toHaveProperty('client_secret');
      paymentId = res.body.payment.id;
    });

    it('should reject without order_id', async () => {
      const res = await request(app)
        .post('/api/payments/initiate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/payments/status/:id', () => {
    it('should return payment status', async () => {
      if (!paymentId) return;

      const res = await request(app)
        .get(`/api/payments/status/${paymentId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.payment_status).toBe('authorized');
    });
  });

  describe('POST /api/payments/confirm/:id', () => {
    it('should confirm a payment', async () => {
      if (!paymentId) return;

      const res = await request(app)
        .post(`/api/payments/confirm/${paymentId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.payment_status).toBe('paid');
    });
  });
});
