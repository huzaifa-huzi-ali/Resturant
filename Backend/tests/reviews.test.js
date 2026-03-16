const { app, request, registerUser, pool, cleanupTestData, closeDb } = require('./setup');

describe('Reviews API', () => {
  let customerToken;
  let menuItemId;
  let reviewId;

  beforeAll(async () => {
    const customer = await registerUser();
    customerToken = customer.token;

    // Get a menu item
    const { rows } = await pool.query('SELECT id FROM menu_items LIMIT 1');
    if (rows.length > 0) {
      menuItemId = rows[0].id;
    }
  });

  afterAll(async () => {
    if (reviewId) {
      await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    }
    await cleanupTestData();
    await closeDb();
  });

  describe('POST /api/reviews', () => {
    it('should create a review', async () => {
      if (!menuItemId) return;

      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          menu_item_id: menuItemId,
          rating: 5,
          comment: 'Excellent dish!',
        });

      expect(res.status).toBe(201);
      expect(res.body.rating).toBe(5);
      reviewId = res.body.id;
    });

    it('should reject duplicate review', async () => {
      if (!menuItemId) return;

      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ menu_item_id: menuItemId, rating: 3 });

      expect(res.status).toBe(409);
    });

    it('should reject invalid rating', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ menu_item_id: menuItemId, rating: 10 });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/reviews/menu/:menuItemId', () => {
    it('should return reviews for a menu item (public)', async () => {
      if (!menuItemId) return;

      const res = await request(app).get(`/api/reviews/menu/${menuItemId}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    it('should delete own review', async () => {
      if (!reviewId) return;

      const res = await request(app)
        .delete(`/api/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      reviewId = null;
    });
  });
});
