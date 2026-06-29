// Three.js Neural Network Animation Background
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    let scene, camera, renderer;
    let particleSystem, geometry;
    const particleCount = 100;
    const maxDistance = 120;
    const particles = [];
    const lineGeometry = new THREE.BufferGeometry();
    let lineMesh;

    function init() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 400;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Particle creation
        geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Create particle object with position and velocity
            const particle = {
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
                z: (Math.random() - 0.5) * 500,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                vz: (Math.random() - 0.5) * 0.8
            };
            particles.push(particle);

            positions[i * 3] = particle.x;
            positions[i * 3 + 1] = particle.y;
            positions[i * 3 + 2] = particle.z;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Particle material
        const textureLoader = new THREE.TextureLoader();
        // A simple circular white dot sprite (drawn dynamically if offline or using fallback)
        const material = new THREE.PointsMaterial({
            color: 0x06B6D4,
            size: 4,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        // Points
        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        // Lines connecting points
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineMesh);

        window.addEventListener('resize', onWindowResize);
        animate();
    }

    function animate() {
        requestAnimationFrame(animate);

        const positions = geometry.attributes.position.array;
        const linePositions = [];
        const lineColors = [];

        // Update positions based on velocity
        for (let i = 0; i < particleCount; i++) {
            const particle = particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;

            // Boundaries collision
            if (particle.x < -window.innerWidth / 2 || particle.x > window.innerWidth / 2) particle.vx *= -1;
            if (particle.y < -window.innerHeight / 2 || particle.y > window.innerHeight / 2) particle.vy *= -1;
            if (particle.z < -250 || particle.z > 250) particle.vz *= -1;

            positions[i * 3] = particle.x;
            positions[i * 3 + 1] = particle.y;
            positions[i * 3 + 2] = particle.z;
        }

        geometry.attributes.position.needsUpdate = true;

        // Build connections
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dz = particles[i].z - particles[j].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDistance) {
                    linePositions.push(particles[i].x, particles[i].y, particles[i].z);
                    linePositions.push(particles[j].x, particles[j].y, particles[j].z);
                }
            }
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        
        // Gentle rotation of the overall network
        particleSystem.rotation.y += 0.001;
        lineMesh.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    init();
});
