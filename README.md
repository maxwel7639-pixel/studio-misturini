# Misturini Studio — Giovani Misturini

Portfólio e apresentação do Misturini Studio, fotografia em Canoas/RS.
Casamentos cinematográficos e retratos corporativos de posicionamento.

**Stack:** HTML + CSS + JavaScript estático. Sem build, sem dependências.
É só publicar a pasta.

```bash
python -m http.server 3310
# http://127.0.0.1:3310
```

---

## ⚠️ O problema central deste site, e como resolvi

O briefing pede **peso igual para dois públicos**. Mas o material tem
**8 fotos de casamento e 1 retrato corporativo**. Se eu montasse duas galerias
iguais, a seção corporativa apareceria como uma grade quase vazia ao lado de
uma cheia — e o site diria, sem querer, que ele quase não faz retrato.

O que fiz em vez disso:

**1. A capa é um díptico, não uma foto só.** Casamento à esquerda, retrato à
direita, um CTA embaixo de cada. A separação dos dois públicos acontece na
primeira tela, que é exatamente o que o briefing pede — e o único retrato
corporativo ganha metade da capa, em vez de ficar perdido numa grade.
As duas fotos escolhidas têm proporção idêntica (0,594), então o díptico fecha
sem corte.

**2. A seção corporativa é editorial, não galeria.** Uma imagem grande ao lado
do texto forte (o gancho "Antes / Depois" que ele já usa no Instagram). Com uma
foto só, parece decisão de projeto — não falta de material.

**3. A galeria dele já está pronta para crescer.** Abaixo do bloco editorial há
uma `[data-galeria="corporativo"]` **vazia e escondida**. Quando chegarem novos
retratos, ela aparece sozinha. Ver *Como adicionar fotos*, abaixo.

## Como adicionar fotos (é copiar e colar)

Coloque o arquivo em `assets/img/` e cole um bloco destes dentro da galeria
certa no `index.html` — `[data-galeria="casamento"]` ou `[data-galeria="corporativo"]`:

```html
<figure class="foto">
  <img src="assets/img/corp-02-fulano.jpg" width="398" height="670"
       alt="Descreva quem aparece e como e a luz" loading="lazy" decoding="async">
  <figcaption>Legenda curta</figcaption>
</figure>
```

Não precisa mexer em CSS nem em JS:

- A galeria usa **colunas fluidas**, então a foto se encaixa sozinha em qualquer
  proporção — vertical, horizontal ou quadrada.
- O **lightbox lê as fotos do próprio DOM** e usa delegação de clique: a foto
  nova já abre ampliada, com as setas do teclado, sem tocar no `main.js`.
- A galeria corporativa está escondida por JS **enquanto não tiver nenhuma
  `<figure>`**. Basta a primeira entrar para ela aparecer.
- `width` e `height` são só para reservar espaço e evitar salto no carregamento;
  ponha as dimensões reais do arquivo.

## Pendências

### 1. ~~Falta a foto do Giovani~~ — resolvido no v2

O segundo lote trouxe o que faltava. Ver *O que mudou no v2*, abaixo.

### 2. Depoimentos

O briefing previa "1-2 depoimentos reais depois". Não há nenhum no material,
então **não inventei**: a prova social usa só o número verificável (4,9 em 47
avaliações). Quando ele mandar os prints do Google, entram numa faixa nova
antes do bloco de nota.

### 3. Duas fotos têm texto gravado

- `cas-01` (o beijo na igreja) vinha com **"CASAMENTOS CINEMATOGRÁFICOS ·
  Giovani Misturini"** gravado embaixo. Na galeria isso vira ruído — o site já
  diz isso no título da seção. **Recortei** a faixa do texto para a versão da
  galeria. A arte original **passou a ser usada**: é ela que a cortina da capa
  revela, e ali o título gravado funciona a favor — anuncia a seção que vem em
  seguida.
- `cas-03` (a noiva no corredor) tem gravado *"ela caminhava para o início de
  um novo capítulo"*. Essa **mantive**: lê-se como autoria, não como banner de
  divulgação. Se ele quiser sem, é o mesmo tipo de recorte.

### 4. Resolução das imagens — metade resolvida

As **fotos do Giovani e o logo** vieram em boa resolução no v2 (747–947px).
As **fotos de casamento e o retrato corporativo continuam entre 400 e 500px** —
provavelmente baixadas do Instagram. Servem no celular e na galeria, mas no
lightbox em tela grande já aparecem no limite. **Vale pedir os originais dessas**
antes de publicar: é o portfólio de um fotógrafo, e a nitidez é o produto.

### 5. Domínio

Canonical, Open Graph e JSON-LD apontam para `https://studio-misturini.vercel.app/`.
Se o domínio final for outro, trocar nesses três pontos do `<head>`.

> WhatsApp e Facebook cacheiam a **URL** da imagem de prévia. Se a
> `og-misturini.jpg` mudar, salvar com nome novo e atualizar as tags.

---

## O que mudou no v2

O segundo lote resolveu a maior pendência e trouxe três coisas que eu não tinha.

**1. O retrato do Giovani.** Era a pendência número 1. Ele aparece agora na seção
*O fotógrafo*, de braços cruzados com uma **Zenit analógica** — que casa com a
narrativa de fotojornalismo e fine art melhor do que qualquer foto posada com
equipamento digital. O "15 anos" deixou de ser um número solto e virou selo sobre
o próprio retrato.

**2. A bio, nas palavras dele.** Eu tinha escrito "jornalismo, fotografia técnica
e fine art" a partir do briefing. O texto dele diz **"fotojornalismo, fotografia
artística e o refinamento do Fine Art"**. Troquei pelo original — inclusive a
abertura *"Quem está por trás das suas melhores memórias? Muito prazer, eu sou
Giovani Misturini."*, que virou a linha de entrada da seção.

**3. A frase dele virou seção.** *"Não é só o que eu vejo pela lente — é o que eu
sinto ao transformar instantes em eternidade."* Ganhou uma faixa própria, ao lado
da foto dele olhando pelo visor — a foto casa literalmente com a frase. O texto
está em HTML, não gravado na imagem, então reflui no celular e é lido pelo Google.

**4. O logo oficial substituiu o desenho.** Eu tinha desenhado uma câmera em SVG
como marca provisória. Agora é a câmera do logo dele — com o fundo preto chapado
removido por alfa, para assentar em qualquer superfície escura — e o favicon foi
refeito a partir dela.

**5. O nome da marca mudou.** O logo diz **"Misturini Studio"**, e o briefing
também. O site usava "Estúdio Misturini" no título, no Open Graph e no rodapé.
Corrigi tudo para *Misturini Studio*; "Estúdio Misturini" ficou como
`alternateName` no JSON-LD, porque **é assim que o Google lista o negócio** — os
dois nomes precisam existir para a busca casar.

**6. O ouro foi ajustado.** A paleta vinha das fotos (matiz 33°). O logo usa um
dourado mais saturado e amarelo (`#CA9E33`, matiz 40°). Movi o token de `#C99A5B`
para **`#C99A4B`**, um meio-termo. Não adotei o amarelo do logo puro de propósito:
em texto pequeno sobre preto ele lê como "amarelo de aviso", não como premium —
e brigaria com o âmbar quente das fotos, que ocupam quase toda a página.

### ⚠️ Uma pergunta que o logo levantou

A assinatura do logo dele diz **"VÍDEOS E RETRATOS CORPORATIVOS"**.

**Vídeo não está em lugar nenhum do site** — nem no briefing, nem no material.
Não inventei uma seção sem ter o que mostrar, mas isso deixa uma incoerência: o
logo aparece no topo de todas as páginas anunciando um serviço que o site não
menciona.

Três saídas, e a escolha é dele:
1. Ele manda material de vídeo e vira uma terceira frente;
2. O site cita vídeo em uma linha na seção corporativa, sem galeria;
3. Fica como está, e o logo no cabeçalho segue só como marca — que é o mais
   provável, já que no tamanho do cabeçalho a linha da assinatura é ilegível
   (uso só a câmera do logo ali, não o lettering).

Vale perguntar ao Giovani, porque muda o posicionamento do negócio, não só o site.

## A capa é uma cortina

A capa não rola junto com a página: ela **trava na tela** e, conforme você rola,
os dois lados do díptico **abrem para fora** e revelam o pôster da seção de
casamentos atrás. Quando termina de abrir, a página segue para *Casamentos*.

Como está feito:

- A seção tem **230vh** de altura e o miolo (`.capa__fixo`) é `position: sticky`
  com `100vh`. O que "prende" a capa é essa diferença — não há bloqueio de
  rolagem, então o gesto do usuário continua sendo o normal do navegador.
- O progresso da rolagem dentro da seção (0 → 1) move tudo: os lados saem com
  `translate3d`, o pôster entra com `opacity` + `scale`, o título sai, e no fim
  a ponte para o outro público aparece. **Só `transform` e `opacity`**, dentro de
  um `requestAnimationFrame` — nada que force recálculo de layout a cada quadro.
- A curva é um *smoothstep*, não linear: sem isso o movimento "bate" nas pontas.
- Os dois lados têm **50,4%** de largura cada, então se sobrepõem 0,8% no centro
  e a emenda não aparece. (A primeira versão tinha uma faixa preta cobrindo a
  emenda; ela cortava o pôster ao meio depois que as cortinas abriam — removida.)

**O que acontece sem JavaScript, ou com `prefers-reduced-motion: reduce`:** a
classe `.capa--cortina` **nunca entra**, e a capa continua sendo o díptico
estático de sempre — mesma altura, mesmas duas fotos, mesmos dois CTAs. O pôster
e a ponte ficam `display: none`. Testado nos dois casos.

### O que a cortina custou, e como paguei

Quando as cortinas abrem, **os dois CTAs saem da tela junto com elas** — e esses
CTAs são a arquitetura de dois públicos do site inteiro. Duas coisas seguram isso:

1. O **menu do topo** ("Casamentos" / "Retratos") fica visível o tempo todo e é
   fixo — os dois caminhos nunca somem de verdade.
2. No fim da abertura entra uma linha sobre o pôster: **"Prefere retratos
   corporativos? →"**. É o momento exato em que o site está prestes a levar todo
   mundo para casamentos; ali o segundo público recebe uma saída própria.

Não dupliquei os dois botões sobre o pôster de propósito: links repetidos
confundem leitor de tela e diluem o sinal de SEO.

**Um detalhe de ordem no HTML:** o título precisa vir **antes** das fotos no DOM.
Na primeira versão eu o deixei depois (para ele ficar por cima no modo cortina) e,
sem JavaScript, o `<h1>` da página aparecia embaixo das duas fotos. Agora ele vem
primeiro e a sobreposição é resolvida por `z-index`, não pela ordem.

## Um bug que peguei no teste

O mapa estava apontando para o **número 845** — um condomínio residencial —
em vez do estúdio, no 300. A busca `output=embed` por endereço resolvia para o
prédio errado.

Testei três consultas lado a lado num iframe e troquei para busca **pelo nome do
estúdio**, que fixa o pin certo. De quebra, o card do Google confirmou de forma
independente o nome completo do negócio e a nota:

> Estúdio Misturini | Fotografia Premium de Casamentos, 15 Anos e Retratos
> Corporativos — R. Ten. Antonio João, 300 - Sl 201 — **4,9 ★ (47)**

Também tirei o `filter: invert()` que eu tinha posto no mapa: além de deixar o
texto estranho, ele inverte o próprio logo do Google. Ficou só dessaturação e
brilho reduzido, que já basta para o mapa não brilhar na página escura.

## Identidade visual

A paleta saiu das fotos dele, amostrada com PIL. **Todas as dez caem entre matiz
23° e 33°** — o dourado já estava no trabalho dele, não foi escolha minha:

| Token | Hex | De onde saiu |
|---|---|---|
| `--preto` | `#0B0A09` | fundo do retrato corporativo (`#020202`, `#0C0909`) |
| `--carvao` | `#14120F` | sombras da capa da igreja (`#1F1309`) |
| `--ouro` | `#C99A5B` | luz das velas e da hora dourada (`#C38E4E`, `#C59677`) |
| `--ouro-claro` | `#E8C79A` | estouro do pôr do sol (`#F9CDA5`, `#FFE0B8`) |
| `--creme` | `#F5EAE0` | vestido e luz alta |

**Tipografia:** **Bodoni Moda** (títulos) + **Jost** (corpo).

A skill sugeriu *Great Vibes* — uma caligráfica de convite de casamento.
**Recusei**: metade do público deste site é executivo procurando retrato de
autoridade, e script de casamento afastaria essa metade. Bodoni é a didone da
*Vogue* e da *Harper's* — lê como luxo editorial e serve aos dois lados sem
pender para nenhum. Jost, geométrica, sustenta o corpo com clareza.

Cuidado de execução: Bodoni tem hastes finíssimas que **somem no fundo escuro**
em tamanho pequeno. Por isso ela aparece **só em tamanho grande**; todo o texto
funcional é Jost.

**Estilo:** *Portfolio Grid* (o padrão que a skill acertou — "visuals first,
filter by category, lightbox") + *Dark Mode*, recolorido para o âmbar dele em vez
dos neons que a entrada de dark mode sugere. Descartados: *Vintage Analog / Retro
Film* (aplicaria sépia e grão **nas fotos dele** — inaceitável num portfólio),
*Parallax Storytelling* e *Liquid Glass* (ambos com performance ruim numa página
que é quase toda imagem).

**Decisão que vale registrar:** a galeria começou como grid com `span`, e além de
abrir buracos no fim das linhas, ela **cortava o enquadramento** das fotos para
encaixá-las em proporções fixas. Troquei por colunas fluidas: some o buraco e,
mais importante, cada foto aparece na proporção em que ele fotografou. Recortar o
enquadramento de um fotógrafo no portfólio dele seria o pior erro possível deste
site.

## Imagens

As 10 do zip, separadas por categoria antes de decidir onde entravam:

| Arquivo | Categoria | Onde entrou |
|---|---|---|
| `cas-02-canoa-aereo` | casamento | **Capa** — lado esquerdo do díptico |
| `corp-01-retrato` | corporativo | **Capa** (lado direito) + seção de retratos |
| `cas-01-igreja-beijo` | casamento | Galeria (texto gravado recortado) + imagem OG |
| `cas-03-corredor-luzes` | casamento | Galeria |
| `cas-04-entrada-pai` | casamento | Galeria |
| `cas-05-por-do-sol` | casamento | Galeria |
| `cas-06-bosque` | casamento | Galeria |
| `cas-07-saida-igreja` | casamento | Galeria |
| `cas-08-silhueta-lua` | casamento | Galeria |
| `fachada` | estúdio | Seção *O estúdio* |
| `giovani-retrato` **(v2)** | o fotógrafo | Seção *O fotógrafo* |
| `giovani-lente` **(v2)** | o fotógrafo | Faixa da frase dele |
| `logo-camera` **(v2)** | marca | Cabeçalho (câmera do logo, fundo removido) |
| `logo-misturini` **(v2)** | marca | Logo completo, guardado para uso futuro |
| `cas-01-capa-original` | casamento | **Pôster revelado pela cortina da capa** |

Do v2 sobrou **uma imagem não usada**: `14_giovani_frase_instantes_eternidade`
(ele sorrindo, câmera erguida). Ficaram três retratos dele e num portfólio o
trabalho é que precisa aparecer — usei os dois mais fortes. Está no zip se ele
quiser trocar algum.

Geradas: `og-misturini.jpg` (1200×630, composta com PIL sobre a foto da igreja) e
`favicon.png` — agora recortado do **logo oficial**, não mais desenhado à mão.

## Estrutura

**Capa (díptico em cortina)** → **Casamentos** (galeria + CTA) → **Retratos corporativos**
(editorial + CTA) → **O fotógrafo** (retrato + bio dele) → **A frase dele** →
**Prova social** → **O estúdio** (fachada + mapa) → **chamada final com dois
botões** → rodapé.

## O botão flutuante muda de público

Era um "se for viável" do briefing — **é, e está funcionando**. Um
`IntersectionObserver` acompanha qual seção ocupa a maior parte da tela e troca
o rótulo e a mensagem já preenchida do WhatsApp:

| Seção visível | Rótulo | Mensagem que abre |
|---|---|---|
| Casamentos | Falar sobre casamento | *...quero falar sobre a fotografia do meu casamento.* |
| Retratos | Falar sobre retrato | *...quero falar sobre um retrato corporativo.* |
| Resto do site | Fale comigo | *...gostaria de conversar.* |

Testado nas três seções, nos dois sentidos da rolagem.

## Verificações feitas

Chrome headless via CDP, na página servida de verdade:

- **390×844**, **768×1024** e **1440×900** — `scrollWidth` igual à largura do
  viewport nos três: **sem overflow horizontal**. Também conferido em 360 e 430.
- **Lightbox:** abre no clique, mostra a legenda certa, `alt` preenchido, trava o
  scroll, joga o foco no botão de fechar, navega com ← e →, fecha no Esc,
  devolve o scroll e limpa o `src` ao fechar. O Tab fica preso dentro dele
  enquanto está aberto.
- Fotos acessíveis por teclado (`tabindex`, `role="button"`, `aria-label`) — 7 de 7.
- Galeria corporativa vazia: `display: none`, sem deixar buraco.
- Menu mobile abre/fecha com `aria-expanded` correto.
- **Nenhum erro de JavaScript** e **nenhuma resposta HTTP ≥ 400**.
- Todas as imagens com `alt` descritivo; iframe com `title`; todo
  `target="_blank"` com `rel="noopener"`.
- Um único H1; hierarquia de headings sem pulo.
- Alvos de toque ≥ 44px (exceção consciente: "MX Digital", inline no crédito).
- Contraste WCAG, tudo **AAA**: corpo 16,7:1 · secundário 8,6:1 · ouro 7,8:1 ·
  preto sobre ouro 7,8:1.
- `prefers-reduced-motion` desliga revelações, zoom nas fotos, animações **e a
  cortina da capa**.
- Cortina medida em 1440×900 e 390×844, em cinco pontos da rolagem: os lados
  saem até fora da tela, o pôster chega a `opacity 1`, o título sai e a ponte
  entra — sem erro de JS e sem overflow horizontal em nenhum ponto.
- Fallback conferido nos dois cenários: **sem JavaScript** e com
  **`prefers-reduced-motion: reduce`**, a capa volta a ser o díptico estático.
- A revelação no scroll é aplicada **por JS**, nunca no HTML: `.revelar` começa
  com `opacity: 0`, e num portfólio as fotos são o produto — se o JS falhasse,
  a página inteira ficaria invisível. Sem JS, tudo aparece normalmente.
