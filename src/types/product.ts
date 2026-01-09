export interface ProductImage {
  original: string;
  local: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: number;
  title: string;
  price: number;
  sku: string;
  available: boolean;
  options: Record<string, string>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}
