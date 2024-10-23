document.addEventListener('DOMContentLoaded', () => {
    // Matrix Effect
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    const headerHeight = document.querySelector('header').offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - headerHeight;

    const katakana = 'アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポヴッ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = Array.from({ length: columns }).fill(1);

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    setInterval(draw, 30);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            document.body.classList.add('scrolled');
        }
    });

    // Hide matrix effect on hover or click
    const matrix = document.getElementById('matrix');
    matrix.addEventListener('mouseover', () => {
        document.body.classList.add('scrolled');
    });
    matrix.addEventListener('click', () => {
        document.body.classList.add('scrolled');
    });

    // Hover Effects for Navigation Links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.color = '#FF00FF';
        });
        link.addEventListener('mouseout', () => {
            link.style.color = '#00FF00';
        });
    });

    // Hover Effects for Grid Items
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.transform = 'scale(1.05)';
            item.style.backgroundColor = '#222';
        });
        item.addEventListener('mouseout', () => {
            item.style.transform = 'scale(1)';
            item.style.backgroundColor = '#111';
        });
    });

    // Form Submission Alert
    const form = document.querySelector('form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        alert('Message sent!');
    });

    // Scroll Animations for Sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transition = 'opacity 1s ease-in-out';
    });

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        sections.forEach(section => {
            if (scrollPosition > section.offsetTop) {
                section.style.opacity = 1;
            }
        });
    });

    // Open external links in a new tab
    const links = document.querySelectorAll('a[target="_blank"]');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(link.href, '_blank');
        });
    });
});


