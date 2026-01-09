import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const BASE_URL = 'https://sunbeamvintage.com';
const OUTPUT_DIR = path.join(process.cwd(), 'scraped-data');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');
const PRODUCTS_FILE = path.join(OUTPUT_DIR, 'products.json');

interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  src: string;
  width: number;
  height: number;
  variant_ids: number[];
}

interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  compare_at_price: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  available: boolean;
  grams: number;
}

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: { name: string; values: string[] }[];
  created_at: string;
  updated_at: string;
}

interface ScrapedProduct {
  id: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  price: number;
  compareAtPrice: number | null;
  images: {
    original: string;
    local: string;
    width: number;
    height: number;
  }[];
  variants: {
    id: number;
    title: string;
    price: number;
    sku: string;
    available: boolean;
    options: Record<string, string>;
  }[];
  options: { name: string; values: string[] }[];
}

// Fetch with retry
async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1} for ${url}`);
      await sleep(1000 * (i + 1));
    }
  }
}

// Download image
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
          return;
        }
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get high-res image URL
function getHighResImageUrl(url: string): string {
  // Remove size constraints to get original hi-res image
  return url.replace(/(_\d+x\d+|_small|_medium|_large|_grande)/g, '');
}

// Clean HTML to plain text
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  let page = 1;
  const limit = 250; // Max Shopify allows

  console.log('Fetching products from Shopify API...');

  while (true) {
    const url = `${BASE_URL}/products.json?limit=${limit}&page=${page}`;
    console.log(`Fetching page ${page}...`);

    try {
      const data = await fetchWithRetry(url);

      if (!data.products || data.products.length === 0) {
        break;
      }

      products.push(...data.products);
      console.log(`Fetched ${products.length} products so far...`);

      if (data.products.length < limit) {
        break; // Last page
      }

      page++;
      await sleep(500); // Rate limiting
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }

  return products;
}

async function scrapeProducts(maxProducts?: number): Promise<void> {
  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Fetch all products
  let products = await fetchAllProducts();

  if (maxProducts) {
    products = products.slice(0, maxProducts);
  }

  console.log(`\nProcessing ${products.length} products...`);

  const scrapedProducts: ScrapedProduct[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Processing: ${product.title}`);

    // Collect image URLs (skip downloading - use Shopify CDN directly)
    const images: ScrapedProduct['images'] = [];

    for (let j = 0; j < product.images.length; j++) {
      const image = product.images[j];
      const hiResUrl = getHighResImageUrl(image.src);
      const ext = path.extname(new URL(hiResUrl).pathname) || '.jpg';
      const filename = `${j + 1}${ext}`;
      const relativePath = path.join('images', product.handle, filename);

      images.push({
        original: hiResUrl,
        local: relativePath, // Not downloaded, but kept for compatibility
        width: image.width,
        height: image.height,
      });
    }

    // Process variants
    const variants = product.variants.map(v => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price),
      sku: v.sku,
      available: v.available,
      options: {
        ...(v.option1 && product.options[0] ? { [product.options[0].name]: v.option1 } : {}),
        ...(v.option2 && product.options[1] ? { [product.options[1].name]: v.option2 } : {}),
        ...(v.option3 && product.options[2] ? { [product.options[2].name]: v.option3 } : {}),
      },
    }));

    // Create scraped product
    const scrapedProduct: ScrapedProduct = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: htmlToText(product.body_html || ''),
      vendor: product.vendor,
      productType: product.product_type,
      tags: product.tags,
      price: parseFloat(product.variants[0]?.price || '0'),
      compareAtPrice: product.variants[0]?.compare_at_price
        ? parseFloat(product.variants[0].compare_at_price)
        : null,
      images,
      variants,
      options: product.options,
    };

    scrapedProducts.push(scrapedProduct);
  }

  // Save products to JSON
  fs.writeFileSync(
    PRODUCTS_FILE,
    JSON.stringify(scrapedProducts, null, 2)
  );

  console.log(`\nScraping complete!`);
  console.log(`Products saved to: ${PRODUCTS_FILE}`);
  console.log(`Total products: ${scrapedProducts.length}`);
  console.log(`Total images (using CDN URLs): ${scrapedProducts.reduce((acc, p) => acc + p.images.length, 0)}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const maxProducts = args[0] ? parseInt(args[0], 10) : undefined;

scrapeProducts(maxProducts).catch(console.error);
