import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

const footerLinks = {
  shop: [
    { href: '/products', label: 'All Pieces' },
    { href: '/products?category=furniture', label: 'Furniture' },
    { href: '/products?category=lighting', label: 'Lighting' },
    { href: '/products?new=true', label: 'New Arrivals' },
  ],
  about: [
    { href: '/about', label: 'Our Story' },
    { href: '/visit', label: 'Visit Us' },
    { href: '/trade', label: 'Trade Program' },
    { href: '/contact', label: 'Contact' },
  ],
  help: [
    { href: '/shipping', label: 'Shipping' },
    { href: '/returns', label: 'Returns' },
    { href: '/faq', label: 'FAQ' },
    { href: '/care', label: 'Care Guide' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary mt-32">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-heading mb-4">
              Join the Collection
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg">
              Be the first to discover new arrivals, exclusive pieces, and stories
              from the world of vintage design.
            </p>
            <form className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background border-border focus:border-foreground h-12 px-4"
              />
              <Button className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90">
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 mb-8 lg:mb-0">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-heading">Sunbeam</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              Curated vintage and mid-century modern furniture for those who
              appreciate the beauty of timeless design.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[11px] font-sans uppercase tracking-widest-custom text-muted-foreground mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 hover:text-foreground underline-animation transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-[11px] font-sans uppercase tracking-widest-custom text-muted-foreground mb-6">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 hover:text-foreground underline-animation transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-[11px] font-sans uppercase tracking-widest-custom text-muted-foreground mb-6">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 hover:text-foreground underline-animation transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1800px] px-6 md:px-12 lg:px-20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Sunbeam. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
