export const getLowestPrice = (ticketTypes: { price: number }[] = []) => {
  if (!ticketTypes.length) return null;
  const lowestPrice = Math.min(...ticketTypes.map(t => t.price));
  if (lowestPrice <= 0 ) {
    return 'Free'
  }
  return `£${lowestPrice}`;
};
