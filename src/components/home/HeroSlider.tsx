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

              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Content - Bottom Left Corner */}
              <div className="relative z-10 h-full flex items-end pb-24 md:pb-20">
                <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20 w-full">
                  <div
                    className={cn(
                      'transition-all duration-700',
                      selectedIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    )}
                  >
                    <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/60 mb-2">
                      Featured
                    </p>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-heading mb-1.5 leading-[1.2] text-white max-w-md">
                      {product.title}
                    </h2>
                    <p className="text-sm font-heading text-white/70 mb-4">
                      ${product.price.toLocaleString()}
                    </p>
                    <Link
                      href={`/products/${product.handle}`}
                      className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] group text-white hover:text-white/80 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Minimal elegant style */}
      <button
        onClick={scrollPrev}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              'h-0.5 transition-all duration-300',
              selectedIndex === index
                ? 'w-6 bg-white'
                : 'w-3 bg-white/40 hover:bg-white/60'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 text-xs font-sans tracking-wider text-white/60">
        <span className="text-white">{String(selectedIndex + 1).padStart(2, '0')}</span>
        <span className="mx-1.5">/</span>
        <span>{String(products.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
