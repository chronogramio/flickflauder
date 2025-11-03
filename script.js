// Butterfly animation controller
document.addEventListener('DOMContentLoaded', function() {
    const butterfly = document.getElementById('butterfly');
    const butterflyBody = document.querySelector('.butterfly-body');

    // Start the butterfly animation after 2.5 seconds
    setTimeout(() => {
        if (butterfly) {
            butterfly.classList.add('flying');

            // Stop all animations after the butterfly has flown away (10 seconds + 1 second buffer)
            setTimeout(() => {
                if (butterfly) {
                    // Remove all animations to save performance
                    butterfly.style.animation = 'none';
                    if (butterflyBody) {
                        butterflyBody.style.animation = 'none';
                    }
                    // Remove will-change to free up resources
                    butterfly.style.willChange = 'auto';

                    // Stop individual wing animations
                    const wings = document.querySelectorAll('.wing');
                    wings.forEach(wing => {
                        wing.style.animation = 'none';
                    });

                    // Stop antenna animation
                    const antennae = document.querySelectorAll('.antenna');
                    antennae.forEach(antenna => {
                        antenna.style.animation = 'none';
                    });
                }
            }, 11000);
        }
    }, 2500);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards for animation on scroll
    document.querySelectorAll('.service-card, .contact-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Hide scroll indicator when user scrolls down
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 0.3s ease';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    });

    // Optional: Add a subtle parallax effect to the hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optional: Add butterfly that occasionally flies across the screen
    function createFloatingButterfly() {
        const floatingButterfly = document.createElement('div');
        floatingButterfly.className = 'floating-butterfly';
        floatingButterfly.innerHTML = '🦋';
        floatingButterfly.style.cssText = `
            position: fixed;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(floatingButterfly);

        // Random starting position
        const startX = -50;
        const startY = Math.random() * window.innerHeight;
        const endX = window.innerWidth + 50;
        const endY = Math.random() * window.innerHeight;

        floatingButterfly.style.left = startX + 'px';
        floatingButterfly.style.top = startY + 'px';

        setTimeout(() => {
            floatingButterfly.style.opacity = '0.7';
            floatingButterfly.style.left = endX + 'px';
            floatingButterfly.style.top = endY + 'px';
        }, 100);

        setTimeout(() => {
            floatingButterfly.remove();
        }, 8000);
    }

    // Occasionally spawn a floating butterfly (every 30-60 seconds)
    function scheduleFloatingButterfly() {
        const delay = Math.random() * 30000 + 30000; // 30-60 seconds
        setTimeout(() => {
            createFloatingButterfly();
            scheduleFloatingButterfly();
        }, delay);
    }

    // Start the floating butterfly schedule after initial page load
    setTimeout(scheduleFloatingButterfly, 10000);
});
