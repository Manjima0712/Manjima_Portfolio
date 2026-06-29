document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Preloader Timeout
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });

    // Fallback if window load takes too long
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 3000);

    // 2. Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // 3. Initialize Typed.js
    const typedTextEl = document.getElementById('typed-text');
    if (typedTextEl) {
        new Typed('#typed-text', {
            strings: ['Data Scientist', 'AI/ML Engineer', 'Software Engineer', 'Full Stack Developer', 'Python Developer', 'AI Enthusiast'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true
        });
    }

    // 4. Initialize Vanilla Tilt (for cards and wrappers)
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
        });
    }

    // 5. Custom Cursor Glow & Movement
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const mouseGlow = document.getElementById('mouse-glow');
    
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
 
            // Show cursor on move
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
 
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
 
            // Animate outline cursor with delay for smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            // Move ambient glow background spotlight
            if (mouseGlow) {
                mouseGlow.style.left = `${posX}px`;
                mouseGlow.style.top = `${posY}px`;
            }
        });
 
        // Hide cursor if it leaves the window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
 
        // Hover effect for links & buttons
        const hoverables = document.querySelectorAll('a, button, .tool-badge, .interest-badge, .status-badge, .timeline-content, .skill-card-glow, .project-card-glow, .achievement-card, .cert-card-glow, .edu-card, input, textarea');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.borderColor = 'var(--color-cyan)';
            });
            item.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'var(--color-purple)';
            });
        });
    }

    // 6. Navigation and Scroll Progress Bar
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const floatingResume = document.getElementById('floating-resume');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Navbar scrolled state
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Scroll Progress Update
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Back to Top Button Show/Hide
        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Floating Resume Button Show/Hide
        if (floatingResume) {
            if (scrollTop > 300) {
                floatingResume.style.display = 'block';
            } else {
                floatingResume.style.display = 'none';
            }
        }
    });

    // 7. Stat Counters Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const runCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Trigger statistics counters when Hero/Counters element becomes visible (on Home page)
    const countersEl = document.querySelector('.hero-counters');
    if (countersEl) {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(countersEl);
    } else {
        // If not on Home page, run immediately if counters exist
        if (counters.length > 0) {
            runCounters();
        }
    }

    // 8. Contact Form Handling (AJAX)
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');

    if (contactForm && formAlert) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const spinner = document.getElementById('btnSpinner');
            const btnText = document.getElementById('btnText');

            // Show loading spinner
            if (spinner) spinner.classList.remove('d-none');
            if (btnText) btnText.classList.add('opacity-50');
            if (submitBtn) submitBtn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const data = await response.json();
                
                formAlert.classList.remove('d-none', 'alert-danger', 'alert-success');
                
                if (response.ok && data.success) {
                    formAlert.classList.add('alert-success');
                    formAlert.innerText = data.message;
                    contactForm.reset();
                } else {
                    formAlert.classList.add('alert-danger');
                    formAlert.innerText = data.message || 'Validation error occurred.';
                }
            } catch (error) {
                formAlert.classList.remove('d-none', 'alert-success');
                formAlert.classList.add('alert-danger');
                formAlert.innerText = 'Unable to send message. Please check your internet connection and try again.';
            } finally {
                // Reset button state
                if (spinner) spinner.classList.add('d-none');
                if (btnText) btnText.classList.remove('opacity-50');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }



    // 10. Projects Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length > 0 && projectItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to current button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});
