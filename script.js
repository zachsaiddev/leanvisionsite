// ============================================
// Lean Vision Limited
// Site Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Mobile Navigation ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        header.classList.toggle('menu-open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navLinks.classList.remove('open');
            header.classList.remove('menu-open');
            document.body.style.overflow = '';
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');

    const observerOptions = {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinkElements.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll(
        '.about-card, .service-card, .approach-card, .industry-tag, .contact-detail'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Staggered Reveal for Grid Items ---
    const grids = document.querySelectorAll('.services-grid, .approach-grid, .industries-grid');

    grids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.08}s`;
        });
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');

    const blockedEmailDomains = [
        'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.fr',
        'yahoo.de', 'yahoo.it', 'yahoo.es', 'yahoo.ca', 'yahoo.com.au',
        'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de',
        'outlook.com', 'outlook.co.uk', 'live.com', 'live.co.uk', 'msn.com',
        'aol.com', 'icloud.com', 'me.com', 'mac.com',
        'mail.com', 'email.com', 'protonmail.com', 'proton.me',
        'zoho.com', 'yandex.com', 'gmx.com', 'gmx.co.uk',
        'fastmail.com', 'tutanota.com', 'tuta.io',
        'hey.com', 'pm.me', 'inbox.com', 'mail.ru',
        'btinternet.com', 'sky.com', 'virginmedia.com', 'talktalk.net',
        'ntlworld.com', 'blueyonder.co.uk'
    ];

    function isPersonalEmail(email) {
        const domain = email.split('@')[1]?.toLowerCase();
        return !domain || blockedEmailDomains.includes(domain);
    }

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    emailInput.addEventListener('input', () => {
        emailError.style.display = 'none';
        emailInput.classList.remove('input-error');
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (isPersonalEmail(email)) {
            emailError.style.display = 'block';
            emailInput.classList.add('input-error');
            emailInput.focus();
            return;
        }

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);

        fetch('https://formsubmit.co/ajax/info@leanvision.co.uk', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            btn.textContent = 'Message Sent!';
            btn.style.background = 'var(--color-primary)';
            btn.style.color = '#fff';
            contactForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 3000);
        })
        .catch(error => {
            btn.textContent = 'Error - Try Again';
            btn.style.background = '#ef4444';
            btn.disabled = false;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
        });
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
