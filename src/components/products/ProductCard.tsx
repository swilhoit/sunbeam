'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/products';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <article className="fade-up">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-5">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}

          <Link href={`/products/${product.handle}`}>
            {/* Primary Image */}
            {primaryImage && (
              <Image
                src={primaryImage.original}
                alt={product.title}
                fill
                className={`object-cover gallery-image transition-opacity duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } ${isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onLoad={() => setImageLoaded(true)}
              />
            )}

            {/* Secondary Image (on hover) */}
            {secondaryImage && (
              <Image
                src={secondaryImage.original}
                alt={`${product.title} - alternate view`}
                fill
                className={`object-cover gallery-image transition-opacity duration-700 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}

            {/* Hover Overlay */}
            <div
              className={`absolute inset-0 bg-foreground/5 transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full transition-all duration-300',
              isHovered || isWishlisted ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          </button>

          {/* Quick Actions */}
          <div
            className={cn(
              'absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-500',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            <Link
              href={`/products/${product.handle}`}
              className="flex-1 py-3 text-center text-[11px] font-sans uppercase tracking-widest-custom bg-background/95 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
            >
              View Details
            </Link>
            <button
              onClick={handleAddToCart}
              className="w-12 flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <Link href={`/products/${product.handle}`} className="block space-y-1.5">
          {/* Vendor */}
          <p className="text-[10px] font-sans uppercase tracking-widest-custom text-muted-foreground">
            {product.vendor}
          </p>

          {/* Title */}
          <h3 className="text-base font-heading text-foreground leading-snug line-clamp-2 group-hover:text-foreground/80 transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-sans text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm font-sans text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </Link>
      </article>
    </div>
  );
}
