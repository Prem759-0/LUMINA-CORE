// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. SETUP THREE.JS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. GENERATE PARTICLE SPHERE
const geometry = new THREE.BufferGeometry();
const particlesCount = 15000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);
const color1 = new THREE.Color(0x00ffcc);
const color2 = new THREE.Color(0xff00ff);

for(let i = 0; i < particlesCount; i++) {
    const radius = 2 + Math.random() * 0.5;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i*3]     = radius * Math.sin(phi) * Math.cos(theta);
    positions[i*3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i*3 + 2] = radius * Math.cos(phi);

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i*3]     = mixedColor.r;
    colors[i*3 + 1] = mixedColor.g;
    colors[i*3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
});

const particleMesh = new THREE.Points(geometry, material);
particleMesh.scale.set(0.001, 0.001, 0.001); 
scene.add(particleMesh);
camera.position.z = 5;

// 3. CONTINUOUS ROTATION
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.002;
    particleMesh.rotation.y = time;
    particleMesh.rotation.z = time * 0.5;
    renderer.render(scene, camera);
}
animate();

// ==========================================
// 4. THE CINEMATIC INTRO TIMELINE
// ==========================================
const introTl = gsap.timeline({
    onComplete: () => {
        // UNLOCK SCROLLING WHEN INTRO IS DONE
        document.body.style.overflowY = 'auto';
        gsap.to('.scroll-indicator', { opacity: 1, duration: 1 });
    }
});

let progressObj = { value: 0 };
introTl.to(progressObj, {
    value: 100,
    duration: 2.5,
    ease: "power2.inOut",
    onUpdate: () => document.getElementById('progress').innerText = Math.round(progressObj.value) + "%"
})
.to(particleMesh.scale, { x: 1, y: 1, z: 1, duration: 2, ease: "expo.out" }, "-=0.5")
.to('.loader-text', { opacity: 0, duration: 0.5 }, "+=0.5")
.to(camera.position, { z: 0.1, duration: 1.5, ease: "power4.inOut" }, "-=0.2") // Camera flies inside
.to('.main-title', { opacity: 1, scale: 1, duration: 2, ease: "back.out(1.5)" }, "-=0.5");


// ==========================================
// 5. THE SCROLL-TRIGGERED EXPLOSION
// ==========================================

// Scroll Event 1: Pull camera back & stretch particles into a galaxy ring
gsap.to(camera.position, {
    z: 8, // Pull camera way back out
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".text-left", // Triggers when first text panel comes into view
        start: "top bottom",
        end: "center center",
        scrub: 1 // Makes animation tie perfectly to the scroll wheel
    }
});

gsap.to(particleMesh.scale, {
    x: 4, 
    y: 0.2, // Flattens it like a disc/galaxy
    z: 4,
    ease: "none",
    scrollTrigger: {
        trigger: ".text-left",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});

// Scroll Event 2: Title fades out as you start scrolling
gsap.to('.intro-layer', {
    opacity: 0,
    scrollTrigger: {
        trigger: ".text-left",
        start: "top bottom",
        end: "top center",
        scrub: true
    }
});

// Scroll Event 3: Compress into a dense column, change color bias to purple
gsap.to(particleMesh.scale, {
    x: 0.5, 
    y: 10, // Stretches it vertically
    z: 0.5,
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".text-right",
        start: "top bottom",
        end: "center center",
        scrub: 1
    }
});

// 6. RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
