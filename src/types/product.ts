import type { Room, Style, Condition, Era } from '@/lib/categories';

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

export interface ProductDimensions {
  width?: number;
  depth?: number;
  height?: number;
  seatHeight?: number;
  diameter?: number;
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

  // Enhanced fields (extracted/normalized)
  normalizedCategory?: string;
  rooms?: Room[];
  style?: Style | null;
  condition?: Condition | null;
  era?: Era | null;
  materials?: string[];
  dimensions?: ProductDimensions | null;

  // Inventory flags
  isSold?: boolean;
  isOnSale?: boolean;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

// Filter-related types
export interface ProductFilters {
  categories: string[];
  rooms: Room[];
  styles: Style[];
  minPrice: number;
  maxPrice: number;
  conditions: Condition[];
}
