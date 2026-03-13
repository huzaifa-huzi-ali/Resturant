# Restaurant Frontend

A modern React-based frontend for a restaurant ordering system.

## Features

- User-friendly menu browsing and ordering
- Shopping cart management
- Secure checkout process
- Payment integration
- Admin dashboard for restaurant management
- Order tracking
- Contact form

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and styles
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── context/        # React Context for state management
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service integrations
│   ├── utils/          # Utility functions
│   ├── routes/         # Route definitions
│   ├── layout/         # Layout components
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Entry point
│   └── config.js       # Configuration
├── .env                # Environment variables
├── package.json        # Dependencies
└── README.md           # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API endpoint and other configurations.

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will open at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Component Organization

### Common Components
- Navbar, Footer, Button, Loader, Modal

### Feature Components
- Menu Cards and Categories
- Shopping Cart Management
- Checkout Forms
- Admin Dashboard

### Pages
- Home, About, Menu, Cart, Checkout, Contact
- Payment Success/Cancel
- Admin Login and Management Pages

## Context & State Management

- **CartContext** - Manages shopping cart state
- **AuthContext** - Manages user authentication state

## Custom Hooks

- `useCart` - Cart management hook
- `useAuth` - Authentication hook
- `useFetch` - Data fetching hook

## API Services

- **menuService** - Menu items management
- **orderService** - Order management
- **paymentService** - Payment processing
- **contactService** - Contact form submissions

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@restaurant.com or create an issue in the repository.
