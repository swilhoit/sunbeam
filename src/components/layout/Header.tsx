'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown, ChevronRight, Heart, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigation, secondaryNavigation } from '@/lib/navigation';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      {/* Announcement Bar */}
      <div className="bg-foreground text-background text-center py-2 px-4">
        <p className="text-xs tracking-wide">
          FREE SHIPPING on all orders over $750 | <Link href="/visit" className="underline">Visit our LA showroom</Link>
        </p>
      </div>

      <div className="mx-auto max-w-[1800px] px-4 md:px-8 lg:px-12">
        <div className="relative flex items-center h-16 md:h-20">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent -ml-2">
                  <Menu className="h-6 w-6" strokeWidth={1.5} />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] bg-background p-0">
                <ScrollArea className="h-full">
                  <div className="flex flex-col pt-16 pb-8">
                    {/* Mobile Navigation */}
                    <nav className="flex flex-col">
                      {navigation.map((section) => (
                        <div key={section.label} className="border-b border-border">
                          {section.hasDropdown ? (
                            <>
                              <button
                                onClick={() =>
                                  setMobileExpandedSection(
                                    mobileExpandedSection === section.label
                                      ? null
                                      : section.label
                                  )
                                }
                                className="flex items-center justify-between w-full px-6 py-4 text-left"
                              >
                                <span className="text-base font-heading">{section.label}</span>
                                <ChevronDown
                                  className={cn(
                                    'h-4 w-4 transition-transform',
                                    mobileExpandedSection === section.label && 'rotate-180'
                                  )}
                                />
                              </button>
                              {mobileExpandedSection === section.label && section.categories && (
                                <div className="bg-secondary/30 pb-4">
                                  {section.categories.map((category) => (
                                    <div key={category.label} className="px-6 py-2">
                                      <Link
                                        href={category.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-sm font-medium text-foreground block py-2"
                                      >
                                        {category.label}
                                      </Link>
                                      <div className="pl-4 space-y-1">
                                        {category.items.map((item) => (
                                          <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-sm text-muted-foreground hover:text-foreground block py-1.5"
                                          >
                                            {item.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={section.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-6 py-4 text-base font-heading"
                            >
                              {section.label}
                            </Link>
                          )}
                        </div>
                      ))}
                    </nav>

                    {/* Secondary Navigation */}
                    <div className="mt-6 px-6 space-y-3">
                      {secondaryNavigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-sm text-muted-foreground hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 px-6 pt-6 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Visit Our Showroom</p>
                      <p className="text-sm">Los Angeles, CA</p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Mon-Sat 11am-6pm
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <h1 className="text-xl md:text-2xl font-heading tracking-tight whitespace-nowrap">
              Sunbeam Vintage
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center ml-12 space-x-1">
            {navigation.map((section) => (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => section.hasDropdown && setActiveDropdown(section.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={section.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 text-[13px] uppercase tracking-wider transition-colors',
                    section.label === 'Sale'
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-foreground/80 hover:text-foreground'
                  )}
                >
                  {section.label}
                  {section.hasDropdown && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Link>

                {/* Mega Menu Dropdown */}
                {section.hasDropdown && section.categories && (
                  <div
                    className={cn(
                      'absolute top-full left-0 w-[800px] bg-background border border-border shadow-xl transition-all duration-200 -ml-4',
                      activeDropdown === section.label
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    )}
                  >
                    <div className="grid grid-cols-4 gap-8 p-8">
                      {section.categories.map((category) => (
                        <div key={category.label}>
                          <Link
                            href={category.href}
                            className="text-sm font-medium uppercase tracking-wider hover:text-muted-foreground mb-4 block"
                          >
                            {category.label}
                          </Link>
                          <ul className="space-y-2">
                            {category.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    'text-sm transition-colors block py-1',
                                    item.featured
                                      ? 'text-foreground font-medium'
                                      : 'text-muted-foreground hover:text-foreground'
                                  )}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1 ml-auto">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Search className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Search</span>
            </Button>

            {/* Account - Desktop only */}
            <Button variant="ghost" size="icon" className="hover:bg-transparent hidden md:flex">
              <User className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Account</span>
            </Button>

            {/* Wishlist - Desktop only */}
            <Button variant="ghost" size="icon" className="hover:bg-transparent hidden md:flex">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Wishlist</span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent relative"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-[11px] flex items-center justify-center font-medium">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
