import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCartContext } from '../../context/CartContext';
import './Menu.css';

const Menu = () => {
  const { addToCart } = useCartContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // All Menu Items
  const allItems = [
    {
      id: 1,
      title: 'Saffron Infused Scallops',
      category: 'Special Cuisine',
      description: 'Pan-seared Hokkaido scallops, saffron foam, asparagus spears, and herb-infused oil.',
      price: 38,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Charred Wagyu Ribeye',
      category: 'Special Cuisine',
      description: '14oz A5 Wagyu, smoked sea salt, roasted rainbow carrots, and garlic-herb marrow butter.',
      price: 85,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Black Garlic Pasta',
      category: 'Special Cuisine',
      description: 'Handmade squid ink linguine, fermented black garlic, chili flakes, and toasted pine nuts.',
      price: 28,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: 'Truffle Arancini',
      category: 'Special Cuisine',
      description: 'Wild mushroom risotto spheres, black truffle aioli, and 24-month aged Parmigiano.',
      price: 22,
      image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      title: 'Midnight Orchid Martini',
      category: 'Drinks',
      description: 'Premium violet gin, elderflower liqueur, lemon zest, and an edible orchid garnish.',
      price: 18,
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      title: 'Gold Leaf Espresso Martini',
      category: 'Drinks',
      description: 'Single-origin espresso, premium vodka, coffee liqueur, topped with 24k gold flakes.',
      price: 22,
      image: 'https://www.goldchef.shop/wp-content/uploads/2023/06/fascia_espresso-martini_gold_leaf_F82_2784_web.jpg',
    },
    {
      id: 7,
      title: 'Dark Chocolate Dome',
      category: 'Sweets',
      description: '70% Valrhona chocolate, molten raspberry center, espresso soil, and gold leaf.',
      price: 18,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 8,
      title: 'Pistachio Baklava Cheesecake',
      category: 'Sweets',
      description: 'Creamy honey cheesecake layered with crispy filo pastry and crushed roasted pistachios.',
      price: 16,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 9,
      title: 'Lavender Crème Brûlée',
      category: 'Sweets',
      description: 'Classic vanilla bean custard infused with organic lavender, topped with a glass-like sugar crust.',
      price: 15,
      image: 'https://entertainingwithbeth.com/wp-content/uploads/2018/03/LavenderCremeBruleeRecipe-1024x683.jpg',
    },
  ];

  const categories = ['All', 'Special Cuisine', 'Drinks', 'Sweets'];

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="menu-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="menu-header"
      >
        <h1>The Célia Collection</h1>
        <p>Curated dishes crafted with precision and passion</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="search-container"
      >
        <div className="search-wrapper">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="category-filters"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="menu-item-card"
          >
            {/* Image */}
            <div className="item-image-wrapper">
              <img src={item.image} alt={item.title} className="item-image" />
              <div className="image-overlay" />
            </div>

            {/* Content */}
            <div className="item-content">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-category">{item.category}</p>
              <p className="item-description">{item.description}</p>

              {/* Footer - Price and Button */}
              <div className="item-footer">
                <span className="item-price">${item.price}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="add-to-order-btn"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty-state"
        >
          <h3>No items found</h3>
          <p>Try adjusting your search or filter</p>
        </motion.div>
      )}
    </div>
  );
};

export default Menu;
