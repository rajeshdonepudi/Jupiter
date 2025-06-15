const FormatAsIndianCurrency = (value: string | number) => {
  const amount = parseFloat(value as string);
  if (isNaN(amount)) return value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const CurrencyUtilities = {
  formatIndianCurrency: FormatAsIndianCurrency,
};

export default CurrencyUtilities;
