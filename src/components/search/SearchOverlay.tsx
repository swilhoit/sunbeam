'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchProducts, formatPrice } from '@/lib/products';
import { Product } from '@/types/product';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Search as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      const searchResults = searchProducts(query).slice(0, 5);
      setResults(searchResults);
      setSelectedIndex(-1);
    }, 100);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(`/products/${results[selectedIndex].handle}`);
          handleClose();
        } else if (query.trim()) {
          router.push(`/products?search=${encodeURIComponent(query)}`);
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, handleClose, router]);

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.handle}`);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Search Modal */}
      <div className="fixed inset-x-0 top-0 z-[101] flex justify-center pt-[15vh] px-4 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="w-full max-w-xl">
          {/* Search Input */}
          <div className="relative bg-background rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center border-b border-border">
              <Search className="ml-5 h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-4 py-4 text-lg bg-transparent outline-none placeholder:text-muted-foreground/60"
              />
              <button
                onClick={handleClose}
                className="mr-3 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="max-h-[50vh] overflow-y-auto">
                {results.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 text-left transition-colors',
                      'hover:bg-secondary/50',
                      selectedIndex === index && 'bg-secondary'
                    )}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].local.startsWith('/') ? product.images[0].local : `/${product.images[0].local}`}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.title}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                    </div>
                  </button>
                ))}

                {/* View all link */}
                <button
                  onClick={() => {
                    router.push(`/products?search=${encodeURIComponent(query)}`);
                    handleClose();
                  }}
                  className="w-full p-4 text-sm text-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors border-t border-border"
                >
                  View all results
                </button>
              </div>
            )}

            {/* No results */}
            {query && results.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No results found
              </div>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="mt-4 text-center text-xs text-white/50">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">esc</kbd> to close
            {results.length > 0 && (
              <span className="ml-3">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">↑↓</kbd> to navigate
              </span>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
