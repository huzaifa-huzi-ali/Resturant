import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // 1. Video sources
  const videoSources = [
    '/hero-video-1.mp4',
    '/hero-video-2.mp4'
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // 5 Dummy Reviews Data
  const reviews = [
    { id: 1, name: "Alexander V.", rating: 5, text: "The Truffle Arancini is life-changing. An absolute masterclass in flavor." },
    { id: 2, name: "Sophia L.", rating: 5, text: "Célia isn't just a restaurant; it's a sensory journey. The atmosphere is divine." },
    { id: 3, name: "Marcus T.", rating: 4, text: "Incredible Wagyu. The smoky salt finish is something I'll dream about." },
    { id: 4, name: "Elena R.", rating: 5, text: "Finally, a place that treats dessert like high art. The Chocolate Dome is stunning." },
    { id: 5, name: "Julian M.", rating: 5, text: "Best dining experience in the city. The attention to detail is unmatched." }
  ];

  const [reviewIndex, setReviewIndex] = useState(0);

  // Auto-advance reviews every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Framer Motion animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  // Featured Menu Data
  const menuCards = [
    {
      id: 1,
      title: 'Truffle Arancini',
      price: 18,
      image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80',
      description: 'Wild mushroom risotto, black truffle aioli, shaved parmigiano-reggiano.',
    },
    {
      id: 2,
      title: 'Charred Wagyu Ribeye',
      price: 65,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      description: '14oz bone-in ribeye, smoked sea salt, roasted rainbow carrots, garlic-herb butter.',
    },
    {
      id: 3,
      title: 'Dark Chocolate Dome',
      price: 16,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
      description: 'Espresso mousse, molten berry center, 24k gold leaf accents.',
    },
  ];

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <section className="hero-section">
        
        {/* The dark overlay Div is layered ON TOP of the videos */}
        <div className="hero-darkness-overlay"></div>
        
        {/* Crossfading Video Layers */}
        <div className="video-container">
          <AnimatePresence>
            <motion.video
              // Changing the key forces Framer Motion to animate the transition between videos
              key={currentVideoIndex} 
              src={videoSources[currentVideoIndex]}
              autoPlay
              muted
              playsInline
              className="hero-video"
              // THE FIX: Use React's native onEnded prop to trigger the next video
              onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % videoSources.length)}
              
              // Framer Motion Crossfade Animations
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>
        
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeUp} className="hero-title">Célia</motion.h1>
          <motion.p variants={fadeUp} className="hero-subtitle">Where Culinary Art Meets Atmosphere.</motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/menu" className="primary-btn">Order Now</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Menu Section */}
      <section className="featured-menu">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <h2>A Taste of Heaven</h2>
          <p>Discover our signature dishes crafted with precision and passion</p>
        </motion.div>

        <div className="menu-grid">
          {menuCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="menu-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div className="card-image-wrapper">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <div className="card-footer">
                  <span className="card-price">${card.price}</span>
                  <button className="card-btn">Order Now</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="section-header">
          <h2>Guest Experiences</h2>
        </div>
        <div className="review-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={reviews[reviewIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="review-card-exclusive"
            >
              <div className="stars">
                {[...Array(reviews[reviewIndex].rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p className="review-text">"{reviews[reviewIndex].text}"</p>
              <h4 className="reviewer-name">— {reviews[reviewIndex].name}</h4>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="cta-content"
        >
          <h2>Ready for a Taste of Heaven?</h2>
          <p>Skip the wait and experience excellence delivered to your door.</p>
          <Link to="/menu" className="primary-btn">Order Now</Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;