export interface NavItem {
  label: string;
  href: string;
  featured?: boolean;
}

export interface NavCategory {
  label: string;
  href: string;
  items: NavItem[];
}

export interface NavSection {
  label: string;
  href: string;
  hasDropdown?: boolean;
  featured?: boolean;
  categories?: NavCategory[];
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
          { label: 'Shop All Vintage', href: '/products?category=furniture&style=vintage' },
          { label: 'Shop All Modern', href: '/products?category=furniture&style=modern' },
          { label: 'Sunbeam Exclusive', href: '/products?category=furniture&collection=exclusive', featured: true },
        ],
      },
      {
        label: 'Living Room',
        href: '/products?category=living-room',
        items: [
          { label: 'All Sofas & Seating', href: '/products?category=sofas-seating' },
          { label: 'Mid Century Sofas', href: '/products?category=sofas&style=mid-century' },
          { label: 'Sectionals & Modular', href: '/products?category=sectionals' },
          { label: 'Loveseats & Settees', href: '/products?category=loveseats' },
          { label: 'Accent & Lounge Chairs', href: '/products?category=accent-chairs' },
          { label: 'Chaise Lounges', href: '/products?category=chaise-lounges' },
          { label: 'Coffee Tables', href: '/products?category=coffee-tables' },
          { label: 'End Tables', href: '/products?category=end-tables' },
          { label: 'Benches & Ottomans', href: '/products?category=benches-ottomans' },
        ],
      },
      {
        label: 'Bedroom',
        href: '/products?category=bedroom',
        items: [
          { label: 'Beds & Headboards', href: '/products?category=beds' },
          { label: 'Nightstands', href: '/products?category=nightstands' },
          { label: 'Dressers & Armoires', href: '/products?category=dressers' },
          { label: 'Vanities', href: '/products?category=vanities' },
        ],
      },
      {
        label: 'Dining Room',
        href: '/products?category=dining',
        items: [
          { label: 'Dining Tables', href: '/products?category=dining-tables' },
          { label: 'Dining Chairs', href: '/products?category=dining-chairs' },
          { label: 'Bar & Counter Stools', href: '/products?category=bar-stools' },
          { label: 'Buffets & Sideboards', href: '/products?category=buffets' },
          { label: 'Bar Carts', href: '/products?category=bar-carts' },
        ],
      },
      {
        label: 'Office',
        href: '/products?category=office',
        items: [
          { label: 'Office Chairs', href: '/products?category=office-chairs' },
          { label: 'Desks', href: '/products?category=desks' },
          { label: 'Bookcases', href: '/products?category=bookcases' },
          { label: 'Filing Cabinets', href: '/products?category=filing-cabinets' },
        ],
      },
      {
        label: 'Storage',
        href: '/products?category=storage',
        items: [
          { label: 'Credenzas', href: '/products?category=credenzas' },
          { label: 'Shelving Units', href: '/products?category=shelving' },
          { label: 'Media Consoles', href: '/products?category=media-consoles' },
          { label: 'Room Dividers', href: '/products?category=room-dividers' },
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
          { label: 'Floor Lamps', href: '/products?category=floor-lamps' },
          { label: 'Table Lamps', href: '/products?category=table-lamps' },
          { label: 'Pendant Lights', href: '/products?category=pendant-lights' },
          { label: 'Chandeliers', href: '/products?category=chandeliers' },
          { label: 'Wall Sconces', href: '/products?category=wall-sconces' },
          { label: 'Desk Lamps', href: '/products?category=desk-lamps' },
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
        href: '/products?category=wall-art',
        items: [
          { label: 'Paintings', href: '/products?category=paintings' },
          { label: 'Prints & Posters', href: '/products?category=prints' },
          { label: 'Wall Sculptures', href: '/products?category=wall-sculptures' },
          { label: 'Mirrors', href: '/products?category=mirrors' },
        ],
      },
      {
        label: 'Decorative Objects',
        href: '/products?category=decorative',
        items: [
          { label: 'Vases', href: '/products?category=vases' },
          { label: 'Sculptures', href: '/products?category=sculptures' },
          { label: 'Ceramics', href: '/products?category=ceramics' },
          { label: 'Bookends', href: '/products?category=bookends' },
        ],
      },
      {
        label: 'Textiles',
        href: '/products?category=textiles',
        items: [
          { label: 'Rugs', href: '/products?category=rugs' },
          { label: 'Throw Pillows', href: '/products?category=pillows' },
          { label: 'Blankets', href: '/products?category=blankets' },
        ],
      },
    ],
  },
  {
    label: 'Outdoor',
    href: '/products?category=outdoor',
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
