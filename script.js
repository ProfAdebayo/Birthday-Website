/**
 * Ogundeji John Oluwasegun - Personal Website
 * Professional Portfolio for Healthcare Practitioner
 * Version: 1.0.0
 * Author: @ProfAdebay
 */

(function() {
    'use strict';

    // Application State
    const App = {
        confettiActive: false,
        animationFrameId: null,
        particles: [],
        
        init: function() {
            this.initConfetti();
            this.initNavigation();
            this.initScrollAnimations();
            this.initSmoothScroll();
            this.initWhatsAppTracking();
            this.initNavbarScroll();
            this.initParallax();
            this.initGalleryLightbox();
            this.initStatCounters();
        },

        // Confetti Animation System
        initConfetti: function() {
            const canvas = document.getElementById('confetti-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            let width = window.innerWidth;
            let height = window.innerHeight;
            
            const resizeCanvas = () => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            };
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas, { passive: true });
            
            const colors = [
                '#0d9488', '#14b8a6', '#0f766e', '#0ea5e9', 
                '#f59e0b', '#10b981', '#8b5cf6'
            ];
            
            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = -10;
                    this.size = Math.random() * 6 + 4;
                    this.speedY = Math.random() * 2.5 + 1.5;
                    this.speedX = Math.random() * 1.5 - 0.75;
                    this.rotation = Math.random() * 360;
                    this.rotationSpeed = Math.random() * 3 - 1.5;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.shape = Math.floor(Math.random() * 2);
                }
                
                update() {
                    this.y += this.speedY;
                    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
                    this.rotation += this.rotationSpeed;
                    
                    if (this.y > height + 10) {
                        this.y = -10;
                        this.x = Math.random() * width;
                    }
                }
                
                draw(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate((this.rotation * Math.PI) / 180);
                    ctx.fillStyle = this.color;
                    
                    if (this.shape === 0) {
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    }
                    
                    ctx.restore();
                }
            }
            
            const createParticles = () => {
                const count = width < 768 ? 40 : 80;
                for (let i = 0; i < count; i++) {
                    setTimeout(() => {
                        if (this.confettiActive) {
                            this.particles.push(new Particle());
                        }
                    }, i * 25);
                }
            };
            
            const animate = () => {
                if (!this.confettiActive) return;
                
                ctx.clearRect(0, 0, width, height);
                this.particles.forEach(p => {
                    p.update();
                    p.draw(ctx);
                });
                
                this.animationFrameId = requestAnimationFrame(animate);
            };
            
            const start = () => {
                this.confettiActive = true;
                this.particles = [];
                createParticles();
                animate();
                
                setTimeout(() => {
                    this.confettiActive = false;
                    if (this.animationFrameId) {
                        cancelAnimationFrame(this.animationFrameId);
                    }
                    ctx.clearRect(0, 0, width, height);
                }, 12000);
            };
            
            // Initialize on load
            setTimeout(start, 500);
            
            // Re-trigger on banner click
            const banner = document.querySelector('.birthday-banner');
            if (banner) {
                banner.style.cursor = 'pointer';
                banner.addEventListener('click', () => {
                    if (!this.confettiActive) {
                        start();
                    }
                });
            }
        },

        // Mobile Navigation
        initNavigation: function() {
            const toggle = document.querySelector('.nav-toggle');
            const menu = document.querySelector('.nav-menu');
            
            if (!toggle || !menu) return;
            
            const closeMenu = () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            };
            
            toggle.addEventListener('click', () => {
                const isOpen = menu.classList.contains('active');
                if (isOpen) {
                    closeMenu();
                } else {
                    toggle.classList.add('active');
                    menu.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
            
            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', closeMenu);
            });
            
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    closeMenu();
                }
            });
        },

        // Scroll-triggered Animations
        initScrollAnimations: function() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px' });
            
            const elements = document.querySelectorAll(
                '.credential-card, .gallery-item, .contact-item, .about-image, .about-text, .stat'
            );
            
            elements.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
                observer.observe(el);
            });
        },

        // Smooth Scroll Navigation
        initSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        const navHeight = document.querySelector('.navbar').offsetHeight;
                        const position = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                        window.scrollTo({ top: position, behavior: 'smooth' });
                    }
                });
            });
        },

        // WhatsApp Interaction Tracking
        initWhatsAppTracking: function() {
            const whatsappElements = document.querySelectorAll('a[href^="https://wa.me"]');
            
            whatsappElements.forEach(el => {
                el.addEventListener('click', () => {
                    el.style.transform = 'scale(0.95)';
                    setTimeout(() => el.style.transform = '', 150);
                });
            });
            
            // Floating button visibility
            const floatBtn = document.querySelector('.whatsapp-float');
            if (floatBtn) {
                const toggleVisibility = () => {
                    const scrollY = window.scrollY;
                    const threshold = window.innerHeight * 0.8;
                    
                    floatBtn.style.opacity = scrollY < threshold ? '0' : '1';
                    floatBtn.style.pointerEvents = scrollY < threshold ? 'none' : 'auto';
                };
                
                window.addEventListener('scroll', toggleVisibility, { passive: true });
                toggleVisibility();
            }
        },

        // Navbar Shadow on Scroll
        initNavbarScroll: function() {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            
            window.addEventListener('scroll', () => {
                navbar.style.boxShadow = window.scrollY > 100 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    : 'none';
            }, { passive: true });
        },

        // Parallax Effect
        initParallax: function() {
            const heroBg = document.querySelector('.hero-bg');
            if (!heroBg) return;
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
            }, { passive: true });
        },

        // Gallery Lightbox
        initGalleryLightbox: function() {
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('click', function() {
                    const img = this.querySelector('img');
                    if (!img) return;
                    
                    const lightbox = document.createElement('div');
                    lightbox.className = 'lightbox';
                    lightbox.innerHTML = `
                        <div class="lightbox-overlay"></div>
                        <img src="${img.src}" alt="${img.alt}" class="lightbox-img">
                        <button class="lightbox-close" aria-label="Close">&times;</button>
                    `;
                    
                    document.body.appendChild(lightbox);
                    document.body.style.overflow = 'hidden';
                    
                    const close = () => {
                        lightbox.style.opacity = '0';
                        setTimeout(() => {
                            lightbox.remove();
                            document.body.style.overflow = '';
                        }, 300);
                    };
                    
                    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
                    lightbox.querySelector('.lightbox-overlay').addEventListener('click', close);
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') close();
                    });
                });
            });
        },

        // Statistics Counter Animation
        initStatCounters: function() {
            const statsSection = document.querySelector('.about-stats');
            if (!statsSection) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(statsSection);
        },
        
        animateCounters: function() {
            document.querySelectorAll('.stat-number').forEach(counter => {
                const target = parseInt(counter.textContent);
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                let current = 0;
                const increment = target / 40;
                const duration = 1800;
                const step = duration / 40;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, step);
            });
        }
    };

    // Initialize on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();