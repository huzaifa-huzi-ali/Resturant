const { app, request, registerUser, pool, cleanupTestData, closeDb } = require('./setup');

describe('Cart API', () => {
  let customerToken;
  let menuItemId;
  let cartItemId;

  beforeAll(async () => {
    const customer = await registerUser();
    customerToken = customer.token;

    // Get a menu item to add to cart
    const { rows } = await pool.query('SELECT id FROM menu_items WHERE is_available = TRUE LIMIT 1');
    if (rows.length > 0) {
      menuItemId = rows[0].id;
    }
  });

  afterAll(async () => {
    await cleanupTestData();
    await closeDb();
  });

  describe('GET /api/cart', () => {
    it('should return empty cart for new user', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('cart_id');
      expect(res.body.items).toHaveLength(0);
    });

    it('should reject unauthenticated access', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/cart/items', () => {
    it('should add item to cart', async () => {
      if (!menuItemId) return;

      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ menu_item_id: menuItemId, quantity: 2 });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      cartItemId = res.body.id;
    });

    it('should merge duplicate items (increase quantity)', async () => {
      if (!menuItemId) return;

      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ menu_item_id: menuItemId, quantity: 1 });

      expect(res.status).toBe(201);
      expect(res.body.quantity).toBe(3); // 2 + 1
    });

    it('should reject invalid quantity', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ menu_item_id: menuItemId, quantity: 0 });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/cart/items/:id', () => {
    it('should update cart item quantity', async () => {
      if (!cartItemId) return;

      const res = await request(app)
        .put(`/api/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(5);
    });
  });

  describe('DELETE /api/cart/items/:id', () => {
    it('should remove item from cart', async () => {
      if (!cartItemId) return;

      const res = await request(app)
        .delete(`/api/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
    });
  });
});
