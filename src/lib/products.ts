import { Product } from '@/types/product';
import productsData from '../../scraped-data/products.json';

const products: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find(p => p.handle === handle);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p =>
    p.productType.toLowerCase() === category.toLowerCase() ||
    p.tags.some(t => t.toLowerCase() === category.toLowerCase())
  );
}

export function getProductsByVendor(vendor: string): Product[] {
  return products.filter(p => p.vendor.toLowerCase() === vendor.toLowerCase());
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

export function getUniqueCategories(): string[] {
  const categories = new Set<string>();
  products.forEach(p => {
    if (p.productType) categories.add(p.productType);
  });
  return Array.from(categories).sort();
}

export function getUniqueVendors(): string[] {
  const vendors = new Set<string>();
  products.forEach(p => {
    if (p.vendor) vendors.add(p.vendor);
  });
  return Array.from(vendors).sort();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p =>
      p.id !== product.id &&
      (p.productType === product.productType ||
       p.tags.some(t => product.tags.includes(t)))
    )
    .slice(0, limit);
}
