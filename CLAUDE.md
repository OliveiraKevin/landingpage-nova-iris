# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado atual

Landing page estática da **Nova Iris** para divulgar a Iris, agente de IA para atendimento, agendamento, confirmação, lembrete e remarcação via WhatsApp para clínicas.

Stack:
- HTML, CSS e JavaScript vanilla
- GSAP 3.12.5 + ScrollTrigger vendorizados localmente em `vendor/`
- Sem framework, sem npm, sem build step

Domínio público definido:
- `https://novairis.com.br/`

Contato público:
- WhatsApp: `wa.me/5511986272135`
- E-mail: `contato@novairis.com.br`

## Arquivos do projeto

```
index.html                  — landing completa
styles.css                  — layout, responsividade, animações CSS e estilos mobile
script.js                   — GSAP, ScrollTrigger, chat demo e interações
vendor/gsap.min.js          — GSAP local
vendor/ScrollTrigger.min.js — ScrollTrigger local
iris-realistic-final.jpg    — imagem hero otimizada
iris-mark-512.png           — símbolo Iris para usos grandes
iris-mark-256.png           — símbolo Iris para favicon/nav/footer/avatar
robots.txt                  — robots básico
sitemap.xml                 — sitemap básico com novairis.com.br
vercel.json                 — headers e cache para deploy na Vercel
.vercelignore               — remove docs/helpers internos do deploy
.gitignore                  — ignora artefatos locais
serve.ps1                   — helper local Windows para servir via Python
CLAUDE.md                   — documentação operacional do projeto
```

Arquivos removidos por duplicidade/otimização:
- `image.png` — fonte original 1024px do símbolo, substituída por `iris-mark-256.png` e `iris-mark-512.png`
- `iris-realistic-final.png` — fonte original pesada do hero, substituída por `iris-realistic-final.jpg`

## Seções da landing

1. **Hero** — headline, imagem hero realista e CTAs WhatsApp
2. **Problema** — quatro dores da recepção humana
3. **Solução** — apresentação da Iris
4. **Demo** — mockup de conversa em loop com múltiplos cenários
5. **Como funciona** — quatro passos de implantação
6. **Resultados** — cards de impacto
7. **Comparativo** — Iris vs chatbot tradicional vs recepcionista vs IA genérica
8. **Planos** — Iris Clínica, Site Inteligente, Iris + Site
9. **Visão de plataforma** — módulos atuais e próximos
10. **FAQ** — perguntas frequentes
11. **CTA final** — fechamento e WhatsApp

## Preços públicos atuais

- **Iris Clínica**: R$ 750/mês + R$ 1.000 de setup único
- **Site Inteligente**: R$ 1.500 de implementação para landing/site inicial de página única + R$ 250/mês de manutenção opcional. Domínio e hospedagem à parte.
- **Iris + Site**: R$ 1.000/mês + R$ 2.500 de setup único. Inclui Iris + implementação do site inicial, com manutenção do site incluída na mensalidade.

Observação comercial:
- Os preços atuais funcionam como preço de entrada/lançamento.
- Depois dos primeiros clientes, considerar subir para Iris Clínica em R$ 950/mês + R$ 1.500 setup e Iris + Site em R$ 1.250/mês + R$ 3.000 setup.

## O que foi feito nesta rodada

- WhatsApp consolidado em `5511986272135`
- E-mail público trocado para `contato@novairis.com.br`
- Domínio técnico e social ajustado para `novairis.com.br`
- GSAP e ScrollTrigger vendorizados localmente
- Dependência do CDN `unpkg.com` removida
- Imagem hero otimizada para JPG leve
- Logos reduzidos para versões 256px e 512px
- PNGs originais pesados removidos da pasta
- `robots.txt` e `sitemap.xml` adicionados
- `vercel.json`, `.vercelignore` e `.gitignore` adicionados
- `serve.ps1` adicionado para teste local
- Copy dos planos revisada para proteger escopo
- Mobile revisado para evitar scroll horizontal
- Chat demo ajustado para fluir e rolar internamente
- FAQ e CTA final corrigidos no mobile
- Animações mobile ajustadas para todas as seções via `IntersectionObserver`
- Logo/orb corrigida para não esticar no mobile

## Desenvolvimento local

Abrir direto o `index.html` funciona para revisão visual.

Para testar como site local:

```powershell
.\serve.ps1
```

O script mostra a URL local, normalmente:

```text
http://127.0.0.1:5500
```

## Deploy recomendado

Prioridade agora:
1. Subir o repositório no GitHub.
2. Conectar o repositório à Vercel.
3. Configurar o domínio `novairis.com.br`.
4. Ativar HTTPS.
5. Validar:
   - `https://novairis.com.br/`
   - `https://novairis.com.br/robots.txt`
   - `https://novairis.com.br/sitemap.xml`

Como o projeto não tem build:
- Framework preset: `Other`
- Build command: vazio
- Output directory: raiz do projeto

Observação:
- `CLAUDE.md` e `serve.ps1` ficam no GitHub, mas são excluídos do deploy pela `.vercelignore`.

## O que ainda falta

Antes de publicar:
- Confirmar que todos os arquivos estão no GitHub.
- Criar deploy na Vercel.
- Apontar DNS do domínio para a Vercel.
- Conferir preview social no WhatsApp após publicação.

Depois de publicar:
- Criar página simples de privacidade.
- Configurar Google Search Console.
- Criar `favicon.ico` e `apple-touch-icon.png`.
- Rodar Lighthouse no domínio real.
- Opcional: adicionar analytics/pixel quando fizer sentido.
- Opcional: criar proposta comercial em PDF/Canva.

## Regras de conteúdo

- Não citar clientes por nome.
- Não expor stack técnica interna de operação.
- CTA principal sempre WhatsApp.
- Sem depoimentos fictícios.
- Linguagem de segurança deve ser simples e comercial; evitar termos técnicos como PII, logs, hash ou detalhes internos de infraestrutura.
