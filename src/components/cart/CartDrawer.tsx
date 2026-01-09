'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const subtotal = getSubtotal();
  const freeShippingThreshold = 750;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-serif">Your Cart</h2>
              <span className="text-sm text-muted-foreground">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {items.length > 0 && (
            <div className="px-6 py-4 bg-secondary/50">
              {remainingForFreeShipping > 0 ? (
                <>
                  <p className="text-sm text-center mb-2">
                    Add <span className="font-medium">${remainingForFreeShipping.toFixed(0)}</span> more for free shipping
                  </p>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all duration-500"
                      style={{
                        width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-center font-medium">
                  You&apos;ve unlocked free shipping!
                </p>
              )}
            </div>
          )}

          {/* Cart Items */}
          <ScrollArea className="flex-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 px-6">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-6" />
                <p className="text-lg font-serif mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground text-center mb-8">
                  Discover our curated collection of vintage furniture and decor.
                </p>
                <Button onClick={closeCart} asChild>
                  <Link href="/products">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 py-4 border-b border-border last:border-0"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.handle}`}
                      onClick={closeCart}
                      className="relative w-24 h-24 bg-secondary flex-shrink-0 overflow-hidden"
                    >
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0].original}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.handle}`}
                        onClick={closeCart}
                        className="font-serif text-sm hover:underline line-clamp-2"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${item.product.price.toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs text-muted-foreground hover:text-foreground underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-serif">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button className="w-full" size="lg">
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button
                onClick={closeCart}
                className="w-full text-sm text-muted-foreground hover:text-foreground underline text-center"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
