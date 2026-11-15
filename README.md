# Jogo da Memória Educativo — Desafio dos Pares

<p align="center">
  <a href="https://eliseuangelos.github.io/jogo-da-memoria/" target="_blank">
    <img src="https://img.shields.io/badge/ACESSAR_O_JOGO-00D9FF?style=for-the-badge&logo=puzzle&logoColor=050505" alt="Acessar o Sudoku">
  </a>
  <a href="https://eliseuangelos.github.io/" target="_blank">
    <img src="https://img.shields.io/badge/SITE_PESSOAL-111827?style=for-the-badge&logo=googlechrome&logoColor=00D9FF" alt="Site Pessoal">
  </a>
  <a href="https://github.com/eliseuangelos" target="_blank">
    <img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://linkedin.com/in/eliseu-fernandes-laurindo" target="_blank">
    <img src="https://img.shields.io/badge/LINKEDIN-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</p>

<p align="center"><strong>Aprender, brincar e desenvolver a memória.</strong></p>

---

## Sobre o projeto

O **Jogo da Memória Educativo — Desafio dos Pares** é uma aplicação web interativa voltada especialmente a crianças em fase de alfabetização. A experiência combina cartas ilustradas, palavras, letras e números em atividades de associação e identificação de pares.

O jogo oferece categorias temáticas, escolha da quantidade de pares, temas visuais, efeitos sonoros, pronúncia dos nomes em português brasileiro e um placar local. Além da experiência digital, permite gerar cartas em PDF para impressão e baixar as ilustrações vetoriais em arquivos SVG.

**Acesse:** [eliseuangelos.github.io/jogo-da-memoria](https://eliseuangelos.github.io/jogo-da-memoria/)

## Objetivos do site

- Oferecer uma atividade lúdica que estimule memória, atenção e associação visual.
- Apoiar o reconhecimento de letras, números, imagens e palavras.
- Relacionar ilustrações aos nomes correspondentes, com suporte de pronúncia em português brasileiro.
- Proporcionar diferentes categorias e quantidades de pares para adaptar a experiência.
- Levar a atividade para além da tela por meio da geração de cartas para impressão.
- Explorar recursos nativos do navegador em uma aplicação educativa responsiva.

## Funcionalidades

### Jogo e aprendizagem

- Seleção de **1 a 56 pares**.
- Embaralhamento automático das cartas.
- Identificação de pares correspondentes.
- Cartas com ilustrações vetoriais e palavras.
- Categorias de imagens, letras e números.
- Recurso de revelação para oferecer ajuda durante a partida.
- Indicadores de tempo, tentativas, pares encontrados, cartas restantes e revelações utilizadas.
- Tela de conclusão e opção para iniciar uma nova partida.

### Categorias

- Todas.
- Natureza.
- Animais.
- Frutas e alimentos.
- Transporte.
- Diversos.
- Letras.
- Números.

### Temas e acessibilidade de uso

- Tema Infantil.
- Tema Dia.
- Tema Noite.
- Interface adaptável a computadores, tablets e celulares.
- Grade de cartas calculada conforme o espaço disponível e a quantidade selecionada.
- Rolagem quando a quantidade de cartas ultrapassa a área visível.
- Controles para ativar ou desativar efeitos sonoros e pronúncia.

### Voz e efeitos sonoros

A pronúncia dos nomes das cartas utiliza a síntese de voz oferecida pelo navegador. Os efeitos sonoros são controlados separadamente da narração, permitindo ajustar a experiência ao ambiente e à preferência do jogador.

### Placar e recordes

- Registro local dos melhores resultados.
- Classificação dos dez melhores jogadores para cada quantidade de pares.
- Identificação do jogador pelo nome informado ao concluir a partida.
- Critério de ordenação por menor tempo e, em seguida, menor número de tentativas.
- Partidas que utilizam a função de revelação não são elegíveis para o ranking.

### Impressão e exportação

- Geração de cartas em PDF no formato A4.
- Cartas com dimensões aproximadas de 6,2 × 7,5 cm.
- Opção de gerar pares duplicados para atividades impressas.
- Exportação das ilustrações em arquivos SVG compactados em ZIP.
- Possibilidade de escolher categorias para compor os materiais.

## Objetivos educacionais

O jogo foi pensado para apoiar atividades de aprendizagem por meio da brincadeira, contribuindo para:

- Exercitar memória e concentração.
- Desenvolver percepção e associação visual.
- Incentivar o reconhecimento de letras e números.
- Ampliar o contato com palavras e seus significados.
- Associar ilustrações à pronúncia dos respectivos nomes.
- Utilizar cartas impressas em atividades fora do ambiente digital.

## Tecnologias utilizadas

| Tecnologia ou recurso | Aplicação |
|---|---|
| HTML5 | Estrutura da aplicação e dos elementos do jogo. |
| CSS3 | Temas, animações, organização visual e responsividade. |
| JavaScript | Regras do jogo, embaralhamento, contadores e interação. |
| SVG | Ilustrações vetoriais das cartas. |
| Web Audio API | Efeitos sonoros. |
| Web Speech API | Pronúncia dos nomes das cartas. |
| localStorage | Armazenamento local do placar e das estatísticas. |
| ResizeObserver | Observação do espaço disponível para dimensionar a grade. |
| GitHub Pages | Hospedagem estática da aplicação. |

## Estrutura do projeto

```text
jogo-da-memoria/
├── index.html                  # Somente HTML: header, tela inicial, tabuleiro, rodapé e janelas
├── README.md
├── tools/
│   ├── falas.json              # As 102 falas do jogo (id, categoria, texto)
│   └── gerar-vozes.py          # Sintetiza/processa os áudios das vozes e gera o manifesto
└── assets/
    ├── css/
    │   ├── main.css            # Ponto de entrada (importa os módulos, na ordem)
    │   ├── tokens.css          # Variáveis EXECUTIVE DIGITAL (cores, tipografia, espaços, movimento)
    │   ├── base.css            # Reset, tipografia, botões, foco e utilitários
    │   ├── header.css          # Marca, navegação e alternador Day/Night
    │   ├── footer.css          # Rodapé com créditos e autoria
    │   ├── game.css            # Tela inicial, HUD, tabuleiro e cartas
    │   ├── components.css      # Janelas, formulários, placar e confete
    │   └── responsive.css      # Ponto único de compactação e modo de partida
    ├── js/
    │   ├── theme-init.js       # Aplica o tema antes da renderização (evita flash)
    │   ├── drawings.js         # 56 desenhos SVG, letras, números e categorias
    │   ├── export.js           # Cartas em PDF vetorial e ZIP de SVGs
    │   ├── game.js             # Regras, sons, voz, recordes, placar e menus
    │   └── theme.js            # Cor da barra do navegador e alternador Day/Night
    ├── sounds/voz/             # Falas em MP3 (opcionais) e manifest.js que as lista
    ├── icons/                  # favicon, símbolo da marca e apple-touch-icon
    └── vendor/day-night/       # Componente DAY & NIGHT EXPERIENCE v1.3.0
```

**Ordem dos scripts:** `day-night.js`, `manifest.js` (vozes), `drawings.js`, `export.js`, `game.js`, `theme.js` (todos com `defer`). `drawings.js` publica `window.Memoria` (`DR`, `CATS`, `svg`) e `export.js` acrescenta `openPdf`.

**Créditos:** ficam no rodapé (`#creditos`). Na tela de partida em telas compactas o rodapé é ocultado para dar espaço ao tabuleiro e reaparece ao voltar para a tela inicial.

## Vozes

Ao encontrar um par, o jogo fala o nome da figura, da letra ou do número, em duas camadas:

1. **Áudios prontos (recomendado):** MP3 em `assets/sounds/voz/`, listados em `manifest.js`. A mesma voz toca em qualquer aparelho, devagar e com margens de silêncio.
2. **Reserva:** sem áudio (ou se ele falhar), usa a voz do navegador em português do Brasil, em velocidade reduzida. A velocidade é a constante `RATE` em `assets/js/game.js` (1 = normal; hoje 0,7).

### Gerar os áudios com voz neural (Kokoro, `pf_dora`)

[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) é um modelo neural aberto (pesos sob licença Apache-2.0) e `pf_dora` é a voz feminina em português do Brasil. É preciso Python (use 3.10 a 3.12 se a instalação falhar), `ffmpeg` e, se for solicitado, `espeak-ng`.

```bash
pip install kokoro soundfile
python tools/gerar-vozes.py tudo                  # sintetiza e processa as 102 falas
python tools/gerar-vozes.py tudo --repetir        # fala devagar, pausa e repete um pouco mais rápido
python tools/gerar-vozes.py tudo --velocidade 0.65
```

Os áudios brutos ficam em `tools/brutos/` (podem ser apagados depois); os MP3 e o `manifest.js` são gravados em `assets/sounds/voz/`. Ouça antes de publicar e substitua qualquer fala de que não gostar.

### Outra voz ou gravação humana

Salve os áudios (WAV, MP3, M4A ou OGG) em `tools/brutos/` com o número da fala em `tools/falas.json` (`000.wav`, `056.mp3`...) e rode `python tools/gerar-vozes.py processar`. Serve para Amazon Polly, Azure ou uma gravação; confira os termos de uso do serviço escolhido.

## Privacidade e armazenamento

O jogo executa suas funcionalidades diretamente no navegador e não exige cadastro ou conta. Os recordes e as estatísticas são armazenados localmente por meio do `localStorage`. Os arquivos PDF, SVG e ZIP são gerados no próprio navegador.

Como o armazenamento é local, os dados não são sincronizados entre dispositivos e podem ser removidos quando o usuário apaga os dados do site ou do navegador.

## Como jogar

1. Acesse o [Jogo da Memória Educativo](https://eliseuangelos.github.io/jogo-da-memoria/).
2. Escolha uma categoria e a quantidade de pares.
3. Pressione **JOGAR**.
4. Selecione uma carta para revelar a ilustração e procure outra carta correspondente.
5. Continue até encontrar todos os pares.
6. Consulte o placar ou utilize **Baixar cartas** para gerar materiais impressos.

## Execução local

```bash
git clone https://github.com/eliseuangelos/jogo-da-memoria.git
cd jogo-da-memoria
```

Não há etapa de build nem backend. Como os arquivos usam caminhos relativos, o projeto funciona na raiz ou em um subdiretório (como no GitHub Pages). Para testar localmente, utilize um servidor HTTP estático:

```bash
python3 -m http.server 8000
# abra http://localhost:8000/
```

## Sobre o autor

Sou **Eliseu Fernandes Laurindo**, profissional com experiência em atividades administrativas e operacionais, estudante autodidata e entusiasta de tecnologia e inteligência artificial. Meu contato com HTML e CSS começou por volta de 2010, junto aos primeiros estudos de JavaScript. Na adolescência, experimentei estruturas de jogos digitais; depois, atuei como tutor em uma comunidade internacional e multiplataforma de MMORPG, mantive uma fanpage e desenvolvi scripts e calculadoras para apoiar jogadores.

Hoje utilizo essa curiosidade para estudar, experimentar e desenvolver projetos que atendam a necessidades práticas ou possam ser compartilhados como utilidades. **Não sou desenvolvedor profissional nem possuo formação acadêmica específica em desenvolvimento de software.** Sou estudante de tecnologia e entusiasta de inteligência artificial; este projeto faz parte de uma trajetória de aprendizagem contínua, com apoio de documentação, testes e ferramentas de IA.

- **Projeto:** [Jogo da Memória Educativo](https://eliseuangelos.github.io/jogo-da-memoria/)
- **Site pessoal:** [eliseuangelos.github.io](https://eliseuangelos.github.io/)
- **GitHub:** [github.com/eliseuangelos](https://github.com/eliseuangelos)
- **LinkedIn:** [linkedin.com/in/eliseu-fernandes-laurindo](https://linkedin.com/in/eliseu-fernandes-laurindo)

---

<p align="center"><em>“Quanto mais aumenta nosso conhecimento, mais evidente fica nossa ignorância.”</em><br><strong>John F. Kennedy</strong></p>
