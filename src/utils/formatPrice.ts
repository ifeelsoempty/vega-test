type Options = {
  withSign: boolean;
}

export const formatPrice = (price: number, options?: Options) => {
  const result = Intl.NumberFormat('en-US', { style: "currency", currency: 'USD' }).format(price);

  if(options?.withSign) {
    if(price > 0){
      return `+${result}`
    } 
  }

  return result
}