// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. THREE.JS SCENE SETUP
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// 2. CREATE THE AETHER CORE (Particle Sphere)
const geometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

// Create a sphere of particles
for(let i = 0; i < particlesCount * 3; i++) {
    // Generate points on a sphere using math
    const radius = 2;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * radius;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    posArray[i] = x;
    posArray[i+1] = y;
    posArray[i+2] = z;
    i += 2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Custom material for glowing particles
const material = new THREE.PointsMaterial({
    size: 0.015,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

camera.position.z = 5;

// 3. ANIMATION LOOP (Constant rotation)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Slow cinematic rotation
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    renderer.render(scene, camera);
}
animate();

// 4. GSAP SCROLL ANIMATIONS (The "Cinematic" part)

// Scroll: Zoom into the core
gsap.to(camera.position, {
    z: 2,
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".feature-1",
        start: "top bottom",
        end: "bottom top",
        scrub: 1 // Links animation directly to scrollbar
    }
});

// Scroll: Change core color to Hyper-Magenta
gsap.to(material.color, {
    r: 1.0,  // Red
    g: 0.0,  // Green
    b: 0.5,  // Blue (Makes Pink/Magenta)
    ease: "none",
    scrollTrigger: {
        trigger: ".feature-2",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});

// Scroll: Explode the particles outward at the end
gsap.to(particlesMesh.scale, {
    x: 5,
    y: 5,
    z: 5,
    ease: "power3.in",
    scrollTrigger: {
        trigger: ".outro",
        start: "top bottom",
        end: "center center",
        scrub: 1
    }
});

// 5. RESPONSIVE RESIZING
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
