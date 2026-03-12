import { useCartContext } from '../context/CartContext';

const useCart = () => {
  const { cart, setCart } = useCartContext();

  const addToCart = (item) => {
    // Add item to cart logic
  };

  const removeFromCart = (itemId) => {
    // Remove item from cart logic
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };
};

export default useCart;
