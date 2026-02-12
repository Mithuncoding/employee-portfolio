// ============================================
// SOUND MANAGER (SYNTHESIZED AUDIO)
// ============================================
class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)(); // Renamed ctx to context
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = 0.1; // Keep it subtle
        this.masterGain.connect(this.context.destination);
        this.initialized = true; // Added for new logic
        this.isMuted = false; // Added for new logic
    }

    playHoverSound() { // Renamed from playHover
        // Haptic Feedback (Mobile)
        if (navigator.vibrate) navigator.vibrate(5); // Light tick

        if (!this.initialized || this.isMuted) return;
        
        if (this.context.state === 'suspended') this.context.resume(); // Changed ctx to context
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter(); // Added filter
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        // Quick high pitch chirp
        osc.frequency.setValueAtTime(800 + Math.random() * 200, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.context.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, this.context.currentTime); // Very quiet
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);

        osc.start();
        osc.stop(this.context.currentTime + 0.1);
    }

    playClickSound() { // Renamed from playClick
        // Haptic Feedback (Mobile)
        if (navigator.vibrate) navigator.vibrate(20); // Heavy click

        if (!this.initialized || this.isMuted) return;

        if (this.context.state === 'suspended') this.context.resume(); // Changed ctx to context
        // Heavy impact
        const osc = this.context.createOscillator(); // Changed ctx to context
        const gain = this.context.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.2);

        osc.start();
        osc.stop(this.context.currentTime + 0.2);
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
        el.addEventListener('mouseenter', () => soundManager.playHoverSound());
        el.addEventListener('click', () => soundManager.playClickSound());
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
    initContactForm();

    // 8. NEW: MAGIC MAGNETIC BUTTONS
    initMagneticButtons();

    // 9. NEW: TEXT MICRO-ANIMATIONS
    initTextAnimations();

    // 10. NEW: PAGE TRANSITIONS
    initPageTransitions();

    // 11. 3D PARALLAX TILT ON PROJECT CARDS
    initCardTilt();

    // 12. ANIMATED STAT COUNTERS
    initStatCounters();

    // 13. SECTION FADE-UP REVEALS
    initSectionReveals();

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

// ============================================
// FIREBASE INITIALIZATION
// ============================================
function initFirebase() {
    try {
        const firebaseConfig = {
            apiKey: "AIzaSyDummyKeyReplace",
            authDomain: "portfolio-contact.firebaseapp.com",
            projectId: "portfolio-contact",
            storageBucket: "portfolio-contact.appspot.com",
            messagingSenderId: "000000000000",
            appId: "1:000000000000:web:0000000000000000"
        };

        // Only init if Firebase SDK loaded and not already initialized
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized");
        }
    } catch (e) {
        console.warn("Firebase init skipped:", e.message);
    }
}

// ============================================
// LIVE CLOCK (BENGALURU IST)
// ============================================
function initClock() {
    const clockEl = document.getElementById('local-time');
    if (!clockEl) return;

    function updateTime() {
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        };
        clockEl.textContent = now.toLocaleTimeString('en-IN', options);
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// ============================================
// CONTACT FORM HANDLER
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) return;

        // Try to save to Firebase Firestore
        try {
            if (typeof firebase !== 'undefined' && firebase.apps.length) {
                const db = firebase.firestore();
                db.collection('contacts').add({
                    name: name,
                    email: email,
                    message: message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (e) {
            console.warn("Firestore save skipped:", e.message);
        }

        // Show success toast
        showFormToast("✅ Message sent! I'll get back to you soon.");
        form.reset();
    });

    function showFormToast(msg) {
        const existing = document.querySelector('.form-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'form-toast';
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: '#4cc9f0',
            color: 'black',
            padding: '15px 30px',
            borderRadius: '50px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            opacity: '0',
            transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
            zIndex: '100000',
            pointerEvents: 'none'
        });

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
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
    
    // Vectors for physics
    const mouseVector = new THREE.Vector3();
    const tempVector = new THREE.Vector3();

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
        
        // Update mouse vector for 3D calculation (normalized -1 to 1)
        mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseVector.z = 0.5; // Plane depth
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

    // GYROSCOPE INTERACTION (Mobile Parallax)
    window.addEventListener('deviceorientation', (event) => {
        if (!event.beta) return;
        
        // Beta: -180 to 180 (front/back tilt)
        // Gamma: -90 to 90 (left/right tilt)
        
        // Normalize to -1 to 1 range approx
        const tiltX = Math.min(Math.max(event.gamma, -45), 45) / 45;
        const tiltY = Math.min(Math.max(event.beta, -45), 45) / 45;
        
        mouseX = tiltX * 500;
        mouseY = tiltY * 500;
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
        targetX = mouseX * 0.0005; // Slower, heavier rotation
        targetY = mouseY * 0.0005;

        // Smooth rotation with "Weight"
        coreGroup.rotation.y += 0.05 * (targetX - coreGroup.rotation.y) + scrollSpeed; // Spin faster on scroll
        coreGroup.rotation.x += 0.05 * (targetY - coreGroup.rotation.x);
        coreGroup.rotation.z += 0.002;

        // Vertex Displacement "Liquid Metal" Effect
        const positionAttribute = geometry.attributes.position;
        const positions = positionAttribute.array;

        // Map mouse position to 3D space rough approximation for vertex distance
        // We project mouseVector to world space or just screen space distance
        
        
        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const ox = originalPositions[ix];
            const oy = originalPositions[iy];
            const oz = originalPositions[iz];

            // 1. Base Breathing (Organic)
            // Complex noise simulation using sine layering
            const noise = Math.sin(time * 1.5 + ox * 0.5) * Math.cos(time * 1.2 + oy * 0.5) * 0.2;
            
            // 2. Scroll Glitch (Digital Distortion)
            const glitch = (Math.random() - 0.5) * Math.abs(scrollSpeed) * 3; // Occasional spikes

            // 3. Mouse Repulsion (Liquid Field)
            // Calculate distance from this vertex (projected) to mouse
            // Simple approximation: check World Position vs Mouse Screen Position
            // Actually, let's keep it simple: Mouse moves a "Force Field" center
            
            // Calculate distance to "Interaction Point" which rotates with the object
            // This makes the liquid stick to the object surface
            const dist = Math.sqrt(
                Math.pow(ox * 2 - mouseVector.x * 5, 2) + 
                Math.pow(oy * 2 - mouseVector.y * 5, 2)
            );

            // Repulsion strength
            const repulsion = Math.max(0, 1.5 - dist) * 0.5; // Only affect close vertices

            // Combine forces
            const scalar = 1 + noise + glitch + repulsion;

            positions[ix] = ox * scalar;
            positions[iy] = oy * scalar;
            positions[iz] = oz * scalar;
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
// 14. 3D PARALLAX TILT ON PROJECT CARDS
// ============================================
function initCardTilt() {
    // Desktop only
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const wrapper = card.querySelector('.project-img-wrapper');
        if (!wrapper) return;

        // Add perspective to parent
        card.style.perspective = '800px';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // cursor X relative to card
            const y = e.clientY - rect.top; // cursor Y relative to card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (-8 to 8 degrees)
            const rotateY = ((x - centerX) / centerX) * 8;
            const rotateX = ((centerY - y) / centerY) * 8;

            // Apply 3D transform with smooth GSAP
            gsap.to(wrapper, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.02,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 800
            });

            // Subtle glow effect based on cursor position
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            wrapper.style.boxShadow = `0 20px 60px rgba(76, 201, 240, 0.15)`;
            wrapper.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(76,201,240,0.08) 0%, #111 70%)`;
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(wrapper, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });
            wrapper.style.boxShadow = 'none';
            wrapper.style.background = '#111';
        });
    });
}

// ============================================
// 15. ANIMATED STAT COUNTERS
// ============================================
function initStatCounters() {
    const statNums = document.querySelectorAll('.stat-box .num');
    if (!statNums.length) return;

    const animateCounter = (el) => {
        const text = el.textContent.trim();
        // Parse ending number and suffix (e.g., "08+" → 8, "+")
        const match = text.match(/^(\d+)(.*?)$/);
        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = match[2]; // "+", etc.
        const padLength = match[1].length; // preserve leading zeros

        // Use GSAP for smooth counting
        const counter = { val: 0 };
        gsap.to(counter, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                const current = Math.floor(counter.val);
                el.textContent = String(current).padStart(padLength, '0') + suffix;
            },
            onComplete: () => {
                el.textContent = String(target).padStart(padLength, '0') + suffix;
            }
        });
    };

    // Use IntersectionObserver to trigger on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(num => {
        // Store original text
        num.dataset.originalText = num.textContent.trim();
        // Set initial state to zero
        const match = num.textContent.trim().match(/^(\d+)(.*?)$/);
        if (match) {
            num.textContent = '0'.repeat(match[1].length) + match[2];
        }
        observer.observe(num);
    });
}

// ============================================
// 16. SECTION FADE-UP REVEALS
// ============================================
function initSectionReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Experience - Timeline entries
    gsap.utils.toArray('.timeline-entry').forEach((entry, i) => {
        gsap.from(entry, {
            scrollTrigger: {
                trigger: entry,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            delay: i * 0.15,
            ease: 'power3.out'
        });
    });

    // Achievements - Award boxes
    gsap.utils.toArray('.award-box').forEach((box, i) => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Stats row
    gsap.from('.stats-row', {
        scrollTrigger: {
            trigger: '.stats-row',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Skills ticker
    gsap.from('.skills-ticker', {
        scrollTrigger: {
            trigger: '.skills-ticker',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Contact form
    gsap.from('.minimal-form', {
        scrollTrigger: {
            trigger: '.minimal-form',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Social grid
    gsap.from('.social-grid', {
        scrollTrigger: {
            trigger: '.social-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
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
            
            // 1. Check if under construction
            if (!url || url === '#' || url === '') {
                e.preventDefault();
                showNotification("🚧 Project Under Construction");
                return;
            }

            // 2. Open valid URLs in modal (except mailto)
            if (url && !url.startsWith('mailto')) {
                e.preventDefault();
                openModal(url);
            }
        });
    });

    // Helper: Simple Toast Notification
    function showNotification(message) {
        // Remove existing
        const existing = document.querySelector('.custom-toast');
        if(existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: 'white',
            color: 'black',
            padding: '15px 30px',
            borderRadius: '50px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            opacity: '0',
            transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
            zIndex: '100000',
            pointerEvents: 'none'
        });

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // Assuming these functions are part of a larger AudioSystem class or object
    // For this edit, they are placed as standalone functions within initProjectViewer
    // to match the provided context, but ideally they would be methods of an AudioSystem.
    // Placeholder for `this` context:
    let isMuted = true; // Default state
    let audioContext = null;
    let masterGainNode = null;
    let audioInitialized = false; // To track if audio system has been initialized

    // Placeholder for init() if it were a class method
    function initAudioSystem() {
        if (audioInitialized) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGainNode = audioContext.createGain();
        masterGainNode.gain.value = 0; // Start muted
        masterGainNode.connect(audioContext.destination);
        audioInitialized = true;
        console.log("Audio System Initialized (Placeholder)");
    }


    // Audio System Class
    class AudioSystem {
        constructor() {
            this.context = null;
            this.droneOscillators = [];
            this.masterGain = null;
            this.isMuted = true;
            this.initialized = false;
            
            // Playlist Logic
            this.bgMusic = new Audio();
            this.bgMusic.volume = 0.2; // Background level
            this.currentTrackIndex = 0;
            this.totalTracks = 3; // 3 songs in songs folder
            this.isPlaying = false;
            
            this.setupUI();
            this.setupListeners();
        }

        init() {
            if (this.initialized) return;
            
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();
                this.masterGain = this.context.createGain();
                this.masterGain.connect(this.context.destination);
                this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.context.currentTime); 
                
                this.startDrone();
                this.playTrack(1); // Start with song1.mp3
                
                this.initialized = true;
                console.log("Audio System Online");
            } catch (e) {
                console.error("Audio Init Failed", e);
            }
        }

        playTrack(index) {
            // Wrap around
            if (index > this.totalTracks) index = 1;
            if (index < 1) index = this.totalTracks;
            
            this.currentTrackIndex = index;
            
            // Song name map
            const songNames = {
                1: 'NAPOLEON × RAMMSTEIN',
                2: 'DERNIÈRE DANSE — INDILA',
                3: 'SKYFALL — ADELE'
            };
            
            this.bgMusic.src = `songs/song${index}.mp3`;
            
            // When ended, play next
            this.bgMusic.onended = () => {
                this.playTrack(this.currentTrackIndex + 1);
            };
            
            // Update UI with real song name
            const name = songNames[index] || `TRACK ${index}`;
            this.updateNowPlaying(name, index);

            if (!this.isMuted) {
                this.bgMusic.play().catch(e => console.log("Waiting for interaction"));
            }
        }

        updateNowPlaying(name, index) {
            const trackText = document.querySelector('.track-text');
            const trackNum = document.querySelector('.track-num');
            if (trackText) {
                trackText.innerHTML = `NOW PLAYING: ${name} • ${name} • NOW PLAYING: ${name} • ${name} • `;
            }
            if (trackNum) {
                trackNum.textContent = `${String(index).padStart(2, '0')} / ${String(this.totalTracks).padStart(2, '0')}`;
            }
        }

        startDrone() {
            // ... (Existing drone logic)
            // Only run drone if we want it MIXED with music, or maybe disable it if music plays?
            // Let's keep it as a subtle underlayer for "Void" atmosphere
            const fund = 55; 
            const ratios = [1, 1.5, 2.02];
            
            ratios.forEach(ratio => {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();
                const filter = this.context.createBiquadFilter();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(fund * ratio, this.context.currentTime);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(200, this.context.currentTime);
                
                const lfo = this.context.createOscillator();
                lfo.type = 'sine';
                lfo.frequency.value = 0.1;
                const lfoGain = this.context.createGain();
                lfoGain.gain.value = 100;
                lfo.connect(lfoGain);
                lfoGain.connect(filter.frequency);
                lfo.start();

                gain.gain.setValueAtTime(0.05, this.context.currentTime); // Lower drone vol

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                
                this.droneOscillators.push(osc);
            });
        }

        toggleMute(btn) {
            if (!this.initialized) this.init(); 
            
            this.isMuted = !this.isMuted;
            btn.innerHTML = this.isMuted ? 'AUDIO SYSTEM: <span style="color:#666">OFFLINE</span>' : 'AUDIO SYSTEM: <span style="color:#4cc9f0">ONLINE</span>';
            btn.style.borderColor = this.isMuted ? 'rgba(255,255,255,0.2)' : '#4cc9f0';
            
            if (this.context && this.context.state === 'suspended') {
                this.context.resume();
            }

            if (this.masterGain) {
                const targetGain = this.isMuted ? 0 : 0.4;
                this.masterGain.gain.setTargetAtTime(targetGain, this.context.currentTime, 0.1);
            }

            // Handle Music
            if (this.isMuted) {
                this.bgMusic.pause();
            } else {
                this.bgMusic.play().catch(e => console.log("Autoplay blocked"));
            }
        }

        setupUI() {
            // 1. Mute Toggle (Bottom Right - Enhanced)
            const btn = document.createElement('button');
            btn.innerHTML = 'AUDIO SYSTEM: <span style="color:#666">OFFLINE</span>';
            btn.className = 'audio-control tech-btn';
            Object.assign(btn.style, {
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                zIndex: '10000',
                background: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '12px 24px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s ease'
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = '#4cc9f0';
                btn.style.boxShadow = '0 0 15px rgba(76, 201, 240, 0.3)';
            });
            btn.addEventListener('mouseleave', () => {
                if(this.isMuted) { // Use 'this.isMuted'
                    btn.style.borderColor = 'rgba(255,255,255,0.2)';
                    btn.style.boxShadow = 'none';
                }
            });

            btn.onclick = () => this.toggleMute(btn); // Use 'this.toggleMute'
            document.body.appendChild(btn);

            // 2. Playlist Widget (Bottom Left) — Premium Player
            const playlistContainer = document.createElement('div');
            playlistContainer.className = 'playlist-widget';
            Object.assign(playlistContainer.style, {
                position: 'fixed',
                bottom: '40px',
                left: '40px',
                zIndex: '9990',
                fontFamily: 'var(--font-display)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.7rem',
                letterSpacing: '1px',
                textAlign: 'left',
                maxWidth: '300px'
            });

            playlistContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 700; color: white; font-size: 0.7rem;">ENGINEERING SOUNDTRACK</span>
                    <span class="track-num" style="color: #4cc9f0; font-size: 0.65rem;">01 / 03</span>
                </div>
                <div class="scrolling-track" style="overflow: hidden; width: 250px; white-space: nowrap; margin-bottom: 10px;">
                    <div class="track-text" style="display: inline-block;">
                        NAPOLEON × RAMMSTEIN • DERNIÈRE DANSE — INDILA • SKYFALL — ADELE • NAPOLEON × RAMMSTEIN • DERNIÈRE DANSE — INDILA • SKYFALL — ADELE •
                    </div>
                </div>
                <div class="player-controls" style="display: flex; align-items: center; gap: 12px; pointer-events: auto;">
                    <button class="ctrl-btn prev-btn" aria-label="Previous track" style="background: none; border: 1px solid rgba(255,255,255,0.2); color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">◀</button>
                    <button class="ctrl-btn next-btn" aria-label="Next track" style="background: none; border: 1px solid rgba(255,255,255,0.2); color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">▶</button>
                </div>
            `;
            document.body.appendChild(playlistContainer);

            // Wire up controls
            const prevBtn = playlistContainer.querySelector('.prev-btn');
            const nextBtn = playlistContainer.querySelector('.next-btn');
            
            prevBtn.addEventListener('click', () => {
                if (!this.initialized) this.init();
                this.playTrack(this.currentTrackIndex - 1);
                if (this.isMuted) {
                    this.toggleMute(document.querySelector('.audio-control'));
                }
            });
            
            nextBtn.addEventListener('click', () => {
                if (!this.initialized) this.init();
                this.playTrack(this.currentTrackIndex + 1);
                if (this.isMuted) {
                    this.toggleMute(document.querySelector('.audio-control'));
                }
            });

            // Hover glow on control buttons
            playlistContainer.querySelectorAll('.ctrl-btn').forEach(b => {
                b.addEventListener('mouseenter', () => {
                    b.style.borderColor = '#4cc9f0';
                    b.style.color = '#4cc9f0';
                    b.style.boxShadow = '0 0 10px rgba(76,201,240,0.3)';
                });
                b.addEventListener('mouseleave', () => {
                    b.style.borderColor = 'rgba(255,255,255,0.2)';
                    b.style.color = 'white';
                    b.style.boxShadow = 'none';
                });
            });

            // Animate Marquee
            gsap.to('.track-text', {
                x: '-50%',
                duration: 15,
                repeat: -1,
                ease: 'linear'
            });
        }

        setupListeners() {
            // Add any other global listeners here if needed
        }
    }

    // Instantiate the AudioSystem
    const audioSystem = new AudioSystem();

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

