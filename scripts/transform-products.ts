/**
 * Product Data Transformation Script
 *
 * This script processes the raw products.json and enhances each product with:
 * - Normalized category
 * - Extracted rooms from tags
 * - Style classification from vendor/tags
 * - Condition parsed from description
 * - Era/decade parsed from description
 * - Materials extracted from description
 * - Dimensions parsed from description
 *
 * Run with: npx tsx scripts/transform-products.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Types (duplicated to avoid import issues in script)
interface ProductImage {
  original: string;
  local: string;
  width: number;
  height: number;
}

interface ProductVariant {
  id: number;
  title: string;
  price: number;
  sku: string;
  available: boolean;
  options: Record<string, string>;
}

interface ProductOption {
  name: string;
  values: string[];
}

interface ProductDimensions {
  width?: number;
  depth?: number;
  height?: number;
  seatHeight?: number;
  diameter?: number;
}

interface RawProduct {
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

interface EnhancedProduct extends RawProduct {
  normalizedCategory: string;
  rooms: string[];
  style: string | null;
  condition: string | null;
  era: string | null;
  materials: string[];
  dimensions: ProductDimensions | null;
  isSold: boolean;
  isOnSale: boolean;
}

// Category normalization mapping
const categoryNormalization: Record<string, string> = {
  'Accent Chairs': 'Accent Chairs',
  'Accent & Arm Chairs': 'Accent Chairs',
  'Sectionals & Modular Seating': 'Sectionals & Modular',
  'Sofas & Loveseats': 'Sofas',
  'Sofas & Couches': 'Sofas',
  'Loveseats & Settees': 'Loveseats',
  'Office Chairs': 'Office Chairs',
  'Dining Chairs': 'Dining Chairs',
  'Bar Stools': 'Bar Stools',
  'Coffee Tables': 'Coffee Tables',
  'Side Tables': 'Side Tables',
  'Nightstands': 'Nightstands',
  'Dining Tables': 'Dining Tables',
  'Dining Sets': 'Dining Sets',
  'Tables': 'Tables',
  'Desks': 'Desks',
  'Dressers & Chests': 'Dressers',
  'Consoles & Media Storage': 'Media Consoles',
  'Bookcases & Shelving': 'Bookcases',
  'Bookcases & Shelving Units': 'Bookcases',
  'Floor Lamps': 'Floor Lamps',
  'Table & Desk Lamps': 'Table Lamps',
  'Pendants & Chandeliers': 'Pendants & Chandeliers',
  'Art & Wall Hangings': 'Wall Art',
  'Rugs': 'Rugs',
  'Vases & Sculptures': 'Decorative Objects',
  'Trays, Bowls & Objects': 'Decorative Objects',
  'Serveware & Entertaining': 'Serveware',
};

// Room types
const rooms = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Office',
  'Entryway',
  'Bathroom',
  'Outdoor',
];

// Styles
const styles = [
  'Vintage',
  'Modern',
  'Mid Century',
  'Contemporary',
  'Art Deco',
  'Bohemian',
  'Industrial',
  'Minimalist',
];

// Vendor to style mapping
const vendorStyleMapping: Record<string, string> = {
  Vintage: 'Vintage',
  Modern: 'Modern',
  Contemporary: 'Contemporary',
  'Contemporary, Newly Made': 'Contemporary',
  'Sunbeam Exclusive': 'Vintage',
  'Sunbeam Vintage': 'Vintage',
};

// Material keywords
const materialKeywords = [
  'walnut', 'oak', 'teak', 'mahogany', 'pine', 'cherry', 'maple', 'rosewood',
  'bamboo', 'rattan', 'wicker', 'brass', 'chrome', 'steel', 'iron', 'copper',
  'gold', 'aluminum', 'velvet', 'leather', 'linen', 'cotton', 'wool', 'silk',
  'bouclé', 'boucle', 'tweed', 'glass', 'ceramic', 'marble', 'granite',
  'travertine', 'lucite', 'acrylic', 'plastic', 'resin', 'lacquer', 'laminate',
  'veneer', 'upholstered', 'cork', 'tile', 'wood',
];

// Eras
const eras = ['1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', 'Contemporary'];

function normalizeCategory(category: string): string {
  return categoryNormalization[category] || category;
}

function extractRoomsFromTags(tags: string[]): string[] {
  return tags.filter(tag => rooms.includes(tag));
}

function extractStyleFromProduct(vendor: string, tags: string[]): string | null {
  if (vendorStyleMapping[vendor]) {
    return vendorStyleMapping[vendor];
  }

  for (const tag of tags) {
    if (styles.includes(tag)) {
      return tag;
    }
    if (tag.toLowerCase().includes('mid century') || tag.toLowerCase().includes('mid-century')) {
      return 'Mid Century';
    }
  }

  return null;
}

function parseDimensionsFromDescription(description: string): ProductDimensions | null {
  const dimensions: ProductDimensions = {};

  // Normalize the description - remove extra whitespace/newlines and normalize quotes
  // Replace curly quotes with standard quotes using explicit unicode
  const normalizedDesc = description
    .replace(/\s+/g, ' ')
    .replace(/[\u201C\u201D]/g, '"')  // Left/right double quotes
    .replace(/[\u2018\u2019]/g, "'"); // Left/right single quotes

  // Pattern for W x D x H (handles various formats)
  // Matches: 21.75"W, 15.75"D, 21.5"H or similar patterns
  const wxdxhMatch = normalizedDesc.match(/(\d+(?:\.\d+)?)"?\s*W[,\s]+(\d+(?:\.\d+)?)"?\s*D[,\s]+(\d+(?:\.\d+)?)"?\s*H/i);

  if (wxdxhMatch) {
    dimensions.width = parseFloat(wxdxhMatch[1]);
    dimensions.depth = parseFloat(wxdxhMatch[2]);
    dimensions.height = parseFloat(wxdxhMatch[3]);
  }

  // Also try pattern: 35" W x 45" D x 30" H
  if (!wxdxhMatch) {
    const altMatch = normalizedDesc.match(/(\d+(?:\.\d+)?)"\s*W\s*x\s*(\d+(?:\.\d+)?)"\s*D\s*x\s*(\d+(?:\.\d+)?)"\s*H/i);
    if (altMatch) {
      dimensions.width = parseFloat(altMatch[1]);
      dimensions.depth = parseFloat(altMatch[2]);
      dimensions.height = parseFloat(altMatch[3]);
    }
  }

  // Seat height - matches SH: 13" or Seat Height: 13"
  const seatHeightMatch = normalizedDesc.match(/(?:SH|Seat Height):\s*(\d+(?:\.\d+)?)"/i);
  if (seatHeightMatch) {
    dimensions.seatHeight = parseFloat(seatHeightMatch[1]);
  }

  // Diameter
  const diameterMatch = normalizedDesc.match(/(\d+(?:\.\d+)?)"?\s*(?:Diameter|Dia\.?)/i);
  if (diameterMatch) {
    dimensions.diameter = parseFloat(diameterMatch[1]);
  }

  return Object.keys(dimensions).length > 0 ? dimensions : null;
}

function parseConditionFromDescription(description: string): string | null {
  const lowerDesc = description.toLowerCase();

  // Check for condition section header pattern: "CONDITION\nGood Condition"
  const conditionSectionMatch = description.match(/CONDITION\s*\n\s*(Excellent|Good|Fair|Poor)/i);
  if (conditionSectionMatch) {
    const condition = conditionSectionMatch[1].toLowerCase();
    if (condition === 'excellent') return 'Excellent';
    if (condition === 'good') return 'Good';
    if (condition === 'fair') return 'Fair';
    if (condition === 'poor') return 'Fair';
  }

  // Fallback to searching in full text
  if (lowerDesc.includes('excellent condition')) return 'Excellent';
  if (lowerDesc.includes('good condition')) return 'Good';
  if (lowerDesc.includes('fair condition')) return 'Fair';
  if (lowerDesc.includes('as found') || lowerDesc.includes('as-found')) return 'As-Found';

  return null;
}

function parseEraFromDescription(description: string, tags: string[]): string | null {
  const text = `${description} ${tags.join(' ')}`.toLowerCase();

  for (const era of eras) {
    if (text.includes(era.toLowerCase())) {
      return era;
    }
  }

  // Check for decade patterns
  const decadeMatch = text.match(/\b(?:19)?([4-9])0'?s\b/i);
  if (decadeMatch) {
    const decade = 1900 + parseInt(decadeMatch[1]) * 10;
    return `${decade}s`;
  }

  return null;
}

function extractMaterialsFromDescription(description: string): string[] {
  const lowerDesc = description.toLowerCase();
  const foundMaterials: string[] = [];

  for (const material of materialKeywords) {
    if (lowerDesc.includes(material)) {
      foundMaterials.push(material.charAt(0).toUpperCase() + material.slice(1));
    }
  }

  return [...new Set(foundMaterials)];
}

function transformProduct(product: RawProduct): EnhancedProduct {
  return {
    ...product,
    normalizedCategory: normalizeCategory(product.productType),
    rooms: extractRoomsFromTags(product.tags),
    style: extractStyleFromProduct(product.vendor, product.tags),
    condition: parseConditionFromDescription(product.description),
    era: parseEraFromDescription(product.description, product.tags),
    materials: extractMaterialsFromDescription(product.description),
    dimensions: parseDimensionsFromDescription(product.description),
    isSold: false,
    isOnSale: product.compareAtPrice !== null && product.compareAtPrice > product.price,
  };
}

// Main execution
function main() {
  const inputPath = path.join(__dirname, '../scraped-data/products.json');
  const outputPath = path.join(__dirname, '../scraped-data/products-enhanced.json');

  console.log('Reading products from:', inputPath);
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const products: RawProduct[] = JSON.parse(rawData);

  console.log(`Found ${products.length} products to transform`);

  const enhancedProducts = products.map(transformProduct);

  // Log statistics
  const stats = {
    total: enhancedProducts.length,
    withRooms: enhancedProducts.filter(p => p.rooms.length > 0).length,
    withStyle: enhancedProducts.filter(p => p.style !== null).length,
    withCondition: enhancedProducts.filter(p => p.condition !== null).length,
    withEra: enhancedProducts.filter(p => p.era !== null).length,
    withMaterials: enhancedProducts.filter(p => p.materials.length > 0).length,
    withDimensions: enhancedProducts.filter(p => p.dimensions !== null).length,
  };

  console.log('\nTransformation Statistics:');
  console.log(`  Total products: ${stats.total}`);
  console.log(`  With rooms extracted: ${stats.withRooms} (${Math.round(stats.withRooms / stats.total * 100)}%)`);
  console.log(`  With style classified: ${stats.withStyle} (${Math.round(stats.withStyle / stats.total * 100)}%)`);
  console.log(`  With condition parsed: ${stats.withCondition} (${Math.round(stats.withCondition / stats.total * 100)}%)`);
  console.log(`  With era identified: ${stats.withEra} (${Math.round(stats.withEra / stats.total * 100)}%)`);
  console.log(`  With materials extracted: ${stats.withMaterials} (${Math.round(stats.withMaterials / stats.total * 100)}%)`);
  console.log(`  With dimensions parsed: ${stats.withDimensions} (${Math.round(stats.withDimensions / stats.total * 100)}%)`);

  // Log unique normalized categories
  const uniqueCategories = [...new Set(enhancedProducts.map(p => p.normalizedCategory))].sort();
  console.log(`\nNormalized Categories (${uniqueCategories.length}):`);
  uniqueCategories.forEach(cat => console.log(`  - ${cat}`));

  // Write enhanced products
  fs.writeFileSync(outputPath, JSON.stringify(enhancedProducts, null, 2));
  console.log(`\nEnhanced products written to: ${outputPath}`);

  // Also update the original file (backup first)
  const backupPath = path.join(__dirname, '../scraped-data/products-backup.json');
  fs.copyFileSync(inputPath, backupPath);
  console.log(`Original backed up to: ${backupPath}`);

  fs.writeFileSync(inputPath, JSON.stringify(enhancedProducts, null, 2));
  console.log(`Original products.json updated with enhanced data`);
}

main();
