import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const navigation = {
  platform: [
    { name: "Kurzusok", href: "/courses" },
    { name: "Karrierutak", href: "/career-paths" },
    { name: "Trending", href: "/trending" },
    { name: "Egyetemek", href: "/universities" },
  ],
  hallgatoknak: [
    { name: "Leendő hallgatóknak", href: "/leendo-hallgatoknak" },
    { name: "Hallgatóknak", href: "/hallgatoknak" },
    { name: "Karrier fejlesztés", href: "/career-paths" },
    { name: "Bizonyítványok", href: "/certificates" },
  ],
  partnereknek: [
    { name: "Vállalati partnereknek", href: "/vallalati-partnereknek" },
    { name: "Munkatársaknak", href: "/munkatarsaknak" },
    { name: "Egyetemi partnerek", href: "/universities" },
    { name: "Oktatóknak", href: "/instructor" },
  ],
  support: [
    { name: "Segítség", href: "/help" },
    { name: "Kapcsolat", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Támogatás", href: "/support" },
  ],
  legal: [
    { name: "Adatvédelem", href: "/privacy" },
    { name: "ÁSZF", href: "/terms" },
    { name: "Cookie szabályzat", href: "/cookies" },
    { name: "Licenc", href: "/license" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://facebook.com/elira",
      icon: Facebook,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/elira",
      icon: Linkedin,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@elira",
      icon: Youtube,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/elira",
      icon: Instagram,
    },
  ],
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800", className)}>
      {/* Main Footer Content */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Elira</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Magyarország legjobb oktatási platformja. Fedezzen fel hiteles magyarországi egyetemi kurzusokat és szerezzen elismert bizonyítványokat.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="space-y-2">
              {navigation.platform.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hallgatóknak */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Hallgatóknak</h3>
            <ul className="space-y-2">
              {navigation.hallgatoknak.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnereknek */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Partnereknek</h3>
            <ul className="space-y-2">
              {navigation.partnereknek.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Támogatás</h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-900">Jogi</h3>
              <ul className="space-y-2 mt-2">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">info@elira.hu</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Telefon</p>
                <p className="text-sm text-gray-600">+36 1 234 5678</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Cím</p>
                <p className="text-sm text-gray-600">Budapest, Magyarország</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Elira. Minden jog fenntartva.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-primary transition-colors duration-200">
                Adatvédelem
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors duration-200">
                ÁSZF
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors duration-200">
                Cookie szabályzat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 