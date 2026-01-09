import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductActions } from '@/components/products/ProductActions';
import { Separator } from '@/components/ui/separator';
import { getAllProducts, getProductByHandle, getRelatedProducts, formatPrice } from '@/lib/products';
import { ChevronLeft, Truck, Shield, RotateCcw } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = getProductByHandle(handle);

  if (!product) {
    return { title: 'Product Not Found | Sunbeam' };
  }

  return {
    title: `${product.title} | Sunbeam`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <>
      <Header />

      <main className="pt-28 pb-20 overflow-x-hidden">
        <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Collection</span>
            </Link>
          </nav>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <ProductGallery images={product.images} title={product.title} />

            {/* Product Info */}
            <div className="lg:py-8">
              {/* Vendor Badge */}
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-3">
                {product.vendor}
              </p>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-heading mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-sans">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <Separator className="my-6" />

              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Options</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className="px-4 py-2 text-sm border border-border hover:border-foreground transition-colors"
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mb-8">
                <ProductActions product={product} />
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center py-4 px-2 bg-secondary">
                  <Truck className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center py-4 px-2 bg-secondary">
                  <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Secure Payment</p>
                </div>
                <div className="text-center py-4 px-2 bg-secondary">
                  <RotateCcw className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="prose prose-neutral max-w-none">
                <h3 className="text-lg font-heading mb-4">About This Piece</h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm font-medium mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24 md:mt-32">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-2">
                    You May Also Like
                  </p>
                  <h2 className="text-xl md:text-2xl font-heading">
                    Related Pieces
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
