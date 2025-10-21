'use client';

import { PremiumHeader } from "@/components/PremiumHeader";
import { ConsistentPremiumHeroSection } from "@/components/consistent/ConsistentPremiumHeroSection";
import { ValueClaritySection } from "@/components/ValueClaritySection";
import { ServiceModelSelector } from "@/components/consistent/ServiceModelSelector";
import { CompanySizeProvider } from "@/components/CompanySizeSelector";
import { DynamicContent } from "@/components/DynamicContent";
import { ConsistentInteractiveProblemSolution } from "@/components/consistent/ConsistentInteractiveProblemSolution";
import { ResultsSocialProof } from "@/components/ResultsSocialProof";
import { ConsistentInteractiveHowItWorks } from "@/components/consistent/ConsistentInteractiveHowItWorks";
import { FreeAuditLeadMagnet } from "@/components/FreeAuditLeadMagnet";
import { ConsistentFeaturedMasterclassSpotlight } from "@/components/consistent/ConsistentFeaturedMasterclassSpotlight";
import { PlatformPreview } from "@/components/PlatformPreview";
import { ComparisonTable } from "@/components/consistent/ComparisonTable";
import { GeneralFAQ } from "@/components/GeneralFAQ";
import { PremiumTargetAudience } from "@/components/PremiumTargetAudience";
import { PremiumCTA } from "@/components/PremiumCTA";
import { CluelyHeroReplica } from "@/components/CluelyHeroReplica";
import { PremiumFooter } from "@/components/PremiumFooter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AuthProvider } from "@/contexts/AuthContext";

/**
 * ELIRA HOMEPAGE
 *
 * This is the redesigned homepage with ALL improvements applied:
 * ✅ Standardized button styles (dark gray-900 primary, outline secondary)
 * ✅ Contextual CTA copy (not just repeated buttons)
 * ✅ Unified card design language (glassmorphism for hero, flat for content)
 * ✅ Results-based social proof with metrics
 * ✅ Elevated guarantee visibility
 * ✅ Comparison table section (Videókurzus vs. Masterclass + Implementáció)
 * ✅ Removed CluelyHeroReplica duplication (single instance only)
 * ✅ Design tokens extracted for course player redesign
 * ✅ DWY vs DFY service model selector
 * ✅ Accurate consultation count (4 konzultáció)
 * ✅ Realistic FAQs
 */
export default function Home() {
  return (
    <AuthProvider>
      <CompanySizeProvider>
        <div className="min-h-screen">
          <ScrollProgress />
          <PremiumHeader />
          <main>
            {/* HERO - Consistent buttons, results-based social proof */}
            <ConsistentPremiumHeroSection />

            <ValueClaritySection />
            <ServiceModelSelector />

            {/* PROBLEM-SOLUTION - Contextual CTAs, consistent cards */}
            <ConsistentInteractiveProblemSolution />

            {/* Social proof with results */}
            <ResultsSocialProof />

            {/* HOW IT WORKS - Unified card design */}
            <ConsistentInteractiveHowItWorks />

            {/* Lead magnet */}
            <FreeAuditLeadMagnet />

            {/* MASTERCLASS - Elevated guarantee */}
            <ConsistentFeaturedMasterclassSpotlight />

            {/* Platform preview */}
            <PlatformPreview />

            {/* Comparison Table - Strategic addition */}
            <ComparisonTable />

            {/* FAQ */}
            <GeneralFAQ />

            {/* Personalized content - only after company size selection */}
            <DynamicContent>
              <PremiumTargetAudience />
              <PremiumCTA />
            </DynamicContent>

            {/* Cluely Hero Replica - SINGLE INSTANCE (no duplication) */}
            <CluelyHeroReplica />
          </main>
          <PremiumFooter />
        </div>
      </CompanySizeProvider>
    </AuthProvider>
  );
}
