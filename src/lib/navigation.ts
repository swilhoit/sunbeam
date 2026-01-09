export interface NavItem {
  label: string;
  href: string;
  featured?: boolean;
}

export interface NavCategory {
  label: string;
  href: string;
  items: NavItem[];
  image?: string;
  description?: string;
}

export interface NavSection {
  label: string;
  href: string;
  hasDropdown?: boolean;
  featured?: boolean;
  categories?: NavCategory[];
}

// Category images mapping - using actual product images from scraped data
export const categoryImages: Record<string, string> = {
  // Furniture - Room based
  'Shop All': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/IMG_8850.jpg?v=1731690951',
  'Living Room': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/IMG_5098_4b70569b-2acd-4b64-bf45-2d48270bd5d8.jpg?v=1743784800',
  'Bedroom': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/IMG_6868.jpg?v=1737648800',
  'Dining Room': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/SB07.23.25_111.jpg?v=1753319579',
  'Office': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Final-106_2f07173d-27d7-44d2-b2ff-fdfc8fda6498.jpg?v=1710912682',
  'Storage': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Finish-120_cffb1ed9-678b-4444-bbf8-7605beabc777.jpg?v=1691552612',
  // Lighting
  'All Lighting': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Capture_224_5cf9cb31-3843-47b7-b13e-21e6758ee17c.jpg?v=1767892046',
  // Art & Decor
  'Wall Art': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Capture_240_7324ef7c-a05a-4fd0-8155-18d48c701f62.jpg?v=1767891935',
  'Decorative Objects': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Capture_207_28605d0b-52a9-4482-806d-76eba79b9ace.jpg?v=1767911012',
  'Textiles': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Capture_198_76094f1f-b2ba-4572-9105-6be9ed4aa7d1.jpg?v=1767891489',
  // Kitchen & Dining
  'Tabletop': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Capture_186_ca438f7f-bc18-451f-9abc-396c2381986b.jpg?v=1767891322',
  'Bar & Entertaining': 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/Capture_155_57f534a4-022d-402d-a230-68da86eeeaab.jpg?v=1767891151',
};

// Get image for a category, with fallback
export function getCategoryImage(label: string): string {
  return categoryImages[label] || 'https://cdn.shopify.com/s/files/1/0071/3549/4213/files/IMG_8850.jpg?v=1731690951';
}

export const navigation: NavSection[] = [
  {
    label: 'Sale',
    href: '/products?sale=true',
    featured: true,
  },
  {
    label: 'New Arrivals',
    href: '/products?sort=newest',
  },
  {
    label: 'Furniture',
    href: '/products?category=furniture',
    hasDropdown: true,
    categories: [
      {
        label: 'Shop All',
        href: '/products?category=furniture',
        items: [
          { label: 'Shop All Vintage', href: '/products?styles=Vintage' },
          { label: 'Shop All Modern', href: '/products?styles=Modern' },
          { label: 'Sunbeam Exclusive', href: '/products?category=furniture&collection=exclusive', featured: true },
        ],
      },
      {
        label: 'Living Room',
        href: '/products?rooms=Living%20Room',
        items: [
          { label: 'All Living Room', href: '/products?rooms=Living%20Room' },
          { label: 'Sofas', href: '/products?categories=Sofas' },
          { label: 'Sectionals & Modular', href: '/products?categories=Sectionals%20%26%20Modular' },
          { label: 'Loveseats', href: '/products?categories=Loveseats' },
          { label: 'Accent Chairs', href: '/products?categories=Accent%20Chairs' },
          { label: 'Coffee Tables', href: '/products?categories=Coffee%20Tables' },
          { label: 'Side Tables', href: '/products?categories=Side%20Tables' },
          { label: 'Media Consoles', href: '/products?categories=Media%20Consoles' },
        ],
      },
      {
        label: 'Bedroom',
        href: '/products?rooms=Bedroom',
        items: [
          { label: 'All Bedroom', href: '/products?rooms=Bedroom' },
          { label: 'Nightstands', href: '/products?categories=Nightstands' },
          { label: 'Dressers', href: '/products?categories=Dressers' },
        ],
      },
      {
        label: 'Dining Room',
        href: '/products?rooms=Dining%20Room',
        items: [
          { label: 'All Dining Room', href: '/products?rooms=Dining%20Room' },
          { label: 'Dining Tables', href: '/products?categories=Dining%20Tables' },
          { label: 'Dining Chairs', href: '/products?categories=Dining%20Chairs' },
          { label: 'Dining Sets', href: '/products?categories=Dining%20Sets' },
          { label: 'Bar Stools', href: '/products?categories=Bar%20Stools' },
        ],
      },
      {
        label: 'Office',
        href: '/products?rooms=Office',
        items: [
          { label: 'All Office', href: '/products?rooms=Office' },
          { label: 'Office Chairs', href: '/products?categories=Office%20Chairs' },
          { label: 'Desks', href: '/products?categories=Desks' },
          { label: 'Bookcases', href: '/products?categories=Bookcases' },
        ],
      },
      {
        label: 'Storage',
        href: '/products?category=storage',
        items: [
          { label: 'Bookcases', href: '/products?categories=Bookcases' },
          { label: 'Media Consoles', href: '/products?categories=Media%20Consoles' },
          { label: 'Dressers', href: '/products?categories=Dressers' },
        ],
      },
    ],
  },
  {
    label: 'Lighting',
    href: '/products?category=lighting',
    hasDropdown: true,
    categories: [
      {
        label: 'All Lighting',
        href: '/products?category=lighting',
        items: [
          { label: 'Floor Lamps', href: '/products?categories=Floor%20Lamps' },
          { label: 'Table Lamps', href: '/products?categories=Table%20Lamps' },
          { label: 'Pendants & Chandeliers', href: '/products?categories=Pendants%20%26%20Chandeliers' },
        ],
      },
    ],
  },
  {
    label: 'Art & Decor',
    href: '/products?category=art-decor',
    hasDropdown: true,
    categories: [
      {
        label: 'Wall Art',
        href: '/products?categories=Wall%20Art',
        items: [
          { label: 'All Wall Art', href: '/products?categories=Wall%20Art' },
          { label: 'Paintings', href: '/products?categories=Wall%20Art&type=painting' },
          { label: 'Prints & Posters', href: '/products?categories=Wall%20Art&type=print' },
        ],
      },
      {
        label: 'Decorative Objects',
        href: '/products?categories=Decorative%20Objects',
        items: [
          { label: 'All Decorative Objects', href: '/products?categories=Decorative%20Objects' },
          { label: 'Vases', href: '/products?categories=Decorative%20Objects&type=vase' },
          { label: 'Sculptures', href: '/products?categories=Decorative%20Objects&type=sculpture' },
        ],
      },
      {
        label: 'Textiles',
        href: '/products?category=textiles',
        items: [
          { label: 'Rugs', href: '/products?categories=Rugs' },
        ],
      },
    ],
  },
  {
    label: 'Kitchen & Dining',
    href: '/products?category=kitchen-dining',
    hasDropdown: true,
    categories: [
      {
        label: 'Tabletop',
        href: '/products?category=kitchen-dining',
        items: [
          { label: 'Serveware', href: '/products?categories=Serveware' },
          { label: 'Dinnerware', href: '/products?categories=Dinnerware' },
          { label: 'Glassware', href: '/products?categories=Glassware' },
        ],
      },
      {
        label: 'Bar & Entertaining',
        href: '/products?category=bar',
        items: [
          { label: 'Bar Accessories', href: '/products?categories=Bar%20Accessories' },
          { label: 'Bar Carts', href: '/products?categories=Bar%20Carts' },
          { label: 'Decanters', href: '/products?categories=Decanters' },
        ],
      },
    ],
  },
  {
    label: 'Outdoor',
    href: '/products?rooms=Outdoor',
  },
  {
    label: 'Gifts',
    href: '/products?category=gifts',
  },
];

export const secondaryNavigation = [
  { label: 'Interior Designers', href: '/trade-program' },
  { label: 'About Us', href: '/about' },
  { label: 'Visit Us', href: '/visit' },
];

// Style-based navigation shortcuts
export const styleNavigation = [
  { label: 'Vintage', href: '/products?styles=Vintage' },
  { label: 'Modern', href: '/products?styles=Modern' },
  { label: 'Mid Century', href: '/products?styles=Mid%20Century' },
  { label: 'Contemporary', href: '/products?styles=Contemporary' },
];

// Room-based navigation shortcuts
export const roomNavigation = [
  { label: 'Living Room', href: '/products?rooms=Living%20Room' },
  { label: 'Bedroom', href: '/products?rooms=Bedroom' },
  { label: 'Dining Room', href: '/products?rooms=Dining%20Room' },
  { label: 'Office', href: '/products?rooms=Office' },
];
