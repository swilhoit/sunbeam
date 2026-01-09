'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/products', label: 'Collection' },
  { href: '/products?category=furniture', label: 'Furniture' },
  { href: '/products?category=lighting', label: 'Lighting' },
  { href: '/products?category=decor', label: 'Decor' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20">
        <div className="relative flex items-center h-20 md:h-24">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] bg-background p-0">
                <div className="flex flex-col h-full pt-20 px-8">
                  <nav className="flex flex-col space-y-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-serif text-foreground hover:text-muted-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto pb-12">
                    <p className="text-sm text-muted-foreground">
                      Curated vintage furniture for the modern home.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation - Left */}
          <nav className="hidden lg:flex items-center space-x-10 flex-1">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-sans uppercase tracking-widest-custom text-foreground/80 hover:text-foreground underline-animation transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mx-auto">
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight">
              Sunbeam
            </h1>
          </Link>

          {/* Desktop Navigation - Right + Actions */}
          <div className="hidden lg:flex items-center space-x-10 flex-1 justify-end">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-sans uppercase tracking-widest-custom text-foreground/80 hover:text-foreground underline-animation transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-6">
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Search className="h-5 w-5" strokeWidth={1.5} />
                <span className="sr-only">Search</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-transparent relative">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                <span className="sr-only">Cart</span>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                  0
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-4 ml-auto">
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <Search className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-transparent relative">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Cart</span>
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
