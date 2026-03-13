import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out. We will be in touch soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="contact-page">
      {/* Contact Hero */}
      <motion.section
        className="contact-hero"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="contact-title" style={{ color: 'var(--accent-gold)' }}>Get In Touch</h1>
        <p className="contact-subtitle">We'd love to hear from you. Reach out and let's create culinary magic together.</p>
      </motion.section>

      {/* Main Contact Content */}
      <section className="contact-content">
        {/* Contact Form */}
        <motion.div
          className="contact-form-wrapper"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={itemVariants} className="form-title">
            Send us a Message
          </motion.h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <motion.div variants={itemVariants} className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="form-row">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="form-row full-width">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              className="submit-button primary-btn"
              whileHover={{ transform: 'translateY(-3px)', boxShadow: '0 15px 30px rgba(212, 175, 55, 0.3)' }}
              transition={{ duration: 0.3 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Info & Map */}
        <motion.div
          className="contact-info-wrapper"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Info Block */}
          <motion.div variants={itemVariants} className="info-block">
            <h3 className="info-title">Contact Information</h3>

            <div className="info-item">
              <span className="info-label">Address</span>
              <p className="info-text">742 Éclat Boulevard, Culinary District, NY 10012</p>
            </div>

            <div className="info-item">
              <span className="info-label">Phone</span>
              <p className="info-text">
                <a href="tel:+15558888235">+1 (555) 888-CELIA</a>
              </p>
            </div>

            <div className="info-item">
              <span className="info-label">Email</span>
              <p className="info-text">
                <a href="mailto:essence@celia-dining.com">essence@celia-dining.com</a>
              </p>
            </div>

            <div className="info-item">
              <span className="info-label">Hours</span>
              <p className="info-text">Tue—Sun: 5:00 PM — 11:00 PM</p>
              <p className="info-text">Mon: Closed</p>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div variants={itemVariants} className="map-container">
            <iframe
              title="Célia Restaurant Location"
              className="restaurant-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.123456789!2d-74.00!3d40.70!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a3f7e7f7f7f%3A0x7f7f7f7f7f7f7f7f!2s742%20%C3%89clat%20Boulevard%2C%20Culinary%20District%2C%20NY%2010012!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
