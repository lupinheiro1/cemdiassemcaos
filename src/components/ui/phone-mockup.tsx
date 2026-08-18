/**
 * @file phone-mockup.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason A reforma da página de vendas (protótipo aprovado em design/) introduz prints
 *         reais do app dentro de uma moldura de celular em 2 seções (Hero e Como Funciona,
 *         4 usos no total) — sem esse componente, a moldura (notch, bordas, sombra) ficaria
 *         duplicada em cada seção.
 * @objective Moldura de celular reutilizável pra exibir uma screenshot real do app.
 * @solution Componente simples só com a "casca" (bezel escuro, cantos arredondados),
 *           recebendo a imagem real via props — sem recriar a UI do app em CSS, como fazia
 *           o protótipo. Sem notch sobreposto: as screenshots são capturas reais de tela
 *           (já incluem a barra de status do Android), então um notch desenhado por cima
 *           duplicaria esse elemento.
 */
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  src: string;
  alt: string;
  size?: "default" | "sm";
  className?: string;
}

export const PhoneMockup = ({ src, alt, size = "default", className }: PhoneMockupProps) => {
  return (
    <div
      className={cn(
        "relative mx-auto shrink-0 rounded-[36px] bg-[#161311] p-2.5 shadow-[0_30px_60px_-18px_rgba(30,20,10,.45),0_10px_20px_-10px_rgba(0,0,0,.25)]",
        size === "default" ? "w-[280px]" : "w-[230px]",
        className
      )}
    >
      <div
        className={cn(
          "overflow-hidden rounded-[28px] bg-muted",
          size === "default" ? "h-[560px]" : "h-[460px]"
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
};
