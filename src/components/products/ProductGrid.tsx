'use client';

import { useState, Suspense } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Grid, LayoutGrid, SlidersHorizontal, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useProductFilters, SortOption, dimensionRanges, DimensionRangeId } from '@/hooks/useProductFilters';
import { formatPrice } from '@/lib/products';
import type { Room, Style } from '@/lib/categories';

interface ProductGridProps {
  products: Product[];
  showFilters?: boolean;
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h4 className="text-[11px] font-sans uppercase tracking-[0.25em] text-foreground">
          {title}
        </h4>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && children}
    </div>
  );
}

function ProductGridInner({ products, showFilters = true }: ProductGridProps) {
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    filters,
    filteredProducts,
    availableCategories,
    availableRooms,
    availableStyles,
    availableDimensionRanges,
    priceRange,
    toggleCategory,
    setCategories,
    toggleRoom,
    toggleStyle,
    toggleWidthRange,
    toggleDepthRange,
    toggleHeightRange,
    setPriceRange,
    setSortBy,
    setSearchQuery,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useProductFilters(products);

  // Local state for price slider
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

  const hasDimensionData =
    availableDimensionRanges.width.length > 0 ||
    availableDimensionRanges.depth.length > 0 ||
    availableDimensionRanges.height.length > 0;

  // Helper to get label for a dimension range
  const getRangeLabel = (rangeId: DimensionRangeId): string => {
    const range = dimensionRanges.find((r) => r.id === rangeId);
    return range?.label || rangeId;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-1">
          <button
            onClick={() => setCategories([])}
            className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
              filters.categories.length === 0
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>All Categories</span>
            {filters.categories.length === 0 && <Check className="h-4 w-4" />}
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
                filters.categories.includes(cat)
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{cat}</span>
              {filters.categories.includes(cat) && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Room */}
      {availableRooms.length > 0 && (
        <FilterSection title="Room">
          <div className="space-y-1">
            {availableRooms.map((room) => (
              <button
                key={room}
                onClick={() => toggleRoom(room)}
                className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
                  filters.rooms.includes(room)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{room}</span>
                {filters.rooms.includes(room) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Style */}
      {availableStyles.length > 0 && (
        <FilterSection title="Style">
          <div className="space-y-1">
            {availableStyles.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
                  filters.styles.includes(style)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{style}</span>
                {filters.styles.includes(style) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Dimensions */}
      {hasDimensionData && (
        <FilterSection title="Size">
          <div className="space-y-4">
            {/* Width */}
            {availableDimensionRanges.width.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Width</p>
                <div className="space-y-1">
                  {availableDimensionRanges.width.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => toggleWidthRange(range.id)}
                      className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
                        filters.widthRanges.includes(range.id)
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{range.label}</span>
                      {filters.widthRanges.includes(range.id) && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Depth */}
            {availableDimensionRanges.depth.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Depth</p>
                <div className="space-y-1">
                  {availableDimensionRanges.depth.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => toggleDepthRange(range.id)}
                      className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
                        filters.depthRanges.includes(range.id)
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{range.label}</span>
                      {filters.depthRanges.includes(range.id) && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Height */}
            {availableDimensionRanges.height.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Height</p>
                <div className="space-y-1">
                  {availableDimensionRanges.height.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => toggleHeightRange(range.id)}
                      className={`flex items-center justify-between w-full text-left py-1.5 text-sm transition-colors ${
                        filters.heightRanges.includes(range.id)
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{range.label}</span>
                      {filters.heightRanges.includes(range.id) && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="space-y-4 pr-2">
          <Slider
            value={localPriceRange}
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            onValueChange={(value) => setLocalPriceRange(value as [number, number])}
            onValueCommit={(value) => setPriceRange(value[0], value[1])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(localPriceRange[0])}</span>
            <span>{formatPrice(localPriceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => {
            clearFilters();
            setLocalPriceRange([priceRange.min, priceRange.max]);
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex gap-12">
      {/* Desktop Sidebar */}
      {showFilters && (
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-28">
            <FilterContent />
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {showFilters && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden gap-2 h-9 border-border"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="ml-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-[340px] flex flex-col">
                  <SheetHeader>
                    <SheetTitle className="font-heading text-xl">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto flex-1">
                    <FilterContent />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button
                      className="w-full"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      View {filteredProducts.length} Results
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} pieces
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
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
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                "{filters.searchQuery}"
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                {cat}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.rooms.map((room) => (
              <button
                key={room}
                onClick={() => toggleRoom(room)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                {room}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.styles.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                {style}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.widthRanges.map((rangeId) => (
              <button
                key={`width-${rangeId}`}
                onClick={() => toggleWidthRange(rangeId)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                W: {getRangeLabel(rangeId)}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.depthRanges.map((rangeId) => (
              <button
                key={`depth-${rangeId}`}
                onClick={() => toggleDepthRange(rangeId)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                D: {getRangeLabel(rangeId)}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.heightRanges.map((rangeId) => (
              <button
                key={`height-${rangeId}`}
                onClick={() => toggleHeightRange(rangeId)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                H: {getRangeLabel(rangeId)}
                <X className="h-3 w-3" />
              </button>
            ))}
            {(filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) && (
              <button
                onClick={() => {
                  setPriceRange(priceRange.min, priceRange.max);
                  setLocalPriceRange([priceRange.min, priceRange.max]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div
          className={`grid gap-x-6 gap-y-10 ${
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
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="flex gap-12">
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-20 bg-secondary rounded" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-6 bg-secondary rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="h-9 w-32 bg-secondary rounded" />
          <div className="h-9 w-24 bg-secondary rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-secondary rounded" />
              <div className="h-4 w-3/4 bg-secondary rounded" />
              <div className="h-4 w-1/4 bg-secondary rounded" />
            </div>
          ))}
        </div>
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
