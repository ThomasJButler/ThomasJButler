// Check if we're on the art page
const isArtPage = window.location.pathname.includes('art.html');

// Matrix Rain Effect 
// IMPLEMENT AND REMOVE - Change this to the landing page example in next iteration 
const canvas = document.getElementById('matrixCanvas');
let ctx;
let matrixEnabled = !isArtPage;
let isVincentGalleryOpen = isArtPage;
let frameCount = 0;

if (canvas) {
    ctx = canvas.getContext('2d');
} else {
    console.log('Matrix canvas not found. This might be the art page.');
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const katakana = '101010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン010010101';
const characters = katakana.split('');

const fontSize = 14;
const columns = canvas ? canvas.width / fontSize : 0;

const drops = [];
const colors = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -(canvas ? canvas.height : 0);
    colors[i] = Math.random() < 0.99 ? '#0F0' : (Math.random() < 0.1 ? '#00FFFF' : '#FF2800');
}

let fadeInterval;
let fadeAmount = 0;

function setFadeInterval() {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (fadeAmount < 0.05) fadeAmount += 0.001;
    }, 100);
}

setFadeInterval();

function drawMatrix() {
    if (!canvas || !matrixEnabled || isVincentGalleryOpen) return;

    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillStyle = colors[i];
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (frameCount % 3 === 0) {
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                if (Math.random() < 0.05) {
                    colors[i] = Math.random() < 0.5 ? '#00FFFF' : '#FF2800';
                } else {
                    colors[i] = '#0F0';
                }
            }
            drops[i]++;
        }
    }

    frameCount++;
}

function animate() {
    if (canvas) {
        drawMatrix();
        requestAnimationFrame(animate);
    }
}

if (!isArtPage) {
    animate();
}

// Scroll event to control visibility
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        fadeAmount = Math.min(fadeAmount + 0.01, 0.05);
    } else {
        fadeAmount = Math.max(fadeAmount - 0.01, 0);
    }
    lastScrollTop = st <= 0 ? 0 : st;
    setFadeInterval();
});

// Mouse interaction
if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
        const x = Math.floor(e.clientX / fontSize);
        const y = Math.floor(e.clientY / fontSize);
        drops[x] = y;
    });

    // Touch interaction for mobile devices
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const x = Math.floor(touch.clientX / fontSize);
        const y = Math.floor(touch.clientY / fontSize);
        drops[x] = y;
    }, { passive: false });

    // Toggle matrix effect on click
    canvas.addEventListener('click', () => {
        matrixEnabled = !matrixEnabled;
    });
}

function glitchEffect(element) {
    if (element.dataset.glitching === 'true') return;
    element.dataset.glitching = 'true';

    const originalText = element.textContent;
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    
    let iterations = 0;
    const maxIterations = originalText.length;
    const glitchDuration = 1000 + Math.random() * 1000;
    
    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');
        
        if (iterations >= maxIterations) {
            clearInterval(interval);
            element.dataset.glitching = 'false';
            setTimeout(() => {
                element.dataset.cooldown = 'false';
            }, 5000);
        }
        
        iterations += 1;
    }, glitchDuration / maxIterations);
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle art page
    if (isArtPage) {
        const vincentGallery = document.querySelector('.vincent-gallery');
        if (vincentGallery) {
            vincentGallery.style.display = 'grid';
        }
        if (canvas) {
            canvas.style.display = 'none';
        }
    }

    // Apply glitch effect and subtle animation to all headings
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
        heading.style.transition = 'transform 0.3s ease-in-out';
        
        heading.addEventListener('mouseover', () => {
            if (heading.dataset.cooldown !== 'true') {
                glitchEffect(heading);
                heading.dataset.cooldown = 'true';
            }
        });

        heading.addEventListener('mouseenter', () => {
            heading.style.transform = 'scale(1.05)';
        });

        heading.addEventListener('mouseleave', () => {
            heading.style.transform = 'scale(1)';
        });
    });

    // Periodic random glitch
    setInterval(() => {
        const headings = document.querySelectorAll('h1, h2, h3');
        const randomHeading = headings[Math.floor(Math.random() * headings.length)];
        if (randomHeading.dataset.cooldown !== 'true') {
            glitchEffect(randomHeading);
            randomHeading.dataset.cooldown = 'true';
        }
    }, 10000);

    // Scroll reveal effect
    function reveal() {
        const reveals = document.querySelectorAll(".reveal");
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            } else {
                reveals[i].classList.remove("active");
            }
        }
    }

    window.addEventListener("scroll", reveal);

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Validation and Submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                form.submit();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Parallax effect for header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            const scrollPosition = window.scrollY;
            header.style.backgroundPositionY = -scrollPosition * 0.5 + 'px';
        }
    });

    // Interactive project grid
    const projectItems = document.querySelectorAll('#projects .grid-item');
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    // Typing effect for introduction
    function typeWriter(element, text, speed) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    const introText = document.querySelector('#introduction p');
    if (introText) {
        const text = introText.innerHTML;
        introText.innerHTML = '';
        typeWriter(introText, text, 50);
    }

    // Add 'reveal' class to all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
    });

    // Initialize reveal effect on load
    reveal();

    // Toggle navigation menu on mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('show');
        });
    }

    // Lazy loading for images
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }

    // Van Gogh Infinity Gallery
    const vincentItems = document.querySelectorAll('.vincent-item');
    const vincentGallery = document.querySelector('.vincent-gallery');
    const openGalleryButton = document.querySelector('#open-vincent-gallery');
    const closeGalleryButton = document.querySelector('#close-vincent-gallery');

    function openVincentGallery() {
        isVincentGalleryOpen = true;
        matrixEnabled = false;
        if (canvas) canvas.style.display = 'none';
        if (vincentGallery) vincentGallery.style.display = 'grid';
    }

    function closeVincentGallery() {
        isVincentGalleryOpen = false;
        matrixEnabled = true;
        if (canvas) canvas.style.display = 'block';
        if (vincentGallery) vincentGallery.style.display = 'none';
    }

    function applyHoverEffect(event) {
        if (!vincentGallery) return;
        const galleryRect = vincentGallery.getBoundingClientRect();
        const mouseX = (event.clientX - galleryRect.left) / galleryRect.width;
        const mouseY = (event.clientY - galleryRect.top) / galleryRect.height;

        vincentItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = (itemRect.left + itemRect.right) / 2 - galleryRect.left;
            const itemCenterY = (itemRect.top + itemRect.bottom) / 2 - galleryRect.top;

            const deltaX = mouseX * galleryRect.width - itemCenterX;
            const deltaY = mouseY * galleryRect.height - itemCenterY;

            const angleX = (deltaY / galleryRect.height) * 30;
            const angleY = (deltaX / galleryRect.width) * -30;

            item.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
    }

    function resetHoverEffect() {
        vincentItems.forEach(item => {
            item.style.transform = 'rotateX(0) rotateY(0)';
        });
    }

    if (openGalleryButton) {
        openGalleryButton.addEventListener('click', openVincentGallery);
    }

    if (closeGalleryButton) {
        closeGalleryButton.addEventListener('click', closeVincentGallery);
    }

    if (vincentGallery) {
        vincentGallery.addEventListener('mousemove', applyHoverEffect);
        vincentGallery.addEventListener('mouseleave', resetHoverEffect);
    }
});

// Function to show notifications
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    notification.offsetHeight;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}