// 1. SETUP THREE.JS SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. GENERATE THE "LUMINA" PARTICLE SPHERE
const geometry = new THREE.BufferGeometry();
const particlesCount = 10000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

// Define colors (Neon Cyan to Electric Purple)
const color1 = new THREE.Color(0x00ffcc);
const color2 = new THREE.Color(0xff00ff);

for(let i = 0; i < particlesCount; i++) {
    // Math to create a hollow sphere
    const radius = 2 + Math.random() * 0.5;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i*3]     = radius * Math.sin(phi) * Math.cos(theta); // X
    positions[i*3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // Y
    positions[i*3 + 2] = radius * Math.cos(phi);                   // Z

    // Mix the two colors randomly for each particle
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
particleMesh.scale.set(0.001, 0.001, 0.001); // Start invisible
scene.add(particleMesh);

camera.position.z = 5;

// 3. CONTINUOUS ROTATION LOOP
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.002;
    particleMesh.rotation.y = time;
    particleMesh.rotation.z = time * 0.5;
    renderer.render(scene, camera);
}
animate();

// 4. THE CINEMATIC TIMELINE (GSAP)
const tl = gsap.timeline();

// Step A: Fake the system loading percentage (0 to 100)
let progressObj = { value: 0 };
tl.to(progressObj, {
    value: 100,
    duration: 2.5,
    ease: "power2.inOut",
    onUpdate: () => {
        document.getElementById('progress').innerText = Math.round(progressObj.value) + "%";
    }
});

// Step B: The sphere rapidly expands from nothing
tl.to(particleMesh.scale, {
    x: 1, y: 1, z: 1,
    duration: 2,
    ease: "expo.out"
}, "-=0.5"); // Starts slightly before the loading finishes

// Step C: Loading text fades out, camera flies THROUGH the particles
tl.to('.loader-text', { opacity: 0, duration: 0.5 }, "+=0.5");
tl.to(camera.position, {
    z: 0.1, // Pushes camera right into the center of the sphere
    duration: 1.5,
    ease: "power4.inOut"
}, "-=0.2");

// Step D: The main title reveals itself with a massive scale effect
tl.to('.main-title', {
    opacity: 1,
    scale: 1,
    duration: 2,
    ease: "back.out(1.5)"
}, "-=0.5");

// 5. HANDLE BROWSER RESIZING
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
