'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown, ChevronRight, Heart, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { navigation, secondaryNavigation, getCategoryImage, NavCategory } from '@/lib/navigation';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';

// Category Card Component for visual mega menu
interface CategoryCardProps {
  category: NavCategory;
  index: number;
  onClick?: () => void;
}

function CategoryCard({ category, index, onClick }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = category.image || getCategoryImage(category.label);

  return (
    <Link
      href={category.href}
      className="group relative overflow-hidden bg-secondary aspect-[4/5]"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={category.label}
        fill
        className={cn(
          'object-cover transition-transform duration-700',
          isHovered && 'scale-105'
        )}
        sizes="(max-width: 768px) 50vw, 20vw"
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          'bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent',
          isHovered && 'from-foreground/90'
        )}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3
          className={cn(
            'font-heading text-background text-lg transition-all duration-300',
            isHovered && '-translate-y-1'
          )}
        >
          {category.label}
        </h3>

        {/* Item count on hover */}
        <p
          className={cn(
            'text-xs text-background/80 mt-1 transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          {category.items.length} items
        </p>
      </div>
    </Link>
  );
}

// Mobile Category Card (smaller version)
function MobileCategoryCard({ category, onClick }: { category: NavCategory; onClick?: () => void }) {
  const imageUrl = category.image || getCategoryImage(category.label);

  return (
    <Link
      href={category.href}
      onClick={onClick}
      className="relative aspect-square overflow-hidden bg-secondary"
    >
      <Image
        src={imageUrl}
        alt={category.label}
        fill
        className="object-cover"
        sizes="45vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h4 className="text-sm font-heading text-background">{category.label}</h4>
      </div>
    </Link>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const pathname = usePathname();
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  // Determine if we're on a shop/products page (should always have dark text)
  const isShopMode = pathname?.startsWith('/products');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut to open search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine if header should have solid background (scrolled or dropdown open)
  const hasDropdownOpen = activeDropdown !== null;
  // In shop mode, always use solid background styling (dark text)
  const hasSolidBg = isShopMode || isScrolled || hasDropdownOpen;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        hasSolidBg
          ? 'bg-background border-b border-border'
          : 'bg-gradient-to-b from-black/40 via-black/20 to-transparent'
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
          <div className={cn(
            'lg:hidden transition-colors duration-300',
            hasSolidBg ? 'text-foreground' : 'text-white'
          )}>
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
                                <div className="bg-secondary/30 p-4">
                                  {/* Visual Category Grid */}
                                  <div className="grid grid-cols-2 gap-3 mb-4">
                                    {section.categories.slice(0, 4).map((category) => (
                                      <MobileCategoryCard
                                        key={category.label}
                                        category={category}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      />
                                    ))}
                                  </div>

                                  {/* Text Links for All Categories */}
                                  <div className="space-y-3 pt-3 border-t border-border">
                                    {section.categories.map((category) => (
                                      <div key={category.label}>
                                        <Link
                                          href={category.href}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                          className="text-sm font-medium text-foreground block py-1"
                                        >
                                          {category.label}
                                        </Link>
                                        <div className="pl-3 space-y-1">
                                          {category.items.slice(0, 4).map((item) => (
                                            <Link
                                              key={item.href}
                                              href={item.href}
                                              onClick={() => setIsMobileMenuOpen(false)}
                                              className="text-xs text-muted-foreground hover:text-foreground block py-1"
                                            >
                                              {item.label}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
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
            <h1 className={cn(
              'text-xl md:text-2xl font-heading tracking-tight whitespace-nowrap transition-colors duration-300',
              hasSolidBg ? 'text-foreground' : 'text-white'
            )}>
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
                    'flex items-center gap-1 px-4 py-2 text-[13px] uppercase tracking-wider transition-colors duration-300',
                    section.label === 'Sale'
                      ? hasSolidBg ? 'text-red-600 hover:text-red-700' : 'text-red-400 hover:text-red-300'
                      : hasSolidBg ? 'text-foreground/80 hover:text-foreground' : 'text-white/90 hover:text-white'
                  )}
                >
                  {section.label}
                  {section.hasDropdown && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className={cn(
            'flex items-center space-x-1 ml-auto transition-colors duration-300',
            hasSolidBg ? 'text-foreground' : 'text-white'
          )}>
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent"
              onClick={() => setIsSearchOpen(true)}
            >
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
                <span className={cn(
                  'absolute -top-1 -right-1 h-5 w-5 rounded-full text-[11px] flex items-center justify-center font-medium',
                  hasSolidBg ? 'bg-foreground text-background' : 'bg-white text-black'
                )}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Divider line under nav - only visible on hero (transparent header) */}
        {!hasSolidBg && (
          <div className="hidden lg:block border-b border-white/20" />
        )}
      </div>

      {/* Full-Width Mega Menu Dropdowns */}
      {navigation.map((section) => (
        section.hasDropdown && section.categories && (
          <div
            key={section.label}
            className={cn(
              'absolute left-0 right-0 bg-background border-b border-border shadow-xl transition-all duration-300 overflow-hidden',
              activeDropdown === section.label
                ? 'opacity-100 visible max-h-[600px]'
                : 'opacity-0 invisible max-h-0 pointer-events-none'
            )}
            onMouseEnter={() => setActiveDropdown(section.label)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20 py-8">
              {/* Category Image Cards */}
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {section.categories.map((category, index) => (
                  <CategoryCard
                    key={category.label}
                    category={category}
                    index={index}
                    onClick={() => setActiveDropdown(null)}
                  />
                ))}
              </div>

              {/* Subcategory Links */}
              <div className="border-t border-border pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-4">
                  {section.categories.map((category) => (
                    <div key={category.label}>
                      <Link
                        href={category.href}
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-medium uppercase tracking-wider text-foreground hover:text-muted-foreground mb-2 block"
                      >
                        {category.label}
                      </Link>
                      <ul className="space-y-1">
                        {category.items.slice(0, 5).map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={cn(
                                'text-sm transition-colors block py-0.5',
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
            </div>
          </div>
        )
      ))}

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
