import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getAllProducts } from '@/lib/products';

export const metadata = {
  title: 'Collection | Sunbeam',
  description: 'Browse our curated collection of vintage and mid-century modern furniture.',
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <>
      <Header />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20">
          {/* Page Header */}
          <div className="mb-16 max-w-2xl">
            <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-3">
              The Collection
            </p>
            <h1 className="text-5xl md:text-6xl font-serif mb-6">
              All Pieces
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover our carefully curated selection of vintage and mid-century
              modern furniture. Each piece has been chosen for its exceptional
              design, quality craftsmanship, and timeless appeal.
            </p>
          </div>

          {/* Products Grid with Filters */}
          <ProductGrid products={products} showFilters={true} />
        </div>
      </main>

      <Footer />
    </>
  );
}
