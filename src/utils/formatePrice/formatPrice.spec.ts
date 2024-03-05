import { formatPrice } from "./formatPrice";

describe('formatPrice', () => {
  it('formats a positive number without a sign', () => {
    const price = 100;
    const formattedPrice = formatPrice(price);
    expect(formattedPrice).toBe('$100.00');
  });

  it('formats a negative number with a minus sign', () => {
    const price = -50;
    const formattedPrice = formatPrice(price);
    expect(formattedPrice).toBe('-$50.00');
  });

  it('adds a "+" sign to a positive number if the `withSign` option is set', () => {
    const price = 75;
    const formattedPrice = formatPrice(price, { withSign: true });
    expect(formattedPrice).toBe('+$75.00');
  });

  it('does not add a "+" sign to a negative number, even if the `withSign` option is set', () => {
    const price = -30;
    const formattedPrice = formatPrice(price, { withSign: true });
    expect(formattedPrice).toBe('-$30.00');
  });
});