/**
 * @file Index.tsx
 * @modified 2026-07-13
 * @authors Marcelo Arana + GitHub Copilot GPT-5.3-Codex
 * @reason Registrar tentativa de otimizacao de layout revertida por regressao de LCP
 * @objective Manter a composicao original da landing sem alterar UI/UX
 * @solution Preservar estrutura de secoes original e documentar o rollback no relatorio tecnico
 */
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightSection } from "@/components/sections/HighlightSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CTABannerSection } from "@/components/sections/CTABannerSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TransformationSection } from "@/components/sections/TransformationSection";
import { OfferSection } from "@/components/sections/OfferSection";
import { ObjectionsSection } from "@/components/sections/ObjectionsSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { AuthorSection } from "@/components/sections/AuthorSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HighlightSection />
      <HowItWorksSection />
      <StatsSection />
      <CTABannerSection />
      <TestimonialsSection />
      <TransformationSection />
      <OfferSection />
      <ObjectionsSection />
      <ComparisonSection />
      <AuthorSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
};

export default Index;
