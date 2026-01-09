'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Grid, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface ProductGridProps {
  products: Product[];
  showFilters?: boolean;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

export function ProductGrid({ products, showFilters = true }: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.productType) cats.add(p.productType);
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.productType === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSortBy('newest');
  };

  const hasActiveFilters = selectedCategory !== null || sortBy !== 'newest';

  return (
    <div>
      {showFilters && (
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-2 h-10 border-border"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-8">
                  <div>
                    <h4 className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground mb-4">
                      Category
                    </h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(selectedCategory === cat ? null : cat);
                          }}
                          className={`block w-full text-left py-2 text-sm transition-colors ${
                            selectedCategory === cat
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-[11px] font-sans uppercase tracking-[0.25em] transition-colors ${
                  !selectedCategory
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                All
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                  className={`px-4 py-2 text-[11px] font-sans uppercase tracking-[0.25em] transition-colors ${
                    selectedCategory === cat
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground">
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-sm text-foreground cursor-pointer focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="hidden md:flex items-center gap-1 border-l border-border pl-4">
              <button
                onClick={() => setGridCols(2)}
                className={`p-1.5 transition-colors ${
                  gridCols === 2 ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 transition-colors ${
                  gridCols === 3 ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} pieces
            </span>
          </div>
        </div>
      )}

      <div
        className={`grid gap-x-6 gap-y-12 ${
          gridCols === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : gridCols === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {filteredProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">No pieces found matching your criteria.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
