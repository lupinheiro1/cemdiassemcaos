/**
 * @file AuthorSection.tsx
 * @description Secao de apresentacao da autora com imagem de perfil.
 *
 * @changed_by GitHub Copilot (GPT-5.3-Codex)
 * @change_date 2026-07-13T00:00:00
 * @reason Evitar carga antecipada de imagem fora da dobra para melhorar LCP.
 * @changes
 *   - Define lazy/decode async/fetchpriority low na imagem da autora.
 *
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): a Luiza pediu pra
 *         cortar "(e algumas olheiras)" do título (ver
 *         design/100-dias-sem-caos-copy-pagina-vendas_4.md, v9, item 21); revisão de
 *         tipografia da página inteira tira a serifa dos títulos.
 * @objective Título só "Quem criou esse conteúdo com muito amor"; resto do conteúdo sem
 *            alterações.
 * @solution Removido o <span> com "(e algumas olheiras)". font-serif → font-sans.
 */
import { Heart, Star, Users } from "lucide-react";
import luizaPhoto from "@/assets/luiza-pinheiro.webp";

export const AuthorSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-peach-light to-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Quem criou esse conteúdo com muito amor
          </h2>

          <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Image placeholder */}
              <div className="md:w-1/3 bg-gradient-to-br from-rose-light to-peach-light flex items-center justify-center p-8">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src={luizaPhoto} 
                    alt="Luiza Pinheiro" 
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-8">
                <h3 className="font-sans text-2xl font-bold text-foreground mb-4">
                  Luiza Pinheiro
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ex-gerente de operações e atual especialista em{" "}
                  <strong className="text-foreground font-light">maternidade possível</strong>.
                </p>
                <p className="text-muted-foreground mb-4">
                  Mãe de dois, esposa de médico pediatra (que revisa todo o conteúdo),
                  e fundadora do <strong className="text-foreground font-light">Método Mãe Jardineira</strong> e criadora do projeto{" "}
                  <em>100 Dias Sem Caos</em>, ela trocou planilhas por paninhos de
                  ombro e descobriu que o amor materno não precisa ser acompanhado de
                  caos.
                </p>
                <p className="text-muted-foreground mb-6">
                  Por isso, criou um guia que ela mesma gostaria de ter tido. Seu
                  diferencial é unir conhecimento real da vida materna com linguagem
                  acessível, apoio emocional e foco na prática.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-sage-light rounded-full">
                    <Star className="w-4 h-4 text-sage" />
                    <span className="text-sm font-medium">4 anos de dedicação</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-rose-light rounded-full">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Dezenas de famílias impactadas</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-peach-light rounded-full">
                    <Heart className="w-4 h-4 text-accent-foreground" />
                    <span className="text-sm font-medium">Mãe de 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote banner */}
          <div className="bg-primary rounded-2xl p-8 mt-8 text-center">
            <p className="text-lg md:text-xl text-primary-foreground italic">
              "Porque toda mulher merece viver a melhor maternidade possível — a sua."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
