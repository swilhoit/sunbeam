'use client';

import { useState } from 'react';
import { Heart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-secondary transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-6 py-3 text-sm min-w-[3rem] text-center border-x border-border">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-secondary transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart & Wishlist */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 h-14 text-sm uppercase tracking-[0.15em] bg-foreground text-background hover:bg-foreground/90"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            'h-14 w-14 border-border',
            isWishlisted && 'border-red-500'
          )}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart
            className={cn(
              'h-5 w-5',
              isWishlisted ? 'fill-red-500 text-red-500' : ''
            )}
          />
        </Button>
      </div>
    </div>
  );
}
