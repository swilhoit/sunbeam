'use client';

import { useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product } from '@/types/product';
import { Room, Style, rooms, styles } from '@/lib/categories';

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

// Dimension range options
export const dimensionRanges = [
  { id: 'under-24', label: 'Under 24"', min: 0, max: 24 },
  { id: '24-36', label: '24" - 36"', min: 24, max: 36 },
  { id: '36-48', label: '36" - 48"', min: 36, max: 48 },
  { id: '48-60', label: '48" - 60"', min: 48, max: 60 },
  { id: '60-72', label: '60" - 72"', min: 60, max: 72 },
  { id: 'over-72', label: 'Over 72"', min: 72, max: Infinity },
] as const;

export type DimensionRangeId = typeof dimensionRanges[number]['id'];

export interface FilterState {
  categories: string[];
  rooms: Room[];
  styles: Style[];
  minPrice: number;
  maxPrice: number;
  widthRanges: DimensionRangeId[];
  depthRanges: DimensionRangeId[];
  heightRanges: DimensionRangeId[];
  sortBy: SortOption;
  searchQuery: string;
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

  // Check which dimension ranges have products
  const availableDimensionRanges = useMemo(() => {
    const widthRanges = new Set<DimensionRangeId>();
    const depthRanges = new Set<DimensionRangeId>();
    const heightRanges = new Set<DimensionRangeId>();

    products.forEach((p) => {
      if (p.dimensions) {
        if (p.dimensions.width) {
          const range = dimensionRanges.find(
            (r) => p.dimensions!.width! >= r.min && p.dimensions!.width! < r.max
          );
          if (range) widthRanges.add(range.id);
        }
        if (p.dimensions.depth) {
          const range = dimensionRanges.find(
            (r) => p.dimensions!.depth! >= r.min && p.dimensions!.depth! < r.max
          );
          if (range) depthRanges.add(range.id);
        }
        if (p.dimensions.height) {
          const range = dimensionRanges.find(
            (r) => p.dimensions!.height! >= r.min && p.dimensions!.height! < r.max
          );
          if (range) heightRanges.add(range.id);
        }
      }
    });

    return {
      width: dimensionRanges.filter((r) => widthRanges.has(r.id)),
      depth: dimensionRanges.filter((r) => depthRanges.has(r.id)),
      height: dimensionRanges.filter((r) => heightRanges.has(r.id)),
    };
  }, [products]);

  // Extract unique categories (prefer normalized)
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.normalizedCategory) {
        cats.add(p.normalizedCategory);
      } else if (p.productType) {
        cats.add(p.productType);
      }
    });
    return Array.from(cats).filter(Boolean).sort();
  }, [products]);

  // Extract available rooms
  const availableRooms = useMemo(() => {
    const roomSet = new Set<Room>();
    products.forEach((p) => {
      p.rooms?.forEach((room) => roomSet.add(room));
    });
    return rooms.filter((r) => roomSet.has(r));
  }, [products]);

  // Extract available styles
  const availableStyles = useMemo(() => {
    const styleSet = new Set<Style>();
    products.forEach((p) => {
      if (p.style) styleSet.add(p.style);
    });
    return styles.filter((s) => styleSet.has(s));
  }, [products]);

  // Parse dimension range IDs from URL param
  const parseDimensionRanges = (param: string | null): DimensionRangeId[] => {
    if (!param) return [];
    const ids = param.split(',');
    return ids.filter((id): id is DimensionRangeId =>
      dimensionRanges.some((r) => r.id === id)
    );
  };

  // Read filter state from URL
  const filters: FilterState = useMemo(() => {
    const categoriesParam = searchParams.get('categories');
    const roomsParam = searchParams.get('rooms');
    const stylesParam = searchParams.get('styles');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const widthParam = searchParams.get('width');
    const depthParam = searchParams.get('depth');
    const heightParam = searchParams.get('height');
    const sortParam = searchParams.get('sort');
    const searchParam = searchParams.get('search');

    return {
      categories: categoriesParam ? categoriesParam.split(',').filter(Boolean) : [],
      rooms: roomsParam
        ? (roomsParam.split(',').filter((r) => rooms.includes(r as Room)) as Room[])
        : [],
      styles: stylesParam
        ? (stylesParam.split(',').filter((s) => styles.includes(s as Style)) as Style[])
        : [],
      minPrice: minPriceParam ? Number(minPriceParam) : priceRange.min,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : priceRange.max,
      widthRanges: parseDimensionRanges(widthParam),
      depthRanges: parseDimensionRanges(depthParam),
      heightRanges: parseDimensionRanges(heightParam),
      sortBy: (sortParam as SortOption) || 'newest',
      searchQuery: searchParam || '',
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

      // Rooms
      if (merged.rooms.length > 0) {
        params.set('rooms', merged.rooms.join(','));
      } else {
        params.delete('rooms');
      }

      // Styles
      if (merged.styles.length > 0) {
        params.set('styles', merged.styles.join(','));
      } else {
        params.delete('styles');
      }

      // Price range
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

      // Dimension ranges
      if (merged.widthRanges.length > 0) {
        params.set('width', merged.widthRanges.join(','));
      } else {
        params.delete('width');
      }

      if (merged.depthRanges.length > 0) {
        params.set('depth', merged.depthRanges.join(','));
      } else {
        params.delete('depth');
      }

      if (merged.heightRanges.length > 0) {
        params.set('height', merged.heightRanges.join(','));
      } else {
        params.delete('height');
      }

      // Sort
      if (merged.sortBy !== 'newest') {
        params.set('sort', merged.sortBy);
      } else {
        params.delete('sort');
      }

      // Search query
      if (merged.searchQuery) {
        params.set('search', merged.searchQuery);
      } else {
        params.delete('search');
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, pathname, router, filters, priceRange]
  );

  // Category toggle
  const toggleCategory = useCallback(
    (category: string) => {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];
      updateURL({ categories: newCategories });
    },
    [filters.categories, updateURL]
  );

  const setCategories = useCallback(
    (categories: string[]) => {
      updateURL({ categories });
    },
    [updateURL]
  );

  // Room toggle
  const toggleRoom = useCallback(
    (room: Room) => {
      const newRooms = filters.rooms.includes(room)
        ? filters.rooms.filter((r) => r !== room)
        : [...filters.rooms, room];
      updateURL({ rooms: newRooms });
    },
    [filters.rooms, updateURL]
  );

  const setRooms = useCallback(
    (newRooms: Room[]) => {
      updateURL({ rooms: newRooms });
    },
    [updateURL]
  );

  // Style toggle
  const toggleStyle = useCallback(
    (style: Style) => {
      const newStyles = filters.styles.includes(style)
        ? filters.styles.filter((s) => s !== style)
        : [...filters.styles, style];
      updateURL({ styles: newStyles });
    },
    [filters.styles, updateURL]
  );

  const setStyles = useCallback(
    (newStyles: Style[]) => {
      updateURL({ styles: newStyles });
    },
    [updateURL]
  );

  // Dimension range toggles
  const toggleWidthRange = useCallback(
    (rangeId: DimensionRangeId) => {
      const newRanges = filters.widthRanges.includes(rangeId)
        ? filters.widthRanges.filter((r) => r !== rangeId)
        : [...filters.widthRanges, rangeId];
      updateURL({ widthRanges: newRanges });
    },
    [filters.widthRanges, updateURL]
  );

  const toggleDepthRange = useCallback(
    (rangeId: DimensionRangeId) => {
      const newRanges = filters.depthRanges.includes(rangeId)
        ? filters.depthRanges.filter((r) => r !== rangeId)
        : [...filters.depthRanges, rangeId];
      updateURL({ depthRanges: newRanges });
    },
    [filters.depthRanges, updateURL]
  );

  const toggleHeightRange = useCallback(
    (rangeId: DimensionRangeId) => {
      const newRanges = filters.heightRanges.includes(rangeId)
        ? filters.heightRanges.filter((r) => r !== rangeId)
        : [...filters.heightRanges, rangeId];
      updateURL({ heightRanges: newRanges });
    },
    [filters.heightRanges, updateURL]
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

  // Set search query
  const setSearchQuery = useCallback(
    (query: string) => {
      updateURL({ searchQuery: query });
    },
    [updateURL]
  );

  // Helper to check if dimension is in selected ranges
  const isInSelectedRanges = (value: number | undefined, selectedRanges: DimensionRangeId[]): boolean => {
    if (value === undefined) return false;
    return selectedRanges.some((rangeId) => {
      const range = dimensionRanges.find((r) => r.id === rangeId);
      return range && value >= range.min && value < range.max;
    });
  };

  // Apply filters and sort to products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.materials?.some((m) => m.toLowerCase().includes(query)) ||
          p.normalizedCategory?.toLowerCase().includes(query) ||
          p.productType.toLowerCase().includes(query) ||
          p.vendor.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      const lowerCategories = filters.categories.map((c) => c.toLowerCase());
      result = result.filter(
        (p) =>
          lowerCategories.includes(p.normalizedCategory?.toLowerCase() || '') ||
          lowerCategories.includes(p.productType.toLowerCase())
      );
    }

    // Room filter
    if (filters.rooms.length > 0) {
      result = result.filter((p) =>
        p.rooms?.some((r) => filters.rooms.includes(r))
      );
    }

    // Style filter
    if (filters.styles.length > 0) {
      result = result.filter(
        (p) => p.style && filters.styles.includes(p.style)
      );
    }

    // Width range filter
    if (filters.widthRanges.length > 0) {
      result = result.filter((p) =>
        isInSelectedRanges(p.dimensions?.width, filters.widthRanges)
      );
    }

    // Depth range filter
    if (filters.depthRanges.length > 0) {
      result = result.filter((p) =>
        isInSelectedRanges(p.dimensions?.depth, filters.depthRanges)
      );
    }

    // Height range filter
    if (filters.heightRanges.length > 0) {
      result = result.filter((p) =>
        isInSelectedRanges(p.dimensions?.height, filters.heightRanges)
      );
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
        break;
    }

    return result;
  }, [products, filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.rooms.length > 0 ||
      filters.styles.length > 0 ||
      filters.minPrice > priceRange.min ||
      filters.maxPrice < priceRange.max ||
      filters.widthRanges.length > 0 ||
      filters.depthRanges.length > 0 ||
      filters.heightRanges.length > 0 ||
      filters.sortBy !== 'newest' ||
      filters.searchQuery !== ''
    );
  }, [filters, priceRange]);

  // Count of active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count += 1;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.rooms.length > 0) count += filters.rooms.length;
    if (filters.styles.length > 0) count += filters.styles.length;
    if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) count += 1;
    if (filters.widthRanges.length > 0) count += filters.widthRanges.length;
    if (filters.depthRanges.length > 0) count += filters.depthRanges.length;
    if (filters.heightRanges.length > 0) count += filters.heightRanges.length;
    return count;
  }, [filters, priceRange]);

  return {
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
    setRooms,
    toggleStyle,
    setStyles,
    toggleWidthRange,
    toggleDepthRange,
    toggleHeightRange,
    setPriceRange,
    setSortBy,
    setSearchQuery,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
