import { useCartContext } from '../context/CartContext';

const useCart = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartContext();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  };
};

export default useCart;
