import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChatBot } from '../../hooks/useChatBot';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  const { messages, sendMessage, isLoading } = useChatBot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="chat-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="chat-header">
              <h3>Célia Concierge</h3>
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`chat-message ${msg.role === 'user' ? 'user-message' : 'model-message'}`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="chat-message model-message typing-indicator">
                  <p>Concierge is typing...</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send Message"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={`chat-trigger-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open Digital Concierge"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

export default ChatWidget;
