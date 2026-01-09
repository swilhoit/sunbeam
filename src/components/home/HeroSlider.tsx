'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';

interface HeroSliderProps {
  products: Product[];
}

export function HeroSlider({ products }: HeroSliderProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-screen overflow-hidden bg-secondary">
      {/* Main Slider */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              {/* Background Image */}
              {product.images[0] && (
                <Image
                  src={product.images[0].original}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20 w-full">
                  <div className="max-w-xl">
                    <div
                      className={cn(
                        'transition-all duration-700',
                        selectedIndex === index
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                      )}
                    >
                      <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-foreground/70 mb-4">
                        Featured Piece
                      </p>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 leading-[1.1]">
                        {product.title}
                      </h2>
                      <p className="text-xl md:text-2xl font-serif text-foreground/80 mb-6">
                        ${product.price.toLocaleString()}
                      </p>
                      <Link
                        href={`/products/${product.handle}`}
                        className="inline-flex items-center gap-3 text-sm font-sans uppercase tracking-[0.2em] group bg-foreground text-background px-6 py-3 hover:bg-foreground/90 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              'h-1 transition-all duration-300',
              selectedIndex === index
                ? 'w-8 bg-foreground'
                : 'w-4 bg-foreground/30 hover:bg-foreground/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 text-sm font-sans tracking-wider text-foreground/60">
        <span className="text-foreground">{String(selectedIndex + 1).padStart(2, '0')}</span>
        <span className="mx-2">/</span>
        <span>{String(products.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
