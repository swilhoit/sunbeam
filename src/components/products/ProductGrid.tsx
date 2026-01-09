'use client';

import { useState, Suspense } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Grid, LayoutGrid, SlidersHorizontal, X, Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useProductFilters, SortOption } from '@/hooks/useProductFilters';
import { formatPrice } from '@/lib/products';

interface ProductGridProps {
  products: Product[];
  showFilters?: boolean;
}

function ProductGridInner({ products, showFilters = true }: ProductGridProps) {
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    filters,
    filteredProducts,
    availableCategories,
    priceRange,
    toggleCategory,
    setCategories,
    setPriceRange,
    setSortBy,
    clearFilters,
    hasActiveFilters,
  } = useProductFilters(products);

  // Local state for price slider (to avoid URL updates while dragging)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  // Sync local price range when URL changes
  if (localPriceRange[0] !== filters.minPrice || localPriceRange[1] !== filters.maxPrice) {
    if (filters.minPrice !== localPriceRange[0] || filters.maxPrice !== localPriceRange[1]) {
      setLocalPriceRange([filters.minPrice, filters.maxPrice]);
    }
  }

  return (
    <div>
      {showFilters && (
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-2 h-10 border-border"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {hasActiveFilters && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                      {filters.categories.length + (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] flex flex-col">
                <SheetHeader>
                  <SheetTitle className="font-heading text-2xl">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-8 overflow-y-auto flex-1">
                  {/* Categories - Mobile */}
                  <div>
                    <h4 className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground mb-4">
                      Category
                    </h4>
                    <div className="space-y-2">
                      {availableCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`flex items-center justify-between w-full text-left py-2 text-sm transition-colors ${
                            filters.categories.includes(cat)
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span>{cat}</span>
                          {filters.categories.includes(cat) && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range - Mobile */}
                  <div>
                    <h4 className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground mb-4">
                      Price Range
                    </h4>
                    <div className="space-y-4">
                      <Slider
                        value={localPriceRange}
                        min={priceRange.min}
                        max={priceRange.max}
                        step={10}
                        onValueChange={(value) => setLocalPriceRange(value as [number, number])}
                        onValueCommit={(value) => setPriceRange(value[0], value[1])}
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatPrice(localPriceRange[0])}
                        </span>
                        <span className="text-muted-foreground">
                          {formatPrice(localPriceRange[1])}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sort - Mobile */}
                  <div>
                    <h4 className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground mb-4">
                      Sort By
                    </h4>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full bg-secondary text-foreground py-2 px-3 text-sm cursor-pointer focus:outline-none"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-border space-y-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        clearFilters();
                        setLocalPriceRange([priceRange.min, priceRange.max]);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    View {filteredProducts.length} Results
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Category Filters */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCategories([])}
                className={`px-4 py-2 text-[11px] font-sans uppercase tracking-[0.25em] transition-colors ${
                  filters.categories.length === 0
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                All
              </button>
              {availableCategories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 text-[11px] font-sans uppercase tracking-[0.25em] transition-colors flex items-center gap-1.5 ${
                    filters.categories.includes(cat)
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {filters.categories.includes(cat) && <Check className="h-3 w-3" />}
                  {cat}
                </button>
              ))}
            </div>

            {/* Desktop Price Range Slider */}
            <div className="hidden lg:flex items-center gap-4 border-l border-border pl-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground whitespace-nowrap">
                Price
              </span>
              <div className="flex items-center gap-3 min-w-[200px]">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatPrice(localPriceRange[0])}
                </span>
                <Slider
                  value={localPriceRange}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={10}
                  onValueChange={(value) => setLocalPriceRange(value as [number, number])}
                  onValueCommit={(value) => setPriceRange(value[0], value[1])}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatPrice(localPriceRange[1])}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearFilters();
                  setLocalPriceRange([priceRange.min, priceRange.max]);
                }}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}

            {/* Desktop Sort */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground">
                Sort
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-sm text-foreground cursor-pointer focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Grid Layout Toggle */}
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
          <Button
            variant="outline"
            onClick={() => {
              clearFilters();
              setLocalPriceRange([priceRange.min, priceRange.max]);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
        <div className="h-10 w-64 bg-secondary rounded" />
        <div className="h-10 w-32 bg-secondary rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[3/4] bg-secondary rounded" />
            <div className="h-4 w-3/4 bg-secondary rounded" />
            <div className="h-4 w-1/4 bg-secondary rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductGrid(props: ProductGridProps) {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductGridInner {...props} />
    </Suspense>
  );
}
