# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Landing page estática da Nova Iris — empresa de automação de saúde via WhatsApp.
Produto principal: **Iris** — agente de IA que atende, agenda e remarca pelo WhatsApp da clínica, 24/7.
Stack: HTML + CSS + JS vanilla. Sem bundler, sem framework.

## Desenvolvimento

```bash
python -m http.server 5500
# acesse http://localhost:5500
```

Não há build step, testes, ou dependências npm.

## Arquitetura

```
index.html    — 11 seções (ver estrutura abaixo)
styles.css    — variáveis no :root, mobile-first, sem preprocessador
script.js     — GSAP + ScrollTrigger (CDN) + chat sim + nav scroll
image.png     — logo símbolo da Iris (PNG transparente) · usado em todo o HTML
image copy.png — versão anterior do logo (fundo preto) · não usado
```

### Seções do index.html

1. **Hero** — headline + orb 3D + CTAs WhatsApp
2. **Problema** — 4 friction points da recepção humana
3. **Solução** — intro da Iris + capacidades em mono
4. **Demo** — simulação de chat em loop (iPhone mockup CSS)
5. **Como funciona** — 4 passos: Onboarding · Treinamento · Teste & Ajuste · Go-live
6. **Resultados** — 4 stats: 24/7 · <3s · 0 · ∞
7. **Por que a Iris** — tabela comparativa vs alternativas
8. **Planos** — card único R$750/mês + R$1k setup, sem fidelidade
9. **Visão de plataforma** — Iris (ao vivo) · Dashboard (em validação) · Sites (roadmap)
10. **FAQ** — 6 perguntas em accordion `<details>` CSS-only
11. **CTA final** — closer com headline editorial + botão WhatsApp

## Paleta

```
--ink:        #07090A   (canvas principal)
--ink-2:      #0F1714   (seções alternadas)
--ink-3:      #151D1A
--moss:       #1B4D3E   (primário)
--glow:       #3D9970   (acento)
--glow-hi:    #6FE3A8   (highlight)
--bone:       #F2EFE8   (texto principal)
--bone-dim:   #A8AEA9   (texto secundário)
```

## Tipografia

- **Instrument Serif** — títulos editoriais, itálico dramático
- **Sora** 200/300/500/600 — sans corpo e UI (brand font)
- **JetBrains Mono** — badges de status, eyebrows, labels técnicas

Tipografia fluida via `clamp()`. Breakpoints: 640 / 960 / 1280px.

## Animações (GSAP)

`script.js` usa GSAP 3.12 + ScrollTrigger via CDN com `defer`. Fallback CSS + IntersectionObserver se CDN falhar.

Momentos animados:
- Intro stagger no hero (nav → eyebrow → título → sub → CTAs)
- Orb: float idle + rotação sutil + parallax no scroll
- Reveals genéricos: `opacity 0 + y:60 + blur:8px → in`
- Section heads: scale-in com blur
- Problem list: slide da direita em cascata
- Phone: tilt 3D + slide-up
- Stats: scale-in stagger
- Versus: rows um a um
- Plan card: entrada dramática
- Aurora: drift contínuo
- `prefers-reduced-motion`: desliga tudo

## Logo / imagem

`image.png` é PNG transparente usado em todo o HTML com `.bg-knock` (mix-blend-mode: lighten) para eliminar pixels escuros internos contra o canvas dark.

## Contatos

WhatsApp (todos os CTAs): `wa.me/5511986272515?text=Oi Valentina, quero ver a Iris em ação.`
E-mail: `kevin@novairis.com.br`
Site: `novairis.com.br`

## Regras de conteúdo

- Não citar clientes por nome (sem "CEAM Brasil" em público)
- Não expor stack técnica (FastAPI, Z-API, OpenRouter, Supabase, Wareline)
- CTA principal sempre WhatsApp — sem formulário
- Sem depoimentos fictícios
