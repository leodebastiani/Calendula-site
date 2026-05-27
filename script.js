// ============================================================
//  CALÊNDULA — Script
// ============================================================

(function () {
    'use strict';

    // ——— Loader ———
    const loader = document.getElementById('loader');
    const MIN_LOADER = 1900;
    const startTime = Date.now();

    function hideLoader() {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, MIN_LOADER - elapsed);
        setTimeout(() => {
            loader.classList.add('out');
            initReveal();
            // Trigger hero image zoom after load
            const heroImg = document.getElementById('heroImg');
            if (heroImg) heroImg.style.transform = 'scale(1)';
        }, delay);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // ——— Custom Cursor ———
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');

    if (cursor && follower) {
        let mx = 0, my = 0, fx = 0, fy = 0;
        let rafId;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top  = my + 'px';
        });

        function animateFollower() {
            fx += (mx - fx) * 0.14;
            fy += (my - fy) * 0.14;
            follower.style.left = fx + 'px';
            follower.style.top  = fy + 'px';
            rafId = requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverables = 'a, button, .track, .gallery-item, .venue-card, .btn, input, textarea';
        document.querySelectorAll(hoverables).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '';
        });
    }

    // ——— Navbar scroll ———
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // ——— Mobile nav toggle ———
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    let menuOpen = false;

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            navLinks.classList.toggle('open', menuOpen);
            document.body.style.overflow = menuOpen ? 'hidden' : '';
            const [s1, s2, s3] = navToggle.querySelectorAll('span');
            if (menuOpen) {
                s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
                s2.style.opacity = '0';
                s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                s1.style.transform = s3.style.transform = '';
                s2.style.opacity = '';
            }
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                menuOpen = false;
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
                const [s1, s2, s3] = navToggle.querySelectorAll('span');
                s1.style.transform = s3.style.transform = '';
                s2.style.opacity = '';
            });
        });
    }

    // ——— Reveal on scroll ———
    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        // Stagger children within same parent
        const parents = new Map();
        els.forEach(el => {
            const parent = el.parentElement;
            if (!parents.has(parent)) parents.set(parent, []);
            parents.get(parent).push(el);
        });

        parents.forEach(children => {
            children.forEach((el, i) => {
                el.style.transitionDelay = (i * 0.1) + 's';
                obs.observe(el);
            });
        });
    }

    // ——— Active nav link ———
    const sections    = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length && navLinksAll.length) {
        const sectionObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinksAll.forEach(a => a.classList.remove('active-link'));
                    const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (active) active.classList.add('active-link');
                }
            });
        }, { threshold: 0.35 });

        sections.forEach(s => sectionObs.observe(s));
    }

    // ——— Hero parallax ———
    const heroImg = document.getElementById('heroImg');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight * 1.2) {
                heroImg.style.transform = `scale(1.06) translateY(${y * 0.25}px)`;
            }
        }, { passive: true });
    }

    // ——— Track list glow div inject ———
    document.querySelectorAll('.track').forEach(track => {
        const glow = document.createElement('div');
        glow.className = 'track-glow';
        track.prepend(glow);
    });

    // ——— Contact form ———
    // Para ativar: crie uma conta em formspree.io, crie um form apontando para
    // leonardo.debastiani@proton.me e substitua FORMSPREE_ID pelo ID gerado (ex: "xeojpkdp").
    const FORMSPREE_ID = 'mgoqppjd';

    const form = document.getElementById('contactForm');
    if (form) {
        const submitBtn = document.getElementById('submitBtn');
        let formFeedback = document.getElementById('formFeedback');

        if (!formFeedback) {
            formFeedback = document.createElement('p');
            formFeedback.id = 'formFeedback';
            formFeedback.style.cssText = 'margin-top:1rem;font-size:0.85rem;letter-spacing:0.05em;display:none;';
            form.appendChild(formFeedback);
        }

        function showFeedback(msg, ok) {
            formFeedback.textContent = msg;
            formFeedback.style.color = ok ? '#4ade80' : '#f87171';
            formFeedback.style.display = 'block';
        }

        function setLoading(loading) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Enviando...' : 'Enviar mensagem';
            submitBtn.style.opacity = loading ? '0.6' : '';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            formFeedback.style.display = 'none';

            const name    = form.name.value.trim();
            const email   = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                showFeedback('Preencha todos os campos antes de enviar.', false);
                return;
            }

            if (FORMSPREE_ID === 'FORMSPREE_ID') {
                showFeedback('Formulário ainda não configurado. Fala com o admin.', false);
                return;
            }

            setLoading(true);

            try {
                const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form),
                });

                if (res.ok) {
                    showFeedback('Mensagem enviada! A gente te responde em breve.', true);
                    form.reset();
                } else {
                    const data = await res.json().catch(() => ({}));
                    const msg = data.errors
                        ? data.errors.map(err => err.message).join(', ')
                        : 'Algo deu errado. Tente novamente ou manda DM no Instagram.';
                    showFeedback(msg, false);
                }
            } catch {
                showFeedback('Sem conexão. Tente novamente ou manda DM no Instagram.', false);
            } finally {
                setLoading(false);
            }
        });
    }

    // ——— Venue cards pulse on hover ———
    document.querySelectorAll('.venue-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(107,33,168,0.12)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });

    // ——— Gallery items — subtle tilt effect ———
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
            item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    // ——— Marquee pause on tab hidden ———
    document.addEventListener('visibilitychange', () => {
        const marquee = document.querySelector('.marquee');
        if (marquee) {
            marquee.style.animationPlayState =
                document.hidden ? 'paused' : 'running';
        }
    });

})();
