document.addEventListener('DOMContentLoaded', () => {
    // ===== Preloader =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('loaded'), 800);
    }

    // ===== Cursor Personalizado =====
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 1024 && cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 5 + 'px';
            cursor.style.top = e.clientY - 5 + 'px';

            setTimeout(() => {
                cursorFollower.style.left = e.clientX - 20 + 'px';
                cursorFollower.style.top = e.clientY - 20 + 'px';
            }, 50);
        });

        document.querySelectorAll('a, button, .portfolio-item, .service-card, input, textarea, select').forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
        });
    }

    // ===== Navegación Scroll =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 80);
        if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    // ===== Menú Móvil =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== Navegación Activa (Scroll Spy) =====
    const sections = document.querySelectorAll('section[id]');

    const setActiveLink = () => {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    };

    if (sections.length) window.addEventListener('scroll', setActiveLink);

    // ===== Theme Toggle =====
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('ditec-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('ditec-theme', isDark ? 'light' : 'dark');

        themeIcon.classList.toggle('fa-moon');
        themeIcon.classList.toggle('fa-sun');
    });

    // ===== Particles =====
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const colors = ['#07F967', '#38ED22', '#6DC69A', '#4ADE80'];
        const particleCount = window.innerWidth < 768 ? 20 : 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // ===== Animaciones Scroll (AOS-like) =====
    const aosElements = document.querySelectorAll('[data-aos]');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    aosElements.forEach(el => fadeInObserver.observe(el));

    // ===== Contador de Estadísticas =====
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * (target - start) + start);
            counter.textContent = current;

            if (progress < 1) requestAnimationFrame(updateCounter);
        };

        requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ===== Filter Portfolio =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    item.style.animation = 'none';
                    void item.offsetHeight;
                    item.style.animation = 'portfolioIn 0.6s ease both';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ===== Slider Testimonios =====
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    let slideIndex = 0;
    const totalSlides = slides.length;

    const updateSlider = () => {
        if (track) {
            track.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
    };

    const nextSlide = () => {
        slideIndex = (slideIndex + 1) % totalSlides;
        updateSlider();
    };

    const prevSlide = () => {
        slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    };

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    setInterval(nextSlide, 6000);

    // ===== Formulario de Contacto =====
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name.trim()) {
                showToast('Por favor, ingresa tu nombre', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                showToast('Por favor, ingresa un email válido', 'error');
                return;
            }

            if (!service) {
                showToast('Por favor, selecciona un servicio', 'error');
                return;
            }

            if (message.trim().length < 10) {
                showToast('El mensaje debe tener al menos 10 caracteres', 'error');
                return;
            }

            const btn = contactForm.querySelector('.btn');
            const originalContent = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span>Enviando...</span><i class="fas fa-spinner fa-spin"></i>';

            setTimeout(() => {
                btn.innerHTML = '<span>¡Mensaje Enviado!</span><i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                contactForm.reset();
                const labels = contactForm.querySelectorAll('.form-group label');
                labels.forEach(label => label.classList.remove('shifted'));

                showToast('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // ===== Newsletter =====
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(email)) {
                showToast('¡Suscripción exitosa! Bienvenido/a a DITEC.', 'success');
                newsletterForm.reset();
            } else {
                showToast('Por favor, ingresa un email válido', 'error');
            }
        });
    }

    // ===== Toast Notification =====
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: -400px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: #ffffff;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 99999;
            transition: right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 350px;
        `;

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}" style="margin-right: 10px;"></i>${message}`;
        document.body.appendChild(toast);

        void toast.offsetHeight;
        toast.style.right = '20px';

        setTimeout(() => {
            toast.style.right = '-400px';
            setTimeout(() => toast.remove(), 600);
        }, 4000);
    }

    // ===== Back to Top =====
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Tilt Effect en Service Cards =====
    if (window.innerWidth > 1024) {
        const cards = document.querySelectorAll('.service-card:not(.featured)');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 25;
                const rotateY = (x - centerX) / 25;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});