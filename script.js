/* Nova Iris — landing interactions
   GSAP + ScrollTrigger via CDN. Fallback CSS+IO se GSAP falhar. */

(() => {
  'use strict';

  /* ── nav scroll background ───────────────────────────── */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  const revealEls = document.querySelectorAll('.reveal');

  /* ── fallback caso GSAP não carregue ─────────────────── */
  const fallbackReveal = () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  };

  /* ── espera GSAP carregar ────────────────────────────── */
  const waitForGSAP = (cb, tries = 100) => {
    if (window.gsap && window.ScrollTrigger) return cb();
    if (tries <= 0) return fallbackReveal();
    setTimeout(() => waitForGSAP(cb, tries - 1), 20);
  };

  const animate = () => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ overwrite: 'auto', force3D: true });
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ── progress bar ────────────────────────────────── */
    const progress = document.createElement('span');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2
      }
    });

    /* ── HERO: stagger inicial dedicado ───────────────── */
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-in'));

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo('.nav',              { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0)
      .fromTo('.hero .eyebrow',    { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
      .fromTo('.hero__title',      { y: 40,  opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 0.2)
      .fromTo('.hero__sub',        { y: 24,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.45)
      .fromTo('.hero__ctas .btn',  { y: 18,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 0.6)
      .fromTo('.hero__trust li',   { y: 12,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0.8)
      .fromTo('.hero-bg', { scale: 1.05, opacity: 0 }, { scale: 1.02, opacity: 0.88, duration: 1.8, ease: 'power4.out' }, 0);

    /* ── HERO sheen loop ─────────────────────────────── */
    gsap.timeline({ repeat: -1, repeatDelay: 2.8, defaults: { ease: 'power2.inOut' } })
      .fromTo('.hero-sheen',
        { backgroundPosition: '140% 0', opacity: 0 },
        { backgroundPosition: '-40% 0', opacity: 1, duration: 2.1 },
        1.1
      )
      .to('.hero-sheen', { opacity: 0, duration: 0.5 }, '>-0.45');

    /* ── HERO bg parallax ────────────────────────────── */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    /* ══════════════════════════════════════════════════
       REVEAL — única fonte de verdade para todos os
       elementos com .reveal fora do hero. Usa batch para
       agrupar elementos que entram juntos no viewport.
       ══════════════════════════════════════════════════ */
    const nonHeroReveals = Array.from(revealEls).filter(el => !el.closest('.hero'));

    ScrollTrigger.batch(nonHeroReveals, {
      interval: 0.1,
      batchMax: 5,
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            onComplete: () => batch.forEach(el => el.classList.add('is-in'))
          }
        );
      },
      start: 'top 86%',
      once: true
    });

    /* ── linha decorativa nos section heads ──────────── */
    gsap.utils.toArray('.section-head').forEach(head => {
      ScrollTrigger.create({
        trigger: head,
        start: 'top 82%',
        once: true,
        onEnter: () => head.classList.add('is-lit')
      });
    });

    /* ── solution orb: drift contínuo no scroll ──────── */
    const solOrb = document.querySelector('.solution__orb');
    if (solOrb) {
      gsap.fromTo(solOrb,
        { rotation: -10, scale: 0.94 },
        {
          rotation: 10, scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: '.solution',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    }

    /* ── phone: float idle + tilt no mouse ───────────── */
    const phone = document.querySelector('.phone');
    const phoneFrame = document.querySelector('.demo__phone');
    if (phone) {
      gsap.to(phone, {
        y: -10,
        rotateZ: 0.7,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.6
      });

      if (phoneFrame && window.matchMedia('(pointer: fine)').matches) {
        phoneFrame.addEventListener('mousemove', event => {
          const rect = phoneFrame.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(phone, {
            rotateY: x * 10,
            rotateX: y * -8,
            duration: 0.45,
            ease: 'power3.out'
          });
        });
        phoneFrame.addEventListener('mouseleave', () => {
          gsap.to(phone, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' });
        });
      }
    }

    /* ── stats: counters + glow class ────────────────── */
    const counterSpecs = [
      { el: document.querySelector('.stat--a .stat__num em'), from: 0, to: 24, format: v => `${Math.round(v)}/7` },
      { el: document.querySelector('.stat--b .stat__num em'), from: 0, to: 3,  format: v => `<${Math.round(v)}s` },
      { el: document.querySelector('.stat--c .stat__num em'), from: 9, to: 0,  format: v => `${Math.round(v)}` }
    ].filter(item => item.el);

    counterSpecs.forEach(spec => {
      const proxy = { value: spec.from };
      ScrollTrigger.create({
        trigger: spec.el.closest('.stats'),
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            value: spec.to,
            duration: 1.25,
            ease: 'power3.out',
            onUpdate: () => { spec.el.textContent = spec.format(proxy.value); }
          });
        }
      });
    });

    const statCards = gsap.utils.toArray('.stat');
    if (statCards.length) {
      ScrollTrigger.create({
        trigger: '.stats',
        start: 'top 70%',
        once: true,
        onEnter: () => statCards.forEach((card, index) => {
          setTimeout(() => card.classList.add('is-hot'), index * 120);
        })
      });
    }

    /* ── versus: glow nas células iris ───────────────── */
    gsap.fromTo('.versus__table .is-iris',
      { boxShadow: '0 0 0 rgba(111,227,168,0)' },
      {
        boxShadow: '0 0 34px rgba(111,227,168,0.14) inset',
        duration: 1.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
        scrollTrigger: { trigger: '.versus', start: 'top 70%', once: true }
      }
    );

    /* ── plan cards: sweep class ─────────────────────── */
    const planCards = gsap.utils.toArray('.plan');
    if (planCards.length) {
      ScrollTrigger.create({
        trigger: '.pricing__grid',
        start: 'top 80%',
        once: true,
        onEnter: () => planCards.forEach((card, index) => {
          setTimeout(() => card.classList.add('is-sweeping'), index * 160);
        })
      });
    }

    /* ── vision: dots pulsing + lit class ────────────── */
    gsap.to('.vision__card .dot', {
      scale: 1.35,
      opacity: 0.72,
      duration: 1.1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.18
    });

    const visionCards = gsap.utils.toArray('.vision__card');
    if (visionCards.length) {
      ScrollTrigger.create({
        trigger: '.vision__cards',
        start: 'top 80%',
        once: true,
        onEnter: () => visionCards.forEach((card, index) => {
          setTimeout(() => card.classList.add('is-lit'), index * 120);
        })
      });
    }

    /* ── FAQ: animação ao abrir ──────────────────────── */
    document.querySelectorAll('.faq__item').forEach(item => {
      item.addEventListener('toggle', () => {
        const body = item.querySelector('p');
        if (!body || !item.open) return;
        gsap.fromTo(body,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      });
    });

    /* ── closer orb: breathing ───────────────────────── */
    const closerOrb = document.getElementById('closerOrb');
    if (closerOrb) {
      ScrollTrigger.create({
        trigger: '.closer',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(closerOrb, {
            scale: 1.06,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          });
        }
      });
    }

    /* ── aurora drift contínuo ───────────────────────── */
    gsap.to('.aurora__a', { x: '-=60', duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.aurora__b', { x: '+=80', y: '+=40', duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    /* ── hover: cards + botões ───────────────────────── */
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.plan, .vision__card').forEach(card => {
        card.addEventListener('mousemove', event => {
          const rect = card.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--spot-x', `${x}%`);
          card.style.setProperty('--spot-y', `${y}%`);
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--spot-x', '82%');
          card.style.setProperty('--spot-y', '10%');
        });
      });

      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', event => {
          const rect = btn.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.08, y: y * 0.18, scale: 1.025, duration: 0.25, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)' });
        });
      });
    }

    /* ── refresh on font load ────────────────────────── */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  };

  waitForGSAP(animate);

  /* ══════════════════════════════════════════════════
     CHAT SIMULATION
     ══════════════════════════════════════════════════ */
  const chatEl = document.getElementById('chat');
  if (chatEl) {
    const script = [
      { type: 'typing-them', delay: 700 },
      { type: 'them',        text: 'oi, dá pra marcar consulta pra essa semana?', delay: 1700 },
      { type: 'typing-me',   delay: 1200 },
      { type: 'me',          text: 'Oi! Claro. Você prefere início ou fim da semana?', delay: 1800 },
      { type: 'typing-them', delay: 1300 },
      { type: 'them',        text: 'fim, se possível à tarde', delay: 1500 },
      { type: 'typing-me',   delay: 1200 },
      { type: 'me',          text: 'Tenho quinta 14:30 e sexta 16:00. Qual fica melhor?', delay: 1900 },
      { type: 'typing-them', delay: 1400 },
      { type: 'them',        text: 'quinta 14:30', delay: 1200 },
      { type: 'typing-me',   delay: 1300 },
      { type: 'me',          text: 'Agendado ✓ Te mando lembrete um dia antes.', delay: 1700 },
      { type: 'pause',       delay: 4500 }
    ];

    let timer = null;

    const clearChat = () => { chatEl.innerHTML = ''; };

    const addBubble = (variant, text) => {
      const li = document.createElement('li');
      li.className = `chat__bubble chat__bubble--${variant}`;
      li.textContent = text;
      chatEl.appendChild(li);
    };

    const addTyping = (variant = 'them') => {
      const li = document.createElement('li');
      li.className = `chat__typing chat__typing--${variant}`;
      li.innerHTML = '<span></span><span></span><span></span>';
      chatEl.appendChild(li);
    };

    const removeTyping = () => {
      const t = chatEl.querySelector('.chat__typing');
      if (t) t.remove();
    };

    const run = (i = 0) => {
      if (i >= script.length) {
        timer = setTimeout(() => { clearChat(); run(0); }, 600);
        return;
      }
      const step = script[i];
      timer = setTimeout(() => {
        if (step.type === 'them')             { removeTyping(); addBubble('them', step.text); }
        else if (step.type === 'me')          { removeTyping(); addBubble('me', step.text); }
        else if (step.type === 'typing-them') { removeTyping(); addTyping('them'); }
        else if (step.type === 'typing-me')   { removeTyping(); addTyping('me'); }
        run(i + 1);
      }, step.delay);
    };

    const startIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          run(0);
          startIO.disconnect();
        }
      });
    }, { threshold: 0.3 });
    startIO.observe(chatEl);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && timer) {
        clearTimeout(timer); timer = null;
      } else if (!document.hidden && !timer) {
        clearChat();
        run(0);
      }
    });
  }
})();
