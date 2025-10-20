'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface PurchaseButtonProps {
  courseId: string;
  price: number;
  isEnrolled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function PurchaseButton({
  courseId,
  price,
  isEnrolled = false,
  variant = 'default',
  size = 'default',
  className
}: PurchaseButtonProps) {
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      maximumFractionDigits: 0
    }).format(price);
  };

  // If already enrolled, show different button
  if (isEnrolled) {
    return (
      <Button 
        asChild
        variant="outline"
        size={size}
        className={className}
      >
        <Link href={`/courses/${courseId}/learn`}>
          Kurzus folytatása
        </Link>
      </Button>
    );
  }

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <Button 
        asChild
        variant={variant}
        size={size}
        className={className}
      >
        <Link href={`/login?redirect=${encodeURIComponent(`/courses/${courseId}/purchase`)}`}>
          <CreditCard className="w-4 h-4 mr-2" />
          Vásárlás - {formatPrice(price)}
        </Link>
      </Button>
    );
  }

  // Authenticated user, direct to purchase page
  return (
    <Button 
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <Link href={`/courses/${courseId}/purchase`}>
        <ShoppingCart className="w-4 h-4 mr-2" />
        Vásárlás - {formatPrice(price)}
      </Link>
    </Button>
  );
}