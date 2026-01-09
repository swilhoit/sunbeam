import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { HeroSlider } from '@/components/home/HeroSlider';
import { getAllProducts } from '@/lib/products';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const products = getAllProducts();
  const featuredProducts = products.slice(0, 6);
  const heroProducts = products.slice(0, 5);

  return (
    <>
      <Header />

      <main>
        {/* Hero Slider */}
        <HeroSlider products={heroProducts} />

        {/* Featured Collection */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
              <div>
                <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  The Collection
                </p>
                <h2 className="text-4xl md:text-5xl font-serif">
                  Recent Arrivals
                </h2>
              </div>
              <Link
                href="/products"
                className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-24 md:py-32 bg-secondary relative overflow-hidden">
          <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                {products[1]?.images[0] && (
                  <Image
                    src={products[1].images[0].original}
                    alt="Sunbeam Vintage Showroom"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>

              {/* Content */}
              <div className="lg:py-12">
                <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-4">
                  Our Philosophy
                </p>
                <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                  Where Every Piece<br />
                  Has a Past
                </h2>
                <div className="space-y-6 text-foreground/80 leading-relaxed">
                  <p>
                    At Sunbeam, we believe furniture should do more than fill a space—it
                    should tell a story. Each piece in our collection has been thoughtfully
                    curated for its design integrity, craftsmanship, and enduring beauty.
                  </p>
                  <p>
                    From mid-century modern classics to one-of-a-kind vintage finds,
                    we seek out pieces that transcend trends and bring genuine character
                    to contemporary living.
                  </p>
                </div>
                <div className="mt-10 pt-10 border-t border-border">
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <p className="text-3xl font-serif">500+</p>
                      <p className="text-sm text-muted-foreground mt-1">Curated Pieces</p>
                    </div>
                    <div>
                      <p className="text-3xl font-serif">10+</p>
                      <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
                    </div>
                    <div>
                      <p className="text-3xl font-serif">LA</p>
                      <p className="text-sm text-muted-foreground mt-1">Based Studio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20">
            <div className="text-center mb-14">
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Browse By
              </p>
              <h2 className="text-4xl md:text-5xl font-serif">
                Categories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Seating', slug: 'seating', image: products[1]?.images[0]?.original },
                { name: 'Tables', slug: 'tables', image: products[4]?.images[0]?.original },
                { name: 'Storage', slug: 'storage', image: products[0]?.images[0]?.original },
              ].map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden bg-secondary"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl font-serif text-background">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 md:py-32 bg-foreground text-background">
          <div className="mx-auto max-w-4xl px-6 md:px-12 lg:px-20 text-center">
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif leading-snug italic">
              "Good design is like a good recipe—it should be timeless,
              honest, and bring people together."
            </blockquote>
            <cite className="block mt-8 text-sm font-sans uppercase tracking-[0.2em] text-background/60 not-italic">
              — The Sunbeam Philosophy
            </cite>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
