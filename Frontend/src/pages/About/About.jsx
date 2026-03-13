import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="about-header-section">
        <motion.h1
          className="about-hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          A Legacy of Culinary Excellence
        </motion.h1>
        <motion.div
          className="about-hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        >
          Established 1994 | New York City
        </motion.div>
      </section>

      {/* About Hero Section */}
      <section className="about-hero">
        <motion.div
          className="hero-image-container"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"
            alt="Célia Restaurant Interior"
            className="hero-image"
          />
        </motion.div>

        <motion.div
          className="hero-text-container history-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={itemVariants} className="section-title">
            Our Story
          </motion.h2>
          <motion.p variants={itemVariants} className="section-text">
            Célia was born from a singular vision: to transform the act of dining into a celestial event. Founded in 1994 as a private kitchen for the city's elite, we have spent three decades perfecting the balance between classic European techniques and modern molecular gastronomy. Our history is written in the flavors of the seasons and the loyalty of our guests.
          </motion.p>
        </motion.div>
      </section>

      {/* History & Mission Section */}
      <section className="history-section">
        <motion.div
          className="history-row history-row-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className="history-content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2 variants={itemVariants} className="section-title">
              The Tradition
            </motion.h2>
            <motion.p variants={itemVariants} className="section-text">
              At the heart of Célia lies a profound respect for the culinary foundations that defined the golden age of gastronomy. For over three decades, we have honored the slow-simmered stocks, the hand-kneaded doughs, and the artisanal techniques passed down through generations of master chefs. To us, tradition isn't about looking backward; it is about preserving the soul of the ingredient. We believe that before one can innovate, one must master the timeless language of the kitchen. Every dish served today is a dialogue between our heritage and the modern world.
            </motion.p>
            <motion.p variants={itemVariants} className="section-text secondary">
              Our commitment to tradition is not nostalgia, but a living practice that honors every ingredient and technique.
            </motion.p>
          </motion.div>

          <motion.div
            className="history-image"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
              alt="Célia Heritage"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="history-row history-row-right"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className="history-image"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <img
              src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80"
              alt="Célia Philosophy"
            />
          </motion.div>

          <motion.div
            className="history-content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2 variants={itemVariants} className="section-title">
              Our Mission
            </motion.h2>
            <motion.p variants={itemVariants} className="section-text">
              To bridge the gap between tradition and innovation, delivering a sensory journey that lingers long after the final course.
            </motion.p>
            <motion.p variants={itemVariants} className="section-text secondary">
              We believe that great dining transcends food—it's a narrative of passion, precision, and purpose woven together in every bite.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Chef's Corner Section */}
      <section className="chef-section">
        <motion.div
          className="chef-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            className="section-title chef-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            Chef de Cuisine
          </motion.h2>

          <motion.div
            className="chef-content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div
              className="chef-image-wrapper"
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=800&q=80"
                alt="Chef Julian Vance"
                className="chef-image"
              />
            </motion.div>

            <motion.div className="chef-info" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
              <motion.h3 variants={itemVariants} className="chef-name">
                Julian Vance
              </motion.h3>
              <motion.div variants={itemVariants} className="chef-title-subtitle">
                Executive Chef
              </motion.div>
              <motion.p variants={itemVariants} className="chef-bio">
                With three Michelin stars and a passion for molecular gastronomy, Chef Vance leads our kitchen with a philosophy of <em>"Nature Refined"</em>.
              </motion.p>
              <motion.p variants={itemVariants} className="chef-bio">
                Drawing inspiration from global cuisines and classical French techniques, Chef Vance crafts dishes that challenge perceptions and elevate the dining experience to an art form.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
