'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  return (
    <Link
      href={`/products/${product.handle}`}
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

          {/* Quick View Button */}
          <div
            className={`absolute bottom-4 left-4 right-4 transition-all duration-500 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <span className="block w-full py-3 text-center text-[11px] font-sans uppercase tracking-widest-custom bg-background/95 backdrop-blur-sm text-foreground">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          {/* Vendor */}
          <p className="text-[10px] font-sans uppercase tracking-widest-custom text-muted-foreground">
            {product.vendor}
          </p>

          {/* Title */}
          <h3 className="text-base font-serif text-foreground leading-snug line-clamp-2 group-hover:text-foreground/80 transition-colors">
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
        </div>
      </article>
    </Link>
  );
}
