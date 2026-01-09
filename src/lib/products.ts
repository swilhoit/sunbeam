import { Product } from '@/types/product';
import { Room, Style, Condition, rooms, styles, conditions } from './categories';
import productsData from '../../scraped-data/products.json';

const products: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find(p => p.handle === handle);
}

export function getProductsByCategory(category: string): Product[] {
  const lowerCategory = category.toLowerCase();
  return products.filter(p =>
    p.productType.toLowerCase() === lowerCategory ||
    p.normalizedCategory?.toLowerCase() === lowerCategory ||
    p.tags.some(t => t.toLowerCase() === lowerCategory)
  );
}

export function getProductsByVendor(vendor: string): Product[] {
  return products.filter(p => p.vendor.toLowerCase() === vendor.toLowerCase());
}

export function getProductsByRoom(room: Room): Product[] {
  return products.filter(p => p.rooms?.includes(room));
}

export function getProductsByStyle(style: Style): Product[] {
  return products.filter(p => p.style === style);
}

export function getProductsByCondition(condition: Condition): Product[] {
  return products.filter(p => p.condition === condition);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    p.materials?.some(m => m.toLowerCase().includes(lowerQuery)) ||
    p.normalizedCategory?.toLowerCase().includes(lowerQuery)
  );
}

export function getUniqueCategories(): string[] {
  const categories = new Set<string>();
  products.forEach(p => {
    // Prefer normalized category
    if (p.normalizedCategory) {
      categories.add(p.normalizedCategory);
    } else if (p.productType) {
      categories.add(p.productType);
    }
  });
  return Array.from(categories).filter(Boolean).sort();
}

export function getUniqueVendors(): string[] {
  const vendors = new Set<string>();
  products.forEach(p => {
    if (p.vendor) vendors.add(p.vendor);
  });
  return Array.from(vendors).sort();
}

export function getUniqueRooms(): Room[] {
  const roomSet = new Set<Room>();
  products.forEach(p => {
    p.rooms?.forEach(room => roomSet.add(room));
  });
  // Return in predefined order
  return rooms.filter(r => roomSet.has(r));
}

export function getUniqueStyles(): Style[] {
  const styleSet = new Set<Style>();
  products.forEach(p => {
    if (p.style) styleSet.add(p.style);
  });
  // Return in predefined order
  return styles.filter(s => styleSet.has(s));
}

export function getUniqueConditions(): Condition[] {
  const conditionSet = new Set<Condition>();
  products.forEach(p => {
    if (p.condition) conditionSet.add(p.condition);
  });
  // Return in predefined order
  return conditions.filter(c => conditionSet.has(c));
}

export function getUniqueMaterials(): string[] {
  const materials = new Set<string>();
  products.forEach(p => {
    p.materials?.forEach(m => materials.add(m));
  });
  return Array.from(materials).sort();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDimensions(product: Product): string | null {
  const dims = product.dimensions;
  if (!dims) return null;

  const parts: string[] = [];

  if (dims.width) parts.push(`${dims.width}"W`);
  if (dims.depth) parts.push(`${dims.depth}"D`);
  if (dims.height) parts.push(`${dims.height}"H`);
  if (dims.seatHeight) parts.push(`SH: ${dims.seatHeight}"`);
  if (dims.diameter) parts.push(`${dims.diameter}" Dia`);

  return parts.length > 0 ? parts.join(' x ') : null;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p =>
      p.id !== product.id &&
      (p.normalizedCategory === product.normalizedCategory ||
       p.productType === product.productType ||
       p.tags.some(t => product.tags.includes(t)) ||
       p.style === product.style)
    )
    .slice(0, limit);
}

// Advanced filtering function
export interface FilterOptions {
  categories?: string[];
  rooms?: Room[];
  styles?: Style[];
  conditions?: Condition[];
  materials?: string[];
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  searchQuery?: string;
}

export function filterProducts(options: FilterOptions): Product[] {
  let result = [...products];

  // Category filter (OR logic - matches any)
  if (options.categories && options.categories.length > 0) {
    const lowerCategories = options.categories.map(c => c.toLowerCase());
    result = result.filter(p =>
      lowerCategories.includes(p.normalizedCategory?.toLowerCase() || '') ||
      lowerCategories.includes(p.productType.toLowerCase())
    );
  }

  // Room filter (OR logic)
  if (options.rooms && options.rooms.length > 0) {
    result = result.filter(p =>
      p.rooms?.some(r => options.rooms!.includes(r))
    );
  }

  // Style filter (OR logic)
  if (options.styles && options.styles.length > 0) {
    result = result.filter(p =>
      p.style && options.styles!.includes(p.style)
    );
  }

  // Condition filter (OR logic)
  if (options.conditions && options.conditions.length > 0) {
    result = result.filter(p =>
      p.condition && options.conditions!.includes(p.condition)
    );
  }

  // Materials filter (OR logic)
  if (options.materials && options.materials.length > 0) {
    const lowerMaterials = options.materials.map(m => m.toLowerCase());
    result = result.filter(p =>
      p.materials?.some(m => lowerMaterials.includes(m.toLowerCase()))
    );
  }

  // Price range
  if (options.minPrice !== undefined) {
    result = result.filter(p => p.price >= options.minPrice!);
  }
  if (options.maxPrice !== undefined) {
    result = result.filter(p => p.price <= options.maxPrice!);
  }

  // On sale
  if (options.onSale) {
    result = result.filter(p => p.isOnSale);
  }

  // Search query
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  return result;
}

// Get price range across all products
export function getPriceRange(): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 10000 };
  }
  const prices = products.map(p => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

// Get product counts by category
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  products.forEach(p => {
    const category = p.normalizedCategory || p.productType;
    if (category) {
      counts[category] = (counts[category] || 0) + 1;
    }
  });
  return counts;
}

// Get product counts by room
export function getRoomCounts(): Record<Room, number> {
  const counts: Partial<Record<Room, number>> = {};
  products.forEach(p => {
    p.rooms?.forEach(room => {
      counts[room] = (counts[room] || 0) + 1;
    });
  });
  return counts as Record<Room, number>;
}

// Get product counts by style
export function getStyleCounts(): Record<Style, number> {
  const counts: Partial<Record<Style, number>> = {};
  products.forEach(p => {
    if (p.style) {
      counts[p.style] = (counts[p.style] || 0) + 1;
    }
  });
  return counts as Record<Style, number>;
}
