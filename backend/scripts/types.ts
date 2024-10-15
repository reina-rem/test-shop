interface RootObject {
  categories: Category[];
  products: Product[];
}

interface Product {
  productId: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  attributes: Attribute[];
  prices: Price[];
  brand: string;
}

interface Price {
  amount: number;
  currency: Currency;
}

interface Currency {
  label: string;
  symbol: string;
}

interface Attribute {
  name: string;
  type: string;
  options: Option[];
}

interface Option {
  optionId: string;
  value: string;
}

interface Category {
  name: string;
}