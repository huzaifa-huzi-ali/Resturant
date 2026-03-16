module.exports = {
  menuAll: () => "menu:all",
  menuByCategory: (categoryId) => `menu:category:${categoryId}`,
  menuItem: (id) => `menu:item:${id}`,
  
  categories: () => "categories:all",
  categoryItem: (id) => `categories:item:${id}`,
  
  userProfile: (userId) => `user:profile:${userId}`,
  
  reviewsByItem: (menuId) => `reviews:item:${menuId}`,
  
  cart: (userId) => `cart:user:${userId}`,
};
