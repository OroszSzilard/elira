'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedCheckoutButton } from './EnhancedCheckoutButton';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Users,
  BookOpen,
  Award,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  originalPrice?: number;
  currency: string;
  interval: 'month' | 'year';
  popular?: boolean;
  premium?: boolean;
  features: PlanFeature[];
  limits: {
    courses?: number | 'unlimited';
    certificates?: boolean;
    support?: 'basic' | 'priority' | 'premium';
    downloads?: boolean;
    mobileAccess?: boolean;
  };
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Alap',
    description: 'Kezdőknek és alkalmi tanulóknak',
    priceId: 'price_basic_monthly',
    price: 2990,
    currency: 'HUF',
    interval: 'month',
    features: [
      { name: '5 kurzus/hó', included: true },
      { name: 'Alapvető tanúsítványok', included: true },
      { name: 'Mobilalkalmazás hozzáférés', included: true },
      { name: 'Email támogatás', included: true },
      { name: 'Letöltés offline használatra', included: false },
      { name: 'Prioritás támogatás', included: false },
      { name: 'Prémium kurzusok', included: false },
      { name: 'Élő webinárok', included: false }
    ],
    limits: {
      courses: 5,
      certificates: true,
      support: 'basic',
      downloads: false,
      mobileAccess: true
    }
  },
  {
    id: 'pro',
    name: 'Profi',
    description: 'Aktív tanulóknak és szakembereknek',
    priceId: 'price_pro_monthly',
    price: 5990,
    originalPrice: 7990,
    currency: 'HUF',
    interval: 'month',
    popular: true,
    features: [
      { name: 'Korlátlan kurzus hozzáférés', included: true },
      { name: 'Minden tanúsítvány', included: true },
      { name: 'Mobilalkalmazás hozzáférés', included: true },
      { name: 'Prioritás email támogatás', included: true },
      { name: 'Letöltés offline használatra', included: true },
      { name: 'Prémium kurzusok', included: true },
      { name: 'Élő webinárok', included: true },
      { name: 'Személyes mentor', included: false }
    ],
    limits: {
      courses: 'unlimited',
      certificates: true,
      support: 'priority',
      downloads: true,
      mobileAccess: true
    }
  },
  {
    id: 'enterprise',
    name: 'Vállalati',
    description: 'Csapatoknak és vállalatoknak',
    priceId: 'price_enterprise_monthly',
    price: 12990,
    currency: 'HUF',
    interval: 'month',
    premium: true,
    features: [
      { name: 'Korlátlan kurzus hozzáférés', included: true },
      { name: 'Minden tanúsítvány', included: true },
      { name: 'Mobilalkalmazás hozzáférés', included: true },
      { name: 'Prémium támogatás 24/7', included: true },
      { name: 'Letöltés offline használatra', included: true },
      { name: 'Prémium kurzusok', included: true },
      { name: 'Élő webinárok', included: true },
      { name: 'Személyes mentor', included: true },
      { name: 'Csapat analytics', included: true },
      { name: 'Egyedi kurzusok', included: true }
    ],
    limits: {
      courses: 'unlimited',
      certificates: true,
      support: 'premium',
      downloads: true,
      mobileAccess: true
    }
  }
];

interface SubscriptionPlansProps {
  plans?: SubscriptionPlan[];
  showYearlyToggle?: boolean;
  className?: string;
}

export function SubscriptionPlans({ 
  plans = defaultPlans, 
  showYearlyToggle = true,
  className 
}: SubscriptionPlansProps) {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (price: number, currency: string, interval: string) => {
    const yearlyPrice = Math.round(price * 12 * 0.8); // 20% discount for yearly
    const displayPrice = isYearly ? yearlyPrice : price;
    const displayInterval = isYearly ? 'év' : 'hó';
    
    return {
      amount: new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: currency.toUpperCase(),
        maximumFractionDigits: 0
      }).format(displayPrice),
      interval: displayInterval,
      savings: isYearly ? Math.round(price * 12 - yearlyPrice) : 0
    };
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <BookOpen className="w-6 h-6" />;
      case 'pro':
        return <Zap className="w-6 h-6" />;
      case 'enterprise':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanCardStyles = (plan: SubscriptionPlan) => {
    if (plan.premium) {
      return 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg';
    }
    if (plan.popular) {
      return 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md';
    }
    return 'border-border';
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Válassza ki az Ön számára megfelelő csomagot</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Kezdje el tanulási útját még ma, és szerezzen hozzáférést több ezer kurzushoz
        </p>

        {/* Yearly toggle */}
        {showYearlyToggle && (
          <div className="flex items-center justify-center space-x-4 p-1 bg-muted rounded-lg max-w-sm mx-auto">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                !isYearly ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
            >
              Havi
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2",
                isYearly ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
            >
              <span>Éves</span>
              <Badge variant="secondary" className="text-xs">-20%</Badge>
            </button>
          </div>
        )}
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const pricing = formatPrice(plan.price, plan.currency, plan.interval);
          const discountedPricing = plan.originalPrice 
            ? formatPrice(plan.originalPrice, plan.currency, plan.interval)
            : null;

          return (
            <Card 
              key={plan.id} 
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg",
                getPlanCardStyles(plan)
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium">
                  <Star className="w-3 h-3 inline mr-1" />
                  Legnépszerűbb
                </div>
              )}

              {/* Premium badge */}
              {plan.premium && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-medium">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Prémium
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    plan.premium ? "bg-purple-100 text-purple-600" :
                    plan.popular ? "bg-blue-100 text-blue-600" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {plan.description}
                    </CardDescription>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-baseline space-x-2">
                    {discountedPricing && (
                      <span className="text-lg text-muted-foreground line-through">
                        {discountedPricing.amount}
                      </span>
                    )}
                    <span className="text-3xl font-bold">
                      {pricing.amount}
                    </span>
                    <span className="text-muted-foreground">
                      /{pricing.interval}
                    </span>
                  </div>
                  
                  {isYearly && pricing.savings > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Éves megtakarítás: {new Intl.NumberFormat('hu-HU', {
                        style: 'currency',
                        currency: plan.currency.toUpperCase(),
                        maximumFractionDigits: 0
                      }).format(pricing.savings)}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Quick stats */}
                <div className="flex items-center justify-around text-center text-sm border rounded-lg p-3 bg-background/50">
                  <div>
                    <div className="font-semibold">
                      {plan.limits.courses === 'unlimited' ? '∞' : plan.limits.courses}
                    </div>
                    <div className="text-muted-foreground text-xs">Kurzus</div>
                  </div>
                  <div className="border-l h-8"></div>
                  <div>
                    <div className="font-semibold">
                      {plan.limits.certificates ? '✓' : '✗'}
                    </div>
                    <div className="text-muted-foreground text-xs">Tanúsítvány</div>
                  </div>
                  <div className="border-l h-8"></div>
                  <div>
                    <div className="font-semibold capitalize">
                      {plan.limits.support}
                    </div>
                    <div className="text-muted-foreground text-xs">Támogatás</div>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Minden csomag tartalmazza:</h4>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <span className={cn(
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.features.length > 6 && (
                    <p className="text-xs text-muted-foreground">
                      +{plan.features.length - 6} további funkció...
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <EnhancedCheckoutButton
                  priceId={plan.priceId}
                  mode="subscription"
                  title={`${plan.name} előfizetés`}
                  discountedPrice={plan.price}
                  originalPrice={plan.originalPrice}
                  currency={plan.currency}
                  variant={plan.premium ? 'premium' : plan.popular ? 'primary' : 'default'}
                  features={plan.features.filter(f => f.included).map(f => f.name)}
                  metadata={{
                    planId: plan.id,
                    planName: plan.name,
                    interval: isYearly ? 'year' : 'month'
                  }}
                  className="w-full"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ or additional info */}
      <div className="text-center space-y-4 pt-8 border-t">
        <h3 className="text-lg font-semibold">Gyakran ismételt kérdések</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground max-w-4xl mx-auto">
          <div className="space-y-2">
            <p className="font-medium text-foreground">Bármikor lemondhatom az előfizetést?</p>
            <p>Igen, az előfizetését bármikor lemondhatja. A lemondás után a következő számlázási időszak végéig továbbra is hozzáférhet a tartalmakhoz.</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-foreground">Milyen fizetési módokat fogadnak el?</p>
            <p>Visa, Mastercard bankkártyákat, valamint banki átutalást fogadunk el. Minden fizetés biztonságos SSL titkosítással történik.</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-foreground">Van ingyenes próbaidőszak?</p>
            <p>Igen, minden új felhasználó számára 7 napos ingyenes próbaidőszakot biztosítunk. A próbaidőszak alatt bármikor lemondható.</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-foreground">Hogyan működik a csapat előfizetés?</p>
            <p>A vállalati csomaggal több felhasználót adhat hozzá, központi számlázással és adminisztrációs felülettel.</p>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="flex items-center justify-center space-x-8 pt-6 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>30 napos pénzvisszafizetési garancia</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>10,000+ elégedett felhasználó</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4" />
          <span>Tanúsított kurzusok</span>
        </div>
      </div>
    </div>
  );
}