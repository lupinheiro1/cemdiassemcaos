import { CTAButton } from "@/components/ui/cta-button";

export const CTABannerSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-peach-light via-rose-light to-lavender-light">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <CTAButton className="text-lg md:text-xl">
            Quero Viver Meus 100 Dias Sem Caos
          </CTAButton>
        </div>
      </div>
    </section>
  );
};
