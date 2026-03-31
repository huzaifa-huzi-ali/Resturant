import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { motion } from 'framer-motion';
import { useCartContext } from '../../context/CartContext';
import './Menu.css';

const Menu = () => {
  const { addToCart } = useCartContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // NEW: State for items coming from the Database
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: Fetch data from Backend (Supabase)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/menu`);
        const data = await response.json();
        
        // Map Database names to your UI names if they differ
        const mappedData = data.map(item => ({
          id: item.id,
          title: item.name,              // 'name' in DB -> 'title' in UI
          category: item.category_name || 'Special Cuisine', // Adjust based on your join
          description: item.description,
          price: parseFloat(item.price), // Ensure price is a number
          image: item.image_url          // 'image_url' in DB -> 'image' in UI
        }));

        setAllItems(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

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
  }, [searchQuery, selectedCategory, allItems]); // Added allItems to dependency

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  if (loading) {
    return (
      <div className="menu-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading Célia's Selection...</motion.p>
      </div>
    );
  }

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