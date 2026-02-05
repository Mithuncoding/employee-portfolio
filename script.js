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

    // 5. ENHANCED PRELOADER
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
    const totalDuration = 2000; // 2 seconds total load time
    const intervalTime = 20; // Update every 20ms
    const increment = (100 / (totalDuration / intervalTime)); 

    const loaderInterval = setInterval(() => {
        progress += increment;
        
        // Randomize progress slightly for realism
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

    // 6. FIREBASE CONTACT FORM
    // PASTE YOUR FIREBASE CONFIG HERE FROM THE CONSOLE
    const firebaseConfig = {
        apiKey: "AIzaSyAU9YrlJNnSrEgs1653gJH1Vr-I13Zz7H0",
        authDomain: "port-ca47b.firebaseapp.com",
        projectId: "port-ca47b",
        storageBucket: "port-ca47b.firebasestorage.app",
        messagingSenderId: "504012788135",
        appId: "1:504012788135:web:a9a05ece89aa1520816682"
    };



    // Initialize Firebase only if config is valid
    let db;
    if (firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith("AIza")) {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log("Firebase initialized successfully");
        } catch (e) {
            console.error("Firebase initialization failed:", e);
        }
    }

    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const btn = document.querySelector('.magnetic-cta');
            
            // Visual Feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="btn-text">SENDING...</span>';
            
            if (db) {
                // Actual Firebase Submission
                db.collection("messages").add({
                    name: name,
                    email: email,
                    message: message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    btn.innerHTML = '<span class="btn-text">MESSAGE SENT ✓</span>';
                    btn.style.borderColor = "#00ff88";
                    btn.style.color = "#00ff88";
                    contactForm.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.borderColor = "white";
                        btn.style.color = "white";
                    }, 4000);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    btn.innerHTML = '<span class="btn-text">ERROR, TRY AGAIN</span>';
                    btn.style.borderColor = "#ff3b30";
                    btn.style.color = "#ff3b30";
                });
            } else {
                // Config missing fallback
                console.warn("Firebase config missing. Form not actually sent.");
                setTimeout(() => {
                    btn.innerHTML = '<span class="btn-text">SETUP FIREBASE FIRST</span>';
                    setTimeout(() => { btn.innerHTML = originalText; }, 3000);
                }, 1000);
            }
        });
    }

    // 7. LOCAL TIME CLOCK
    function updateTime() {
        const timeDisplay = document.getElementById('local-time');
        if(timeDisplay) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            timeDisplay.textContent = timeString;
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

});


// ============================================
// THREE.JS IMPLEMENTATION
// ============================================
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001); // Depth fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry - "The Brain/Core"
    // Reduce detail on mobile for performance
    const detail = window.innerWidth < 768 ? 16 : 64;
    const geometry = new THREE.IcosahedronGeometry(2, detail);
    
    // Material - Wireframe style for "Tech" look
    const material = new THREE.MeshBasicMaterial({
        color: 0x444444,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    // Add a second mesh for the "Glow" or inner volume
    const innerMaterial = new THREE.MeshNormalMaterial({
        wireframe: false,
        flatShading: true,
        transparent: true,
        opacity: 0.1 // Very faint inner core
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    const innerSphere = new THREE.Mesh(geometry, innerMaterial);
    
    // Group them
    const coreGroup = new THREE.Group();
    coreGroup.add(sphere);
    // coreGroup.add(innerSphere); // Optional, maybe too heavy/distracting
    scene.add(coreGroup);

    // Lights (even though BasicMaterial doesn't need them, good for future)
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

    // CORE PULSE / NOISE ANIMATION
    // We'll manually displace vertices to create a "breathing" liquid effect
    const originalPositions = geometry.attributes.position.array.slice(); // Copy original
    const count = geometry.attributes.position.count;

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        const time = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Smooth rotation
        coreGroup.rotation.y += 0.5 * (targetX - coreGroup.rotation.y);
        coreGroup.rotation.x += 0.5 * (targetY - coreGroup.rotation.x);
        coreGroup.rotation.z += 0.005; // Constant drift

        // Vertex Displacement (Warning: heavy on CPU, simple sine waves for now)
        // Ideally utilize a Vertex Shader for this, but keeping it simple for JS file
        const positionAttribute = geometry.attributes.position;
        const positions = positionAttribute.array;

        for (let i = 0; i < count; i++) {
            const x = originalPositions[i * 3];
            const y = originalPositions[i * 3 + 1];
            const z = originalPositions[i * 3 + 2];

            // Create noise-like movement using sine waves
            // "Breathing" effect
            const modifier = 1 + Math.sin(time * 2 + x * 2) * 0.05 + Math.cos(time * 1.5 + y) * 0.05;
            
            positions[i * 3] = x * modifier;
            positions[i * 3 + 1] = y * modifier;
            positions[i * 3 + 2] = z * modifier;
        }
        
        positionAttribute.needsUpdate = true;
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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
