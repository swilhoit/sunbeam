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
          <div className="mb-8 flex items-baseline justify-between">
            <h1 className="text-xl md:text-2xl font-heading">
              All Pieces
            </h1>
          </div>

          {/* Products Grid with Filters */}
          <ProductGrid products={products} showFilters={true} />
        </div>
      </main>

      <Footer />
    </>
  );
}
