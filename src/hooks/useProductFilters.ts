'use client';

import { useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product } from '@/types/product';

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
}

export function useProductFilters(products: Product[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Compute price bounds from products
  const priceRange = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 10000 };
    }
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Extract unique categories
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.productType) cats.add(p.productType);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Read filter state from URL
  const filters: FilterState = useMemo(() => {
    const categoriesParam = searchParams.get('categories');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const sortParam = searchParams.get('sort');

    return {
      categories: categoriesParam ? categoriesParam.split(',').filter(Boolean) : [],
      minPrice: minPriceParam ? Number(minPriceParam) : priceRange.min,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : priceRange.max,
      sortBy: (sortParam as SortOption) || 'newest',
    };
  }, [searchParams, priceRange]);

  // Update URL with new filter state
  const updateURL = useCallback(
    (newFilters: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString());

      const merged = { ...filters, ...newFilters };

      // Categories
      if (merged.categories.length > 0) {
        params.set('categories', merged.categories.join(','));
      } else {
        params.delete('categories');
      }

      // Price range - only set if different from defaults
      if (merged.minPrice > priceRange.min) {
        params.set('minPrice', String(merged.minPrice));
      } else {
        params.delete('minPrice');
      }

      if (merged.maxPrice < priceRange.max) {
        params.set('maxPrice', String(merged.maxPrice));
      } else {
        params.delete('maxPrice');
      }

      // Sort
      if (merged.sortBy !== 'newest') {
        params.set('sort', merged.sortBy);
      } else {
        params.delete('sort');
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, pathname, router, filters, priceRange]
  );

  // Category toggle (add/remove from selection)
  const toggleCategory = useCallback(
    (category: string) => {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];
      updateURL({ categories: newCategories });
    },
    [filters.categories, updateURL]
  );

  // Set all categories at once
  const setCategories = useCallback(
    (categories: string[]) => {
      updateURL({ categories });
    },
    [updateURL]
  );

  // Update price range
  const setPriceRange = useCallback(
    (min: number, max: number) => {
      updateURL({ minPrice: min, maxPrice: max });
    },
    [updateURL]
  );

  // Update sort
  const setSortBy = useCallback(
    (sortBy: SortOption) => {
      updateURL({ sortBy });
    },
    [updateURL]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // Apply filters and sort to products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter (multi-select - show products matching ANY selected category)
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.productType));
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Sort
    switch (filters.sortBy) {
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
        // 'newest' - keep original order
        break;
    }

    return result;
  }, [products, filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.minPrice > priceRange.min ||
      filters.maxPrice < priceRange.max ||
      filters.sortBy !== 'newest'
    );
  }, [filters, priceRange]);

  return {
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
  };
}
