// Category normalization and classification system for Sunbeam Vintage

// Canonical category mapping - normalizes inconsistent productType values
export const categoryNormalization: Record<string, string> = {
  // Seating
  'Accent Chairs': 'Accent Chairs',
  'Accent & Arm Chairs': 'Accent Chairs',
  'Sectionals & Modular Seating': 'Sectionals & Modular',
  'Sofas & Loveseats': 'Sofas',
  'Sofas & Couches': 'Sofas',
  'Loveseats & Settees': 'Loveseats',
  'Office Chairs': 'Office Chairs',
  'Dining Chairs': 'Dining Chairs',
  'Bar Stools': 'Bar Stools',

  // Tables
  'Coffee Tables': 'Coffee Tables',
  'Side Tables': 'Side Tables',
  'Nightstands': 'Nightstands',
  'Dining Tables': 'Dining Tables',
  'Dining Sets': 'Dining Sets',
  'Tables': 'Tables',
  'Desks': 'Desks',

  // Storage
  'Dressers & Chests': 'Dressers',
  'Consoles & Media Storage': 'Media Consoles',
  'Bookcases & Shelving': 'Bookcases',
  'Bookcases & Shelving Units': 'Bookcases',

  // Lighting
  'Floor Lamps': 'Floor Lamps',
  'Table & Desk Lamps': 'Table Lamps',
  'Pendants & Chandeliers': 'Pendants & Chandeliers',

  // Decor
  'Art & Wall Hangings': 'Wall Art',
  'Rugs': 'Rugs',
  'Vases & Sculptures': 'Decorative Objects',
  'Trays, Bowls & Objects': 'Decorative Objects',
  'Serveware & Entertaining': 'Serveware',
};

// Get normalized category
export function normalizeCategory(category: string): string {
  return categoryNormalization[category] || category;
}

// Primary category groups for navigation
export const categoryGroups = {
  furniture: {
    label: 'Furniture',
    categories: [
      'Sofas',
      'Loveseats',
      'Sectionals & Modular',
      'Accent Chairs',
      'Office Chairs',
      'Dining Chairs',
      'Bar Stools',
      'Coffee Tables',
      'Side Tables',
      'Nightstands',
      'Dining Tables',
      'Dining Sets',
      'Desks',
      'Dressers',
      'Media Consoles',
      'Bookcases',
    ],
  },
  lighting: {
    label: 'Lighting',
    categories: ['Floor Lamps', 'Table Lamps', 'Pendants & Chandeliers'],
  },
  decor: {
    label: 'Art & Decor',
    categories: ['Wall Art', 'Rugs', 'Decorative Objects', 'Serveware'],
  },
  kitchen: {
    label: 'Kitchen & Dining',
    categories: [
      'Dinnerware',
      'Glassware',
      'Serveware',
      'Bar Accessories',
      'Cookware',
    ],
  },
};

// Room types extracted from tags
export const rooms = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Office',
  'Entryway',
  'Bathroom',
  'Outdoor',
] as const;

export type Room = (typeof rooms)[number];

// Style/Era classifications
export const styles = [
  'Vintage',
  'Modern',
  'Mid Century',
  'Contemporary',
  'Art Deco',
  'Bohemian',
  'Industrial',
  'Minimalist',
] as const;

export type Style = (typeof styles)[number];

// Condition classifications
export const conditions = [
  'Excellent',
  'Good',
  'Fair',
  'As-Found',
] as const;

export type Condition = (typeof conditions)[number];

// Size classifications based on largest dimension
export const sizes = [
  'Small',
  'Medium',
  'Large',
  'Extra Large',
] as const;

export type Size = (typeof sizes)[number];

// Size thresholds (in inches) based on largest dimension
export const sizeThresholds = {
  small: 24,      // < 24"
  medium: 48,     // 24-48"
  large: 72,      // 48-72"
  // extraLarge > 72"
} as const;

// Era/decade classifications
export const eras = [
  '1940s',
  '1950s',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  '2010s',
  'Contemporary',
] as const;

export type Era = (typeof eras)[number];

// Vendor to style mapping
export const vendorStyleMapping: Record<string, Style> = {
  Vintage: 'Vintage',
  Modern: 'Modern',
  Contemporary: 'Contemporary',
  'Contemporary, Newly Made': 'Contemporary',
  'Sunbeam Exclusive': 'Vintage',
  'Sunbeam Vintage': 'Vintage',
};

// Extract room from tags
export function extractRoomsFromTags(tags: string[]): Room[] {
  return tags.filter((tag): tag is Room =>
    rooms.includes(tag as Room)
  );
}

// Extract style from vendor and tags
export function extractStyleFromProduct(vendor: string, tags: string[]): Style | null {
  // First check vendor mapping
  if (vendorStyleMapping[vendor]) {
    return vendorStyleMapping[vendor];
  }

  // Then check tags
  for (const tag of tags) {
    if (styles.includes(tag as Style)) {
      return tag as Style;
    }
    // Handle "Mid Century" variations
    if (tag.toLowerCase().includes('mid century') || tag.toLowerCase().includes('mid-century')) {
      return 'Mid Century';
    }
  }

  return null;
}

// Dimension parsing regex patterns
const dimensionPatterns = {
  // Matches: 21.75"W, 15.75"D, 21.5"H or 21.75"W x 15.75"D x 21.5"H
  wxdxh: /(\d+(?:\.\d+)?)"?\s*W[,\s]*(\d+(?:\.\d+)?)"?\s*D[,\s]*(\d+(?:\.\d+)?)"?\s*H/i,
  // Matches: 35"W, 45"D, 30"H, SH: 13"
  withSeatHeight: /SH:\s*(\d+(?:\.\d+)?)"/i,
  // Matches: Overall Dimensions: followed by dimensions
  overall: /Overall\s*Dimensions?:?\s*\n?\s*(\d+(?:\.\d+)?)"?\s*W[,\s]*(\d+(?:\.\d+)?)"?\s*D[,\s]*(\d+(?:\.\d+)?)"?\s*H/i,
  // Matches diameter for round items
  diameter: /(\d+(?:\.\d+)?)"?\s*(?:Diameter|Dia\.?)/i,
};

export interface ParsedDimensions {
  width?: number;
  depth?: number;
  height?: number;
  seatHeight?: number;
  diameter?: number;
}

// Get size category from dimensions
export function getSizeFromDimensions(dimensions: ParsedDimensions | null | undefined): Size | null {
  if (!dimensions) return null;

  // Get the largest dimension (width, depth, height, or diameter)
  const values = [
    dimensions.width,
    dimensions.depth,
    dimensions.height,
    dimensions.diameter,
  ].filter((v): v is number => v !== undefined && v !== null);

  if (values.length === 0) return null;

  const maxDimension = Math.max(...values);

  if (maxDimension < sizeThresholds.small) {
    return 'Small';
  } else if (maxDimension < sizeThresholds.medium) {
    return 'Medium';
  } else if (maxDimension < sizeThresholds.large) {
    return 'Large';
  } else {
    return 'Extra Large';
  }
}

// Parse dimensions from description
export function parseDimensionsFromDescription(description: string): ParsedDimensions | null {
  const dimensions: ParsedDimensions = {};

  // Normalize quotes and whitespace
  const normalizedDesc = description
    .replace(/\s+/g, ' ')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  // Try to match W x D x H pattern
  const wxdxhMatch = normalizedDesc.match(dimensionPatterns.wxdxh) ||
    normalizedDesc.match(dimensionPatterns.overall);

  if (wxdxhMatch) {
    dimensions.width = parseFloat(wxdxhMatch[1]);
    dimensions.depth = parseFloat(wxdxhMatch[2]);
    dimensions.height = parseFloat(wxdxhMatch[3]);
  }

  // Try to get seat height
  const seatHeightMatch = normalizedDesc.match(dimensionPatterns.withSeatHeight);
  if (seatHeightMatch) {
    dimensions.seatHeight = parseFloat(seatHeightMatch[1]);
  }

  // Try to get diameter
  const diameterMatch = normalizedDesc.match(dimensionPatterns.diameter);
  if (diameterMatch) {
    dimensions.diameter = parseFloat(diameterMatch[1]);
  }

  return Object.keys(dimensions).length > 0 ? dimensions : null;
}

// Condition parsing from description
export function parseConditionFromDescription(description: string): Condition | null {
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes('excellent condition')) {
    return 'Excellent';
  }
  if (lowerDesc.includes('good condition')) {
    return 'Good';
  }
  if (lowerDesc.includes('fair condition')) {
    return 'Fair';
  }
  if (lowerDesc.includes('as found') || lowerDesc.includes('as-found')) {
    return 'As-Found';
  }

  return null;
}

// Era parsing from description and tags
export function parseEraFromDescription(description: string, tags: string[]): Era | null {
  const text = `${description} ${tags.join(' ')}`.toLowerCase();

  // Check for specific decades
  for (const era of eras) {
    if (text.includes(era.toLowerCase())) {
      return era;
    }
  }

  // Check for decade patterns like "1970's" or "70's" or "70s"
  const decadePatterns = [
    { pattern: /\b19([4-9])0'?s\b/i, base: 1900 },
    { pattern: /\b20([0-2])0'?s\b/i, base: 2000 },
    { pattern: /\b([4-9])0'?s\b/i, base: 1900 },
  ];

  for (const { pattern, base } of decadePatterns) {
    const match = text.match(pattern);
    if (match) {
      const decade = base + parseInt(match[1]) * 10;
      return `${decade}s` as Era;
    }
  }

  return null;
}

// Materials extraction (common furniture materials)
const materialKeywords = [
  'walnut',
  'oak',
  'teak',
  'mahogany',
  'pine',
  'cherry',
  'maple',
  'rosewood',
  'bamboo',
  'rattan',
  'wicker',
  'brass',
  'chrome',
  'steel',
  'iron',
  'copper',
  'gold',
  'aluminum',
  'velvet',
  'leather',
  'linen',
  'cotton',
  'wool',
  'silk',
  'bouclé',
  'boucle',
  'tweed',
  'glass',
  'ceramic',
  'marble',
  'granite',
  'travertine',
  'lucite',
  'acrylic',
  'plastic',
  'resin',
  'lacquer',
  'laminate',
  'veneer',
  'upholstered',
];

export function extractMaterialsFromDescription(description: string): string[] {
  const lowerDesc = description.toLowerCase();
  const foundMaterials: string[] = [];

  for (const material of materialKeywords) {
    if (lowerDesc.includes(material)) {
      // Capitalize first letter
      foundMaterials.push(material.charAt(0).toUpperCase() + material.slice(1));
    }
  }

  return [...new Set(foundMaterials)]; // Remove duplicates
}
