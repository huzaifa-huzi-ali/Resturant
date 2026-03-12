export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const parsePrice = (priceString) => {
  return parseFloat(priceString.replace(/[^\d.-]/g, ''));
};
