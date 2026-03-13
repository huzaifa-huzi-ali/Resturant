# Restaurant Frontend - Célia

A premium React-based frontend for a luxury restaurant ordering system with a dark theme, gold accents, and sophisticated animations.

## Features

✨ **Core Features:**
- Premium menu browsing with sophisticated animations
- Real-time shopping cart management with localStorage persistence
- Secure checkout with comprehensive form validation
- About & Contact pages with embedded Google Maps
- Responsive design (mobile-first: 480px, 768px, 1024px breakpoints)
- Premium animations using Framer Motion (scroll triggers, hover effects)
- Glassmorphism design patterns
- Dark theme with gold accent colors

🎨 **Design System:**
- Dark theme: `#0a0a0a` primary, `#f4f4f5` text
- Gold accents: `#d4af37` (primary), `#c5a059` (champagne)
- Serif fonts: Playfair Display, Cinzel (headings)
- Sans-serif: Inter, Lato (body text)
- Glassmorphism effects with backdrop blur (10-20px)

## Installation

### Prerequisites
- **Node.js** v16.0 or higher
- **npm** v8.0 or higher

### Quick Start

1. **Clone & Navigate:**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Application opens at `http://localhost:5173`

## Dependencies

### Core
- `react` 18.2.0 - UI library
- `react-dom` 18.2.0 - React DOM rendering
- `react-router-dom` 6.0.0 - Client-side routing with ScrollToTop component

### Animations & Effects
- `framer-motion` 4.x - Advanced animations (whileInView, whileHover, AnimatePresence)

### Build & Dev Tools
- `vite` 4.4.0 - Next-generation build tool
- `eslint` - Code linting
- `@vitejs/plugin-react` - Vite React plugin

## Project Structure

```
frontend/
├── public/                   # Static assets
│   ├── hero-video-1.mp4     # Hero section videos
│   ├── hero-video-2.mp4
│   └── favicon.svg
├── src/
│   ├── assets/              # Images and global styles
│   │   └── global.css       # CSS variables, theme colors
│   ├── components/
│   │   ├── navbar/          # Navigation bar
│   │   ├── footer/          # Footer
│   │   ├── common/          # Reusable components
│   │   └── cart/            # Cart sidebar
│   ├── pages/
│   │   ├── Home/            # Landing page with hero, featured menu, reviews
│   │   ├── About/           # Brand story, mission, team
│   │   ├── Menu/            # Full menu with categories, search, filter
│   │   ├── Contact/         # Contact form, info block, Google Maps
│   │   ├── Checkout/        # Checkout form, order summary, validation
│   │   ├── Cart/            # Cart display (in sidebar)
│   │   └── Admin/           # Admin dashboard (stub)
│   ├── context/
│   │   ├── CartContext.jsx  # Cart state, localStorage persistence
│   │   └── AuthContext.jsx  # Auth state management
│   ├── routes/
│   │   └── AppRoutes.jsx    # Route definitions
│   ├── layout/
│   │   └── ScrollToTop.jsx  # Auto-scroll on route change
│   ├── App.jsx              # Root component with providers
│   ├── main.jsx             # Vite entry point
│   └── config.js            # Configuration constants
├── .gitignore               # Git ignore rules (includes node_modules)
├── .env.example             # Environment template
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Available Scripts

```bash
# Development
npm run dev                 # Start dev server (http://localhost:5173)

# Production
npm run build              # Build for production
npm run preview            # Preview production build locally

# Code Quality
npm run lint               # Run ESLint
```

## Technologies Used

| Category | Technology | Version |
|----------|-----------|---------|
| **UI Framework** | React | 18.2.0 |
| **Routing** | React Router DOM | 6.0.0 |
| **Animations** | Framer Motion | 4.x |
| **Build Tool** | Vite | 4.4.0 |
| **State Management** | React Context API + localStorage | - |
| **Styling** | CSS3 + CSS Variables | - |

## Pages & Features

### Home (`/`)
- Hero section with crossfading background videos
- Featured menu showcase (3 signature dishes)
- Guest testimonials carousel (auto-rotate 5s)
- Call-to-action buttons

### About (`/about`)
- Brand narrative ("Our Story" section)
- Heritage & tradition information
- Mission statement
- Chef spotlight (Julian Vance, Michelin-starred)
- Staggered scroll animations

### Menu (`/menu`)
- Full menu with 9+ items across 3 categories (Special Cuisine, Drinks, Sweets)
- Search & filter functionality
- Add to cart with real-time updates
- Responsive grid layout

### Contact (`/contact`)
- Contact form (name, email, phone, message with validation)
- Business info block (address, phone, email, hours)
- Embedded Google Maps (dark theme styled)
- Form validation with error messages

### Checkout (`/checkout`)
- Multi-step form: Delivery Info + Special Instructions
- Real-time form validation
- Order summary with sticky positioning
- Per-item pricing display
- Cart total with taxes & fees calculation (10%)
- Safe numeric price parsing (handles string or number formats)

### Cart (Sidebar)
- Floating cart sidebar (right side)
- Item quantity management
- Real-time price updates
- Proceed to Checkout button
- Close animation

## State Management

### CartContext
```javascript
// Available functions:
- addToCart(item)              // Add item or increment quantity
- removeFromCart(itemId)       // Remove item completely
- updateQuantity(itemId, delta) // Adjust quantity by +/- delta
- getTotalItems()              // Get total quantity
- getTotalPrice()              // Get total price (with safe numeric parsing)
- clearCart()                  // Empty cart (called on successful order)

// Storage: localStorage key 'celiCart' for persistence
```

### AuthContext
- Placeholder for future authentication system

## Form Validation

### Checkout Form
- **Name:** 2+ characters required
- **Email:** Valid email format required (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Phone:** 10+ digits required
- **Address:** 10+ characters required
- **Instructions:** Optional

## Price Handling

**Data Type Standard:** All prices stored as **numbers** (e.g., `18`, not `'$18'`)

**Why:** Prevents `toFixed()` errors and calculation bugs

**Conversion:** 
```javascript
// Checkout payment parsing (handles both formats for safety):
const numericPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
```

**UI Display:** $ symbol added during rendering (e.g., `${price.toFixed(2)}`)

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

## Responsive Breakpoints

| Breakpoint | Use Case |
|-----------|----------|
| **1024px** | Tablet/Desktop transitions (grid → single column) |
| **768px** | Tablets (font sizing, spacing adjustments) |
| **480px** | Mobile phones (compact layouts, hidden elements) |

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Performance Optimizations

- Lazy scroll animations via `whileInView` (only animate when visible)
- Efficient cart updates with localStorage
- Optimized image loading with lazy attributes
- CSS variables for theme switching capability
- Vite HMR for fast dev feedback

## Troubleshooting

### Issue: `npm run dev` fails
**Solution:** Ensure Node.js 16+ and npm 8+
```bash
node --version
npm --version
```

### Issue: Port 5173 already in use
**Solution:** Kill the process or specify different port
```bash
npm run dev -- --port 3000
```

### Issue: Cart not persisting
**Solution:** Ensure localStorage is enabled in browser
```javascript
// Check localStorage:
console.log(localStorage.getItem('celiCart'));
```

### Issue: Price calculation shows NaN
**Solution:** All prices must be numbers. Convert strings in data:
```javascript
// ❌ BAD:  price: '$18'
// ✅ GOOD: price: 18
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] User authentication & profiles
- [ ] Order history & tracking
- [ ] Admin dashboard functionality
- [ ] Email notifications
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Analytics integration

## License

Licensed under the MIT License.

## Support

For issues or questions:
- Create an issue on GitHub
- Contact: support@celia-restaurant.com
