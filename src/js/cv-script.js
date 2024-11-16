// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initMatrixBackground();
    initNavigation();
    initAccordions();
    initModals();
    initContactForm();
    setupMobileNav();
    removeLoadingScreen();
});

// Matrix Background
function initMatrixBackground() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((drop, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drop * fontSize);

            if (drop * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            } else {
                drops[i]++;
            }
        });

        animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    // Cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}

// Navigation
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            
            // Update active states
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Smooth scroll on mobile
                if (window.innerWidth < 768) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Add to URL without reload
            history.pushState(null, '', `#${targetId}`);
        });
    });

    // Handle initial load and browser navigation
    function handleHash() {
        const hash = location.hash.slice(1) || 'about';
        const targetTab = document.querySelector(`[data-tab="${hash}"]`);
        if (targetTab) targetTab.click();
    }

    window.addEventListener('hashchange', handleHash);
    handleHash();
}

// Accordion functionality
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        
        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isActive = accordion.classList.contains('active');
            
            // Close other accordions in the same section
            const parentSection = accordion.closest('.content-section');
            parentSection.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordion) {
                    item.classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current accordion
            accordion.classList.toggle('active');
            content.style.maxHeight = isActive ? null : `${content.scrollHeight}px`;
            
            // Add smooth scroll on mobile
            if (window.innerWidth < 768 && !isActive) {
                accordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Modal handling
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) openModal(modal);
        });
    });

    document.querySelectorAll('.close-modal').forEach(closer => {
        closer.addEventListener('click', () => {
            const modal = closer.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Close modal on outside click
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('quick-contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        }
    });
}

// Mobile navigation
function setupMobileNav() {
    let lastScroll = 0;
    const nav = document.querySelector('.matrix-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (window.innerWidth < 768) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        } else {
            nav.style.transform = 'translateY(0)';
        }
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notification-container');
    if (container) {
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

function removeLoadingScreen() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 500);
    }
}

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});