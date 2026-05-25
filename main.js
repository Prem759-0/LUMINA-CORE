gsap.registerPlugin(ScrollTrigger);

// 1. SETUP THREE.JS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. GENERATE PARTICLE CORE
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

// Variables for Mouse Parallax
let mouseX = 0; let mouseY = 0; let targetX = 0; let targetY = 0;
const windowHalfX = window.innerWidth / 2; const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.002;
    mouseY = (event.clientY - windowHalfY) * 0.002;
});

// 3. CONTINUOUS ROTATION & PARALLAX LOOP
let time = 0;
// We create an object to hold the global rotation speed so we can animate it later
const speed = { rotation: 0.002 }; 

function animate() {
    requestAnimationFrame(animate);
    time += speed.rotation;
    
    particleMesh.rotation.y = time;
    particleMesh.rotation.z = time * 0.5;

    targetX = mouseX * 2; targetY = mouseY * 2;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;

    renderer.render(scene, camera);
}
animate();

// ==========================================
// 4. THE CINEMATIC INTRO TIMELINE (Scene 1)
// ==========================================
const introTl = gsap.timeline({
    onComplete: () => {
        document.body.style.overflowY = 'auto'; // Unlock scroll
        gsap.to('.scroll-indicator', { opacity: 1, duration: 1 });
    }
});

let progressObj = { value: 0 };
introTl.to(progressObj, {
    value: 100, duration: 2.5, ease: "power2.inOut",
    onUpdate: () => document.getElementById('progress').innerText = Math.round(progressObj.value) + "%"
})
.to(particleMesh.scale, { x: 1, y: 1, z: 1, duration: 2, ease: "expo.out" }, "-=0.5")
.to('.loader-text', { opacity: 0, duration: 0.5 }, "+=0.5")
.to(camera.position, { z: 0.1, duration: 1.5, ease: "power4.inOut" }, "-=0.2")
.to('.main-title', { opacity: 1, scale: 1, duration: 2, ease: "back.out(1.5)" }, "-=0.5");


// ==========================================
// 5. SCROLL TRIGGER ANIMATIONS (Scene 2, 3, 4)
// ==========================================

gsap.to('.intro-layer', {
    opacity: 0, scrollTrigger: { trigger: ".text-left", start: "top bottom", end: "top center", scrub: true }
});

// Scene 2.1: Pull back & Flatten into Galaxy
gsap.to(camera.position, {
    z: 8, ease: "power2.inOut", scrollTrigger: { trigger: ".text-left", start: "top bottom", end: "center center", scrub: 1 }
});
gsap.to(particleMesh.scale, {
    x: 4, y: 0.2, z: 4, ease: "none", scrollTrigger: { trigger: ".text-left", start: "top bottom", end: "bottom top", scrub: 1 }
});

// Scene 2.2: Compress into Vertical Pillar
gsap.to(particleMesh.scale, {
    x: 0.5, y: 10, z: 0.5, ease: "power2.inOut", scrollTrigger: { trigger: ".text-right", start: "top bottom", end: "center center", scrub: 1 }
});

// Scene 3: THE CORE DIVE (Push camera INSIDE the pillar)
gsap.to(camera.position, {
    z: -2, ease: "power3.inOut", scrollTrigger: { trigger: ".center-terminal", start: "top bottom", end: "center center", scrub: 1 }
});

// Scene 4: THE COLLAPSE (Singularity)
const outroTl = gsap.timeline({
    scrollTrigger: { trigger: ".outro", start: "top bottom", end: "center center", scrub: 1 }
});

// Pull camera out rapidly, shrink the mesh to nothing, and speed up rotation
outroTl.to(camera.position, { z: 15, ease: "power2.in" })
       .to(particleMesh.scale, { x: 0, y: 0, z: 0, ease: "power3.in" }, "<")
       .to(speed, { rotation: 0.05, ease: "power2.in" }, "<"); // Spin crazy fast as it dies

// 6. RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
