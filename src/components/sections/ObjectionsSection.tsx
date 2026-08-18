/**
 * @file ObjectionsSection.tsx
 * @modified 2026-08-17
 * @authors Luiza Machado + Claude Sonnet 5
 * @reason Reforma da página de vendas (protótipo aprovado em design/): a 1ª objeção
 *         citava "reta final da gravidez", linguagem cortada da página inteira (o produto
 *         serve pra qualquer semana de gestação); e surgiu uma objeção nova, específica de
 *         ser um app agora ("vou ter que aprender a usar mais um aplicativo?").
 * @objective Resposta da 1ª objeção ajustada; nova 2ª objeção sobre o app. As demais (não
 *            é o momento / já fiz um curso / medo de não dar conta) continuam como
 *            estavam (ver design/100-dias-sem-caos-copy-pagina-vendas_4.md, seção 11:
 *            "continuam válidas como estão") — só corrigido "Este livro é o seu colete"
 *            pra "app", que ficou desatualizado depois que o produto deixou de ser livro.
 * @solution O protótipo HTML só mostra 4 cards (achou que só a "já fiz um curso" tinha
 *           saído da lista) mas o .md confirma explicitamente que ela continua válida — os
 *           5 objeções ficam mantidas aqui, o .md é a fonte de verdade de copy.
 */
import { Search, MessageCircle, Clock, BookOpen, Heart } from "lucide-react";

const objections = [
  {
    icon: Search,
    title: '"Posso encontrar isso de graça na internet"',
    response:
      "A internet é um oceano de informações — mas o que você precisa durante a gravidez não é mais informação. É direção, e um lugar pra guardar o que você já decidiu. A maioria das mães passa horas buscando vídeos e textos que se contradizem, anota em lugares diferentes e depois não lembra onde parou. O 100 Dias Sem Caos não é só conteúdo — é um app que organiza esse conteúdo em passos, guarda seu progresso e te mostra exatamente onde você está. Algo que Google nenhum entrega.",
  },
  {
    icon: MessageCircle,
    title: '"Vou ter que aprender a usar mais um aplicativo?"',
    response:
      "Não tem curva de aprendizado. Depois da compra, o acesso chega no seu e-mail e, com poucos toques, o app já fica pronto no seu celular — do lado dos que você já usa. Não precisa criar senha: o acesso é feito direto pelo seu e-mail. Se você sabe usar o WhatsApp, sabe usar o 100 Dias Sem Caos.",
  },
  {
    icon: Clock,
    title: '"Não é o meu momento / não tenho tempo"',
    response:
      'Se sua vida já é corrida agora, imagina com um bebê recém-nascido? A ideia de esperar "ter tempo" é ilusória. A preparação para o pós-parto é negligenciada por 90% das gestantes — e essa é uma das principais causas de crises no puerpério. O 100 Dias Sem Caos foi criado justamente para isso: preparar você antes da avalanche. É um plano prévio para que o depois seja mais leve, seguro e possível.',
  },
  {
    icon: BookOpen,
    title: '"Já fiz um curso e não usei"',
    response:
      "O problema provavelmente não era você — era o curso. A maioria dos cursos de maternidade foca em teoria, protocolos ou romantização. O 100 Dias Sem Caos não é isso. Ele foi criado com base na realidade crua do puerpério, com linguagem prática, emocional e direta. É leve, modular e focado no que você realmente vai viver (com uma boa dose de carinho).",
  },
  {
    icon: Heart,
    title: '"Tenho medo de não dar conta"',
    response:
      'O medo de não dar conta é o sentimento mais comum e legítimo entre mães nos primeiros 100 dias. É como estar com medo de nadar e decidir não usar o colete salva-vidas porque "vai que eu me afogo mesmo assim". O 100 Dias Sem Caos é o seu colete. Ele não impede que o mar agite — mas impede que você afunde. Você não precisa dar conta sozinha. Você só precisa de apoio certo, na hora certa.',
  },
];

export const ObjectionsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-lavender-light">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            O que pode estar te impedindo
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            (e por que não precisa mais)
          </p>

          <div className="space-y-6">
            {objections.map((item) => (
              <div
                key={item.title}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-lavender rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xl font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.response}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
