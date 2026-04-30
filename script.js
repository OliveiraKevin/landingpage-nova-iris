/* Nova Iris — landing interactions
   GSAP + ScrollTrigger via CDN. Fallback CSS+IO se GSAP falhar. */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── nav scroll background ───────────────────────────── */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ── reveal preset ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(el => {
    const d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--delay', `${d}ms`);
  });

  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ── wait for GSAP (deferred) then animate ───────────── */
  const waitForGSAP = (cb, tries = 50) => {
    if (window.gsap && window.ScrollTrigger) return cb();
    if (tries <= 0) return fallbackReveal();
    setTimeout(() => waitForGSAP(cb, tries - 1), 60);
  };

  const fallbackReveal = () => {
    if (reduceMotion) return;
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

  const animate = () => {
    gsap.registerPlugin(ScrollTrigger);

    if (reduceMotion) return;

    /* ── 1. INTRO sequence (hero) ────────────────────── */
    // Mark hero reveals as "in" first so CSS opacity:0 doesn't fight GSAP
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-in'));

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo('.nav',           { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0)
      .fromTo('.hero .eyebrow', { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
      .fromTo('.hero__title',   { y: 40,  opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, 0.2)
      .fromTo('.hero__sub',     { y: 24,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.45)
      .fromTo('.hero__ctas .btn',  { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 0.6)
      .fromTo('.hero__trust li',   { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0.8)
      .fromTo('#heroOrb',     { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: 'power4.out' }, 0.1)
      .fromTo('.orb__caption',{ opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.0);

    /* ── 2. Hero orb idle: float + rotate ──────────── */
    const heroOrb = document.getElementById('heroOrb');
    if (heroOrb) {
      gsap.to(heroOrb, {
        y: '+=18',
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
      gsap.to(heroOrb, {
        rotation: 6,
        duration: 7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
      // scroll parallax
      gsap.to(heroOrb, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    /* ── 3. Generic reveals — more dramatic ─────────── */
    revealEls.forEach(el => {
      if (el.closest('.hero')) return;
      const delay = parseFloat(el.getAttribute('data-delay') || 0) / 1000;
      gsap.fromTo(el,
        { opacity: 0, y: 60, filter: 'blur(8px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 1.2,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onStart: () => el.classList.add('is-in')
        }
      );
    });

    /* ── 4. Section heads — bigger entry ──────────── */
    gsap.utils.toArray('.section-head__title').forEach(t => {
      gsap.fromTo(t,
        { opacity: 0, y: 60, scale: 0.96, filter: 'blur(10px)' },
        {
          opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: { trigger: t, start: 'top 85%', once: true }
        }
      );
    });

    /* ── 4b. Section kickers — slide in ──────────── */
    gsap.utils.toArray('.section-head__kicker').forEach(k => {
      gsap.fromTo(k,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: k, start: 'top 90%', once: true }
        }
      );
    });

    /* ── 4c. Auto-reveal anything not yet animated ─ */
    const autoTargets = gsap.utils.toArray([
      '.problem__lead',
      '.solution__text',
      '.solution__caps',
      '.demo__phone',
      '.plan__head',
      '.plan__price',
      '.plan__setup',
      '.plan__pull',
      '.plan__fine',
      '.vision__lead',
      '.closer__sub',
      '.closer__sign',
      '.foot__brand',
      '.foot__links',
      '.foot__copy'
    ]);
    autoTargets.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    /* ── 5. Solution orb — drift on scroll ────────── */
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

    /* ── 6. Problem list — staggered slide ────────── */
    const problemItems = gsap.utils.toArray('.problem__list li');
    if (problemItems.length) {
      gsap.fromTo(problemItems,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.problem', start: 'top 70%', once: true }
        }
      );
    }

    /* ── 7. Phone — tilt + scale on scroll ────────── */
    const phone = document.querySelector('.phone');
    if (phone) {
      gsap.fromTo(phone,
        { y: 80, opacity: 0, rotateY: -12, rotateX: 6 },
        {
          y: 0, opacity: 1, rotateY: 0, rotateX: 0,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.demo', start: 'top 70%', once: true }
        }
      );
    }

    /* ── 8. Demo callouts — slide from right ──────── */
    const callouts = gsap.utils.toArray('.demo__callouts li');
    if (callouts.length) {
      gsap.fromTo(callouts,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.demo', start: 'top 60%', once: true }
        }
      );
    }

    /* ── 9. How steps — stagger ───────────────────── */
    const howSteps = gsap.utils.toArray('.how__step');
    if (howSteps.length) {
      gsap.fromTo(howSteps,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.how', start: 'top 70%', once: true }
        }
      );
    }

    /* ── 10. Stats — scale-in ─────────────────────── */
    const statNums = gsap.utils.toArray('.stat__num');
    if (statNums.length) {
      gsap.fromTo(statNums,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.stats', start: 'top 70%', once: true }
        }
      );
    }

    /* ── 11. Versus rows — line by line ───────────── */
    const versusRows = gsap.utils.toArray('.versus__table tbody tr');
    if (versusRows.length) {
      gsap.fromTo(versusRows,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.versus', start: 'top 70%', once: true }
        }
      );
    }

    /* ── 12. Plan card — dramatic entry ───────────── */
    const plan = document.querySelector('.plan');
    if (plan) {
      gsap.fromTo(plan,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.3,
          ease: 'power4.out',
          scrollTrigger: { trigger: plan, start: 'top 80%', once: true }
        }
      );
      gsap.fromTo('.plan__list li',
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.plan__list', start: 'top 80%', once: true }
        }
      );
    }

    /* ── 13. Vision cards — stagger up ────────────── */
    const visionCards = gsap.utils.toArray('.vision__card');
    if (visionCards.length) {
      gsap.fromTo(visionCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.vision__cards', start: 'top 80%', once: true }
        }
      );
    }

    /* ── 14. FAQ items — soft reveal ─────────────── */
    const faqItems = gsap.utils.toArray('.faq__item');
    if (faqItems.length) {
      gsap.fromTo(faqItems,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.faq__list', start: 'top 80%', once: true }
        }
      );
    }

    /* ── 15. Closer — orb breathing + reveal ──────── */
    const closerOrb = document.getElementById('closerOrb');
    if (closerOrb) {
      gsap.fromTo(closerOrb,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.closer', start: 'top 70%', once: true },
          onComplete: () => {
            gsap.to(closerOrb, {
              scale: 1.06,
              duration: 2.8,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            });
          }
        }
      );
    }

    /* ── 16. Aurora drift ─────────────────────────── */
    gsap.to('.aurora__a', { x: '-=60', duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.aurora__b', { x: '+=80', y: '+=40', duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    /* ── 17. CTA hover micro ──────────────────────── */
    document.querySelectorAll('.btn--primary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.4, ease: 'power3.out' });
      });
    });

    /* ── refresh ScrollTrigger on font load ───────── */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  };

  if (reduceMotion) {
    fallbackReveal();
  } else {
    waitForGSAP(animate);
  }

  /* ── chat simulation ─────────────────────────────────── */
  const chatEl = document.getElementById('chat');
  if (chatEl) {
    const script = [
      { type: 'them',   text: 'oi, dá pra marcar consulta pra essa semana?', delay: 600 },
      { type: 'typing', delay: 900 },
      { type: 'me',     text: 'Oi! Claro. Você prefere início ou fim da semana?', delay: 700 },
      { type: 'them',   text: 'fim, se possível à tarde', delay: 1400 },
      { type: 'typing', delay: 900 },
      { type: 'me',     text: 'Tenho quinta 14:30 e sexta 16:00. Qual fica melhor?', delay: 700 },
      { type: 'them',   text: 'quinta 14:30', delay: 1300 },
      { type: 'me',     text: 'Agendado ✓ Te mando lembrete um dia antes.', delay: 1100 },
      { type: 'pause',  delay: 2800 }
    ];

    let timer = null;

    const clearChat = () => { chatEl.innerHTML = ''; };

    const addBubble = (variant, text) => {
      const li = document.createElement('li');
      li.className = `chat__bubble chat__bubble--${variant}`;
      li.textContent = text;
      chatEl.appendChild(li);
    };

    const addTyping = () => {
      const li = document.createElement('li');
      li.className = 'chat__typing';
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
        if (step.type === 'them')        { removeTyping(); addBubble('them', step.text); }
        else if (step.type === 'me')     { removeTyping(); addBubble('me', step.text); }
        else if (step.type === 'typing') { addTyping(); }
        run(i + 1);
      }, step.delay);
    };

    if (reduceMotion) {
      script.filter(s => s.type === 'them' || s.type === 'me').forEach(s => addBubble(s.type, s.text));
    } else {
      const startIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            run(0);
            startIO.disconnect();
          }
        });
      }, { threshold: 0.3 });
      startIO.observe(chatEl);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && timer) {
        clearTimeout(timer); timer = null;
      } else if (!document.hidden && !timer && !reduceMotion) {
        clearChat();
        run(0);
      }
    });
  }
})();
