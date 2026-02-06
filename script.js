// ============================================
// SOUND MANAGER (SYNTHESIZED AUDIO)
// ============================================
class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.1; // Keep it subtle
        this.masterGain.connect(this.ctx.destination);
    }

    playHover() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playClick() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================
console.log('INITIALIZING CORE SYSTEM...');

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INIT SOUNDS
    const soundManager = new SoundManager();
    
    // Attach to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => soundManager.playHover());
        el.addEventListener('click', () => soundManager.playClick());
    });

    // 2. LIQUID DISTORTION (SVG + GSAP)
    const turbulence = document.querySelector('feTurbulence');
    const displacement = document.querySelector('feDisplacementMap');
    
    if (turbulence && displacement) {
        gsap.utils.toArray('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(turbulence, {
                    attr: { baseFrequency: 0.05 },
                    duration: 0.4,
                    ease: 'power2.out'
                });
                gsap.to(displacement, {
                    attr: { scale: 50 },
                    duration: 0.4
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(turbulence, {
                    attr: { baseFrequency: 0 },
                    duration: 0.4,
                    ease: 'power2.in'
                });
                gsap.to(displacement, {
                    attr: { scale: 0 },
                    duration: 0.4
                });
            });
        });
    }

    // 3. INIT SMOOTH SCROLL (LENIS)
    // ... (Rest of existing code)
    let lenis;
    if (typeof Lenis !== 'undefined' && window.innerWidth > 768) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    } else {
        console.warn('Lenis not loaded, falling back to native scroll');
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // 2. CUSTOM CURSOR
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only run cursor logic on desktop
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.transform = `translate(-50%, -50%) translate(${posX}px, ${posY}px)`;

            // Outline follows with lag
            cursorOutline.style.transform = `translate(-50%, -50%) translate(${posX}px, ${posY}px)`;
        });
    }

    // Cursor Hover Effects
    const hoverables = document.querySelectorAll('a, button, .project-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
    });


    // 3. THREE.JS "LIVING CORE" (The Sphere)
    initThreeJS();


    // 4. GSAP ANIMATIONS
    initGSAP();


    // 5. ENHANCED PRELOADER (Wrapped in function for clarity)
    initPreloader();

    // 6. FIREBASE & OTHERS
    initFirebase();
    initClock();

    // 8. NEW: MAGIC MAGNETIC BUTTONS
    initMagneticButtons();

    // 9. NEW: TEXT MICRO-ANIMATIONS
    initTextAnimations();

    // 10. NEW: PAGE TRANSITIONS
    initPageTransitions();

});

// ... (Existing Functions) ...

// ============================================
// 8. MAGIC MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
    // Disable on mobile for UX
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const magnets = document.querySelectorAll('.magnetic-cta, .nav-link, .view-btn');
    
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            // Calculate center relative to viewport
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Distance from center
            const x = e.clientX - centerX;
            const y = e.clientY - centerY;
            
            // Move the button itself slightly towards tracking (Magnetic pull)
            gsap.to(magnet, {
                x: x * 0.2, // Strength of pull
                y: y * 0.2,
                duration: 0.5,
                ease: "power3.out"
            });

            // Move the text/icon inside even more for parallax depth
            const content = magnet.querySelector('span, .btn-text, .btn-icon');
            if(content) {
                gsap.to(content, {
                    x: x * 0.1,
                    y: y * 0.1,
                    duration: 0.5,
                    ease: "power3.out"
                });
            }
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)"
            });
            const content = magnet.querySelector('span, .btn-text, .btn-icon');
            if(content) {
                gsap.to(content, {
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });
}

// ============================================
// 9. TEXT MICRO-ANIMATIONS
// ============================================
function initTextAnimations() {
    // Only run if SplitType is loaded
    if(typeof SplitType === 'undefined') return;

    // Select headings to animate
    const splitTargets = document.querySelectorAll('.hero-text, h2');
    
    splitTargets.forEach(target => {
        // Split text
        const split = new SplitType(target, { types: 'chars, words' });
        
        // Remove visibility: hidden from CSS now that we are ready
        target.classList.remove('reveal-text');
        
        // Animate chars
        gsap.from(split.chars, {
            scrollTrigger: {
                trigger: target,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            stagger: 0.02,
            duration: 1,
            ease: 'power4.out'
        });
    });
}

// ============================================
// 10. PAGE TRANSITIONS
// ============================================
function initPageTransitions() {
    const overlay = document.querySelector('.transition-overlay');
    const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])'); // Internal links only

    // Initial Load Reveal
    if(overlay) {
        gsap.to(overlay, {
            scaleY: 0,
            duration: 1.2,
            ease: "power4.inOut",
            delay: 0.2
        });
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            // Animate Overlay In
            gsap.to(overlay, {
                scaleY: 1,
                transformOrigin: 'bottom',
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });
}

// Helper Wrappers for existing code to keep file clean
function initPreloader() {
    const loaderPercent = document.querySelector('.loader-percent');
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderText = document.querySelector('.loader-text');
    
    // Status messages for "Cyberpunk" feel
    const statusMessages = [
        "INITIALIZING CORE...",
        "LOADING 3D ASSETS...",
        "CONNECTING TO NEURAL NET...",
        "CALIBRATING OPTICS...",
        "SYNCHRONIZING DATA...",
        "SYSTEM ONLINE"
    ];

    let progress = 0;
    const totalDuration = 2000; 
    const intervalTime = 20; 
    const increment = (100 / (totalDuration / intervalTime)); 

    const loaderInterval = setInterval(() => {
        progress += increment;
        
        // Randomize progress slightly
        if(Math.random() > 0.8) progress += 2;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loaderInterval);
            
            // Final state
            if(loaderPercent) loaderPercent.textContent = "100%";
            if(loaderProgress) loaderProgress.style.width = "100%";
            if(loaderText) loaderText.textContent = "SYSTEM READY";
            
            // Exit animation
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 500);
        } else {
            // Update UI
            if(loaderPercent) loaderPercent.textContent = Math.floor(progress) + "%";
            if(loaderProgress) loaderProgress.style.width = progress + "%";
            
            // Cycle status text
            if(Math.floor(progress) % 20 === 0 && Math.floor(progress) < 90) {
                const msgIndex = (Math.floor(progress) / 20) % statusMessages.length;
                if(loaderText) loaderText.textContent = statusMessages[msgIndex];
            }
        }
    }, intervalTime);
}

// I will adjust the target content to match exactly where I want to inject.



// ============================================
// THREE.JS IMPLEMENTATION
// ============================================
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Check if container exists
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = ''; // Clear previous if any
    container.appendChild(renderer.domElement);

    // Geometry
    const detail = window.innerWidth < 768 ? 16 : 64;
    const geometry = new THREE.IcosahedronGeometry(2, detail);
    
    // Material
    const material = new THREE.MeshBasicMaterial({
        color: 0x444444,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const sphere = new THREE.Mesh(geometry, material);
    const coreGroup = new THREE.Group();
    coreGroup.add(sphere);
    scene.add(coreGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // SCROLL INTERACTION (Velocity)
    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        // Calculate speed
        scrollSpeed = (currentScrollY - lastScrollY) * 0.005;
        lastScrollY = currentScrollY;
    });

    // CLICK INTERACTION (Pulse)
    document.addEventListener('mousedown', () => {
        gsap.to(coreGroup.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
        });
        gsap.to(material, {
            opacity: 0.8,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    const originalPositions = geometry.attributes.position.array.slice();
    const count = geometry.attributes.position.count;

    function animate() {
        const time = clock.getElapsedTime();

        // Dampen scroll speed back to 0
        scrollSpeed *= 0.95;

        // Rotation
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        coreGroup.rotation.y += 0.5 * (targetX - coreGroup.rotation.y) + scrollSpeed; // Spin faster on scroll
        coreGroup.rotation.x += 0.5 * (targetY - coreGroup.rotation.x);
        coreGroup.rotation.z += 0.005;

        // Vertex Displacement
        const positionAttribute = geometry.attributes.position;
        const positions = positionAttribute.array;

        // Intensity based on scroll
        const distortionIntensity = 0.05 + Math.abs(scrollSpeed) * 2; 

        for (let i = 0; i < count; i++) {
            const x = originalPositions[i * 3];
            const y = originalPositions[i * 3 + 1];
            const z = originalPositions[i * 3 + 2];

            // Breathing + Scroll Glitch
            // When scrolling fast, frequency increases
            const freq = 2 + Math.abs(scrollSpeed) * 10;
            const modifier = 1 + Math.sin(time * 2 + x * freq) * distortionIntensity + Math.cos(time * 1.5 + y) * distortionIntensity;
            
            positions[i * 3] = x * modifier;
            positions[i * 3 + 1] = y * modifier;
            positions[i * 3 + 2] = z * modifier;
        }
        
        positionAttribute.needsUpdate = true;
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Re-calculate detail if needed, but safe to keep constant for now
    });
}


// ============================================
// GSAP ANIMATIONS
// ============================================
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. HERO ANIMATION (On Load)
    const tl = gsap.timeline();
    
    tl.from('.hero-text .line', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 1.5 // Wait for preloader
    })
    .from('.hero-sub', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out'
    }, '-=1');

    // 2. HORIZONTAL SCROLL
    const workSection = document.querySelector('.work-section');
    const track = document.querySelector('.horizontal-track');

    // RESPONSIVE SCROLL LOGIC
    let scrollTween;

    function initScroll() {
        // Kill existing if any
        if (scrollTween) scrollTween.kill();
        
        ScrollTrigger.matchMedia({
            // DESKTOP ONLY (Horizontal)
            "(min-width: 769px)": function() {
                const scrollAmount = track.scrollWidth - window.innerWidth;
                
                scrollTween = gsap.to(track, {
                    x: -scrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: workSection,
                        start: "top top",
                        end: `+=${scrollAmount}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    }
                });
            },
            
            // MOBILE (Vertical - Native)
            "(max-width: 768px)": function() {
                // No GSAP scroll needed, CSS handles the vertical stack
                // But we might want simple fade-ins
                gsap.utils.toArray('.project-card').forEach(card => {
                    gsap.from(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                        },
                        y: 50,
                        opacity: 0,
                        duration: 0.8
                    });
                });
            }
        });
    }

    // Delay slightly to ensure metrics are correct
    setTimeout(initScroll, 500);

    // 3. ABOUT REVEAL
    gsap.from('.about-right p', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    });

    // 4. CONTACT REVEAL
    gsap.from('.huge-text div', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out'
    });

}

// ============================================
// 12. GITHUB LOCK INTERACTION
// ============================================
function initGithubLock() {
    const lockBtn = document.querySelector('.github-lock');
    if(lockBtn) {
        lockBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("🔒 Access Restricted\n\nTo view my source code, please submit a request via the contact form.\nThis ensures intellectual property protection.");
        });
    }
}
// Add to init
document.addEventListener('DOMContentLoaded', () => {
    initGithubLock();
    initProjectViewer();
});


// ============================================
// 13. PROJECT VIEWER MODAL
// ============================================
function initProjectViewer() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const iframe = document.getElementById('project-frame');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');
    const loader = document.querySelector('.modal-loader');
    const externalLink = document.querySelector('.modal-external');
    
    // Open Modal
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = btn.getAttribute('href');
            
            // Only capture valid external URLs (not hash links)
            if (url && url !== '#' && !url.startsWith('mailto')) {
                e.preventDefault();
                openModal(url);
            }
        });
    });

    function openModal(url) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
        
        // Setup Loader
        loader.style.display = 'block';
        iframe.classList.remove('loaded');
        
        // Load URL
        iframe.src = url;
        externalLink.href = url;
        
        // Iframe Load Event
        iframe.onload = () => {
            loader.style.display = 'none';
            iframe.classList.add('loaded');
        };
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
        
        // Clear iframe to stop media/reset state
        setTimeout(() => {
            iframe.src = '';
            iframe.classList.remove('loaded');
        }, 500); // Wait for transition
    }

    // Close Events
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Esc Key Close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

